package scan

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"html"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"sync"
	"time"

	"gopkg.in/yaml.v3"
)

const (
	defaultConfigPath = "portals.yml"
	defaultOutPath    = "output/ingested-jobs.json"
	defaultHistory    = "data/scan-history.tsv"
	requestTimeout    = 18 * time.Second
	maxBodyBytes      = 4 << 20
	maxWorkers        = 12
	defaultMinSources = 100
)

type Config struct {
	TitleFilter      TitleFilter `yaml:"title_filter"`
	SearchQueries    []Query     `yaml:"search_queries"`
	TrackedCompanies []Company   `yaml:"tracked_companies"`
}

type TitleFilter struct {
	Positive       []string `yaml:"positive"`
	Negative       []string `yaml:"negative"`
	SeniorityBoost []string `yaml:"seniority_boost"`
}

type Query struct {
	Name    string `yaml:"name"`
	Query   string `yaml:"query"`
	Enabled *bool  `yaml:"enabled"`
}

type Company struct {
	Name       string `yaml:"name"`
	CareersURL string `yaml:"careers_url"`
	API        string `yaml:"api"`
	ScanMethod string `yaml:"scan_method"`
	ScanQuery  string `yaml:"scan_query"`
	Enabled    *bool  `yaml:"enabled"`
}

type Options struct {
	ConfigPath       string
	OutPath          string
	HistoryPath      string
	PipelinePath     string
	Limit            int
	MinSources       int
	NoWebSearch      bool
	NoDefaultSources bool
	UpdateHistory    bool
	UpdatePipeline   bool
}

type Job struct {
	Title     string `json:"title"`
	Company   string `json:"company"`
	URL       string `json:"url"`
	Portal    string `json:"portal"`
	Source    string `json:"source"`
	Status    string `json:"status"`
	Reason    string `json:"reason,omitempty"`
	Score     int    `json:"score"`
	FoundAt   string `json:"found_at"`
	Signature string `json:"signature"`
}

type Summary struct {
	Date           string   `json:"date"`
	ConfigPath     string   `json:"config_path"`
	OutPath        string   `json:"out_path"`
	SourcesPlanned int      `json:"sources_planned"`
	TotalFound     int      `json:"total_found"`
	Added          int      `json:"added"`
	SkippedTitle   int      `json:"skipped_title"`
	SkippedDup     int      `json:"skipped_dup"`
	SkippedExpired int      `json:"skipped_expired"`
	Warnings       []string `json:"warnings,omitempty"`
	Jobs           []Job    `json:"jobs"`
}

type Scanner struct {
	client *http.Client
}

func NewScanner() *Scanner {
	return &Scanner{client: &http.Client{Timeout: requestTimeout}}
}

func Run(ctx context.Context, opts Options) (*Summary, error) {
	return NewScanner().Run(ctx, opts)
}

func (s *Scanner) Run(ctx context.Context, opts Options) (*Summary, error) {
	if opts.ConfigPath == "" {
		opts.ConfigPath = defaultConfigPath
	}
	if opts.OutPath == "" {
		opts.OutPath = defaultOutPath
	}
	if opts.HistoryPath == "" {
		opts.HistoryPath = defaultHistory
	}
	if opts.PipelinePath == "" {
		opts.PipelinePath = "data/pipeline.md"
	}
	if opts.Limit <= 0 {
		opts.Limit = 50
	}
	if opts.MinSources <= 0 {
		opts.MinSources = defaultMinSources
	}

	cfg, err := LoadConfig(opts.ConfigPath)
	if err != nil {
		return nil, err
	}
	if !opts.NoDefaultSources {
		augmentConfigSources(cfg, opts.MinSources)
	}

	seenURLs, seenKeys := loadDedupSources(opts.HistoryPath, "data/applications.md", "data/pipeline.md")
	found, warnings, sourcesPlanned := s.discover(ctx, cfg, opts)
	result := s.classify(found, cfg.TitleFilter, seenURLs, seenKeys, opts.Limit)

	summary := &Summary{
		Date:           time.Now().Format("2006-01-02"),
		ConfigPath:     opts.ConfigPath,
		OutPath:        opts.OutPath,
		SourcesPlanned: sourcesPlanned,
		TotalFound:     len(found),
		Warnings:       warnings,
		Jobs:           result,
	}
	for _, job := range result {
		switch job.Status {
		case "added":
			summary.Added++
		case "skipped_title":
			summary.SkippedTitle++
		case "skipped_dup":
			summary.SkippedDup++
		case "skipped_expired":
			summary.SkippedExpired++
		}
	}

	if err := writeJSON(opts.OutPath, summary); err != nil {
		return nil, err
	}
	if opts.UpdateHistory {
		if err := appendHistory(opts.HistoryPath, result); err != nil {
			return nil, err
		}
	}
	if opts.UpdatePipeline {
		if err := appendPipeline(opts.PipelinePath, result); err != nil {
			return nil, err
		}
	}
	return summary, nil
}

func LoadConfig(path string) (*Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read scan config: %w", err)
	}
	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, fmt.Errorf("parse scan config: %w", err)
	}
	return &cfg, nil
}

func (s *Scanner) discover(ctx context.Context, cfg *Config, opts Options) ([]Job, []string, int) {
	var mu sync.Mutex
	var jobs []Job
	var warnings []string
	sourcesPlanned := 0
	work := make(chan func() ([]Job, error))
	var wg sync.WaitGroup

	for i := 0; i < maxWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for fn := range work {
				batch, err := fn()
				mu.Lock()
				if err != nil {
					warnings = append(warnings, err.Error())
				}
				jobs = append(jobs, batch...)
				mu.Unlock()
			}
		}()
	}

	for _, company := range cfg.TrackedCompanies {
		company := company
		if !enabled(company.Enabled) {
			continue
		}
		if company.API != "" || company.CareersURL != "" {
			sourcesPlanned++
			work <- func() ([]Job, error) {
				return s.scanCompany(ctx, company)
			}
		}
		if !opts.NoWebSearch && company.ScanQuery != "" {
			sourcesPlanned++
			work <- func() ([]Job, error) {
				return s.search(ctx, company.ScanQuery, company.Name, company.Name)
			}
		}
	}
	if !opts.NoWebSearch {
		for _, query := range cfg.SearchQueries {
			query := query
			if !enabled(query.Enabled) || strings.TrimSpace(query.Query) == "" {
				continue
			}
			sourcesPlanned++
			work <- func() ([]Job, error) {
				return s.search(ctx, query.Query, query.Name, "")
			}
		}
	}
	close(work)
	wg.Wait()

	return dedupeCandidates(jobs), warnings, sourcesPlanned
}

func (s *Scanner) scanCompany(ctx context.Context, company Company) ([]Job, error) {
	apiURL := strings.TrimSpace(company.API)
	if apiURL == "" {
		apiURL = inferAPI(company.CareersURL)
	}
	if apiURL != "" {
		jobs, err := s.scanAPI(ctx, company, apiURL)
		if err == nil && len(jobs) > 0 {
			return jobs, nil
		}
		if err != nil && company.CareersURL == "" {
			return nil, err
		}
	}
	if company.CareersURL == "" {
		return nil, nil
	}
	return s.scanHTML(ctx, company.CareersURL, company.Name, company.Name)
}

func (s *Scanner) scanAPI(ctx context.Context, company Company, apiURL string) ([]Job, error) {
	host := hostOf(apiURL)
	switch {
	case strings.Contains(host, "greenhouse.io"):
		return s.scanGreenhouse(ctx, company, apiURL)
	case strings.Contains(host, "api.lever.co"):
		return s.scanLever(ctx, company, apiURL)
	case strings.Contains(host, "jobs.ashbyhq.com"):
		return s.scanAshby(ctx, company)
	case strings.Contains(host, "teamtailor.com"):
		return s.scanRSS(ctx, company, apiURL)
	default:
		return nil, fmt.Errorf("unsupported API provider for %s: %s", company.Name, apiURL)
	}
}

func (s *Scanner) scanGreenhouse(ctx context.Context, company Company, apiURL string) ([]Job, error) {
	var payload struct {
		Jobs []struct {
			Title       string `json:"title"`
			AbsoluteURL string `json:"absolute_url"`
		} `json:"jobs"`
	}
	if err := s.getJSON(ctx, apiURL, &payload); err != nil {
		return nil, fmt.Errorf("%s greenhouse scan: %w", company.Name, err)
	}
	jobs := make([]Job, 0, len(payload.Jobs))
	for _, item := range payload.Jobs {
		jobs = append(jobs, newJob(item.Title, company.Name, item.AbsoluteURL, company.Name, "greenhouse_api"))
	}
	return jobs, nil
}

func (s *Scanner) scanLever(ctx context.Context, company Company, apiURL string) ([]Job, error) {
	var payload []struct {
		Text      string `json:"text"`
		HostedURL string `json:"hostedUrl"`
		ApplyURL  string `json:"applyUrl"`
	}
	if err := s.getJSON(ctx, apiURL, &payload); err != nil {
		return nil, fmt.Errorf("%s lever scan: %w", company.Name, err)
	}
	jobs := make([]Job, 0, len(payload))
	for _, item := range payload {
		jobURL := firstNonEmpty(item.HostedURL, item.ApplyURL)
		jobs = append(jobs, newJob(item.Text, company.Name, jobURL, company.Name, "lever_api"))
	}
	return jobs, nil
}

func (s *Scanner) scanAshby(ctx context.Context, company Company) ([]Job, error) {
	slug := rawFirstPathPart(mustPath(company.CareersURL))
	if slug == "" {
		return nil, fmt.Errorf("%s ashby scan: missing Ashby slug", company.Name)
	}
	payload := map[string]any{
		"operationName": "ApiJobBoardWithTeams",
		"variables": map[string]string{
			"organizationHostedJobsPageName": slug,
		},
		"query": `query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) { jobBoard: jobBoardWithTeams(organizationHostedJobsPageName: $organizationHostedJobsPageName) { jobPostings { id title locationName employmentType } } }`,
	}
	var out struct {
		Data struct {
			JobBoard struct {
				JobPostings []struct {
					ID    string `json:"id"`
					Title string `json:"title"`
				} `json:"jobPostings"`
			} `json:"jobBoard"`
		} `json:"data"`
	}
	if err := s.postJSON(ctx, "https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams", payload, &out); err != nil {
		return nil, fmt.Errorf("%s ashby scan: %w", company.Name, err)
	}
	jobs := make([]Job, 0, len(out.Data.JobBoard.JobPostings))
	for _, item := range out.Data.JobBoard.JobPostings {
		jobs = append(jobs, newJob(item.Title, company.Name, fmt.Sprintf("https://jobs.ashbyhq.com/%s/%s", slug, item.ID), company.Name, "ashby_api"))
	}
	return jobs, nil
}

func (s *Scanner) scanRSS(ctx context.Context, company Company, feedURL string) ([]Job, error) {
	var feed struct {
		Channel struct {
			Items []struct {
				Title string `xml:"title"`
				Link  string `xml:"link"`
			} `xml:"item"`
		} `xml:"channel"`
	}
	data, err := s.get(ctx, feedURL)
	if err != nil {
		return nil, fmt.Errorf("%s rss scan: %w", company.Name, err)
	}
	if err := xml.Unmarshal(data, &feed); err != nil {
		return nil, fmt.Errorf("%s rss parse: %w", company.Name, err)
	}
	jobs := make([]Job, 0, len(feed.Channel.Items))
	for _, item := range feed.Channel.Items {
		jobs = append(jobs, newJob(item.Title, company.Name, item.Link, company.Name, "rss"))
	}
	return jobs, nil
}

func (s *Scanner) scanHTML(ctx context.Context, pageURL, portal, defaultCompany string) ([]Job, error) {
	data, err := s.get(ctx, pageURL)
	if err != nil {
		return nil, fmt.Errorf("%s html scan: %w", portal, err)
	}
	return extractJobsFromHTML(data, pageURL, portal, defaultCompany, "career_page"), nil
}

func (s *Scanner) search(ctx context.Context, query, portal, defaultCompany string) ([]Job, error) {
	searchURL := "https://html.duckduckgo.com/html/?q=" + url.QueryEscape(query)
	data, err := s.get(ctx, searchURL)
	if err != nil {
		return nil, fmt.Errorf("%s search: %w", portal, err)
	}
	jobs := extractSearchResults(data, portal, defaultCompany)
	for i := range jobs {
		jobs[i].Source = "web_search"
	}
	return jobs, nil
}

func (s *Scanner) getJSON(ctx context.Context, endpoint string, out any) error {
	data, err := s.get(ctx, endpoint)
	if err != nil {
		return err
	}
	if err := json.Unmarshal(data, out); err != nil {
		return fmt.Errorf("decode JSON: %w", err)
	}
	return nil
}

func (s *Scanner) postJSON(ctx context.Context, endpoint string, payload, out any) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, strings.NewReader(string(body)))
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", "career-ops/1.0 (+https://github.com/khoazandev/career-ops)")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	resp, err := s.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		return fmt.Errorf("HTTP %s", resp.Status)
	}
	data, err := io.ReadAll(io.LimitReader(resp.Body, maxBodyBytes))
	if err != nil {
		return err
	}
	if err := json.Unmarshal(data, out); err != nil {
		return fmt.Errorf("decode JSON: %w", err)
	}
	return nil
}

func (s *Scanner) get(ctx context.Context, endpoint string) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "career-ops/1.0 (+https://github.com/khoazandev/career-ops)")
	req.Header.Set("Accept", "application/json,text/html,application/xml;q=0.9,*/*;q=0.8")
	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		return nil, fmt.Errorf("HTTP %s", resp.Status)
	}
	data, err := io.ReadAll(io.LimitReader(resp.Body, maxBodyBytes))
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (s *Scanner) classify(candidates []Job, filter TitleFilter, seenURLs, seenKeys map[string]bool, limit int) []Job {
	now := time.Now().Format(time.RFC3339)
	out := make([]Job, 0, len(candidates))
	added := 0
	for _, job := range candidates {
		job.Title = cleanText(job.Title)
		job.Company = cleanText(job.Company)
		job.URL = normalizeURL(job.URL)
		job.FoundAt = now
		job.Score = scoreTitle(job.Title, filter)
		job.Signature = signature(job.Company, job.Title, job.URL)
		if job.Title == "" || job.URL == "" {
			continue
		}
		if !passesTitle(job.Title, filter) {
			job.Status = "skipped_title"
			job.Reason = "title_filter"
		} else if seenURLs[job.URL] || seenKeys[dedupKey(job.Company, job.Title)] {
			job.Status = "skipped_dup"
			job.Reason = "already_seen"
		} else if added >= limit {
			job.Status = "skipped_dup"
			job.Reason = "limit_reached"
		} else {
			job.Status = "added"
			added++
			seenURLs[job.URL] = true
			seenKeys[dedupKey(job.Company, job.Title)] = true
		}
		out = append(out, job)
	}
	sort.SliceStable(out, func(i, j int) bool {
		if out[i].Status != out[j].Status {
			return out[i].Status == "added"
		}
		return out[i].Score > out[j].Score
	})
	return out
}

func writeJSON(path string, summary *Summary) error {
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return fmt.Errorf("create output directory: %w", err)
	}
	data, err := json.MarshalIndent(summary, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal scan output: %w", err)
	}
	return os.WriteFile(path, append(data, '\n'), 0644)
}

func appendHistory(path string, jobs []Job) error {
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return fmt.Errorf("create history directory: %w", err)
	}
	needsHeader := false
	if _, err := os.Stat(path); os.IsNotExist(err) {
		needsHeader = true
	}
	f, err := os.OpenFile(path, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		return fmt.Errorf("open scan history: %w", err)
	}
	defer f.Close()
	if needsHeader {
		if _, err := f.WriteString("url\tfirst_seen\tportal\ttitle\tcompany\tstatus\n"); err != nil {
			return err
		}
	}
	date := time.Now().Format("2006-01-02")
	for _, job := range jobs {
		line := strings.Join([]string{
			safeTSV(job.URL),
			date,
			safeTSV(job.Portal),
			safeTSV(job.Title),
			safeTSV(job.Company),
			safeTSV(job.Status),
		}, "\t") + "\n"
		if _, err := f.WriteString(line); err != nil {
			return fmt.Errorf("write scan history: %w", err)
		}
	}
	return nil
}

func appendPipeline(path string, jobs []Job) error {
	var added []Job
	for _, job := range jobs {
		if job.Status == "added" {
			added = append(added, job)
		}
	}
	if len(added) == 0 {
		return nil
	}
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return fmt.Errorf("create pipeline directory: %w", err)
	}
	existing, _ := os.ReadFile(path)
	var b strings.Builder
	if len(existing) == 0 {
		b.WriteString("# Pipeline\n\n## Pending\n")
	} else {
		b.Write(existing)
		if !strings.HasSuffix(string(existing), "\n") {
			b.WriteString("\n")
		}
	}
	for _, job := range added {
		b.WriteString(fmt.Sprintf("- [ ] %s | %s | %s\n", job.URL, job.Company, job.Title))
	}
	if err := os.WriteFile(path, []byte(b.String()), 0644); err != nil {
		return fmt.Errorf("write pipeline: %w", err)
	}
	return nil
}

func loadDedupSources(historyPath, applicationsPath, pipelinePath string) (map[string]bool, map[string]bool) {
	urls := make(map[string]bool)
	keys := make(map[string]bool)
	for _, path := range []string{historyPath, pipelinePath} {
		data, err := os.ReadFile(path)
		if err != nil {
			continue
		}
		for _, match := range regexp.MustCompile(`https?://[^\s|)]+`).FindAllString(string(data), -1) {
			urls[normalizeURL(match)] = true
		}
	}
	data, err := os.ReadFile(applicationsPath)
	if err == nil {
		for _, line := range strings.Split(string(data), "\n") {
			fields := splitTableRow(line)
			if len(fields) >= 4 {
				keys[dedupKey(fields[2], fields[3])] = true
			}
			for _, match := range regexp.MustCompile(`https?://[^\s|)]+`).FindAllString(line, -1) {
				urls[normalizeURL(match)] = true
			}
		}
	}
	return urls, keys
}

func inferAPI(careersURL string) string {
	u, err := url.Parse(careersURL)
	if err != nil {
		return ""
	}
	host := strings.ToLower(u.Host)
	path := strings.Trim(u.Path, "/")
	parts := strings.Split(path, "/")
	switch {
	case strings.Contains(host, "jobs.lever.co") && parts[0] != "":
		return "https://api.lever.co/v0/postings/" + parts[0] + "?mode=json"
	case strings.Contains(host, "jobs.ashbyhq.com") && parts[0] != "":
		return "https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams"
	case strings.Contains(host, "teamtailor.com"):
		return strings.TrimRight(careersURL, "/") + ".rss"
	}
	return ""
}

func extractJobsFromHTML(data []byte, baseURL, portal, defaultCompany, source string) []Job {
	linkRE := regexp.MustCompile(`(?is)<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)</a>`)
	var jobs []Job
	for _, match := range linkRE.FindAllSubmatch(data, -1) {
		href := html.UnescapeString(string(match[1]))
		text := cleanText(stripTags(string(match[2])))
		if !looksLikeJobLink(href, text) {
			continue
		}
		fullURL := resolveURL(baseURL, href)
		title, company := splitTitleCompany(text, defaultCompany)
		jobs = append(jobs, newJob(title, company, fullURL, portal, source))
	}
	return jobs
}

func extractSearchResults(data []byte, portal, defaultCompany string) []Job {
	resultRE := regexp.MustCompile(`(?is)<a[^>]+class=["'][^"']*result__a[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>(.*?)</a>`)
	var jobs []Job
	for _, match := range resultRE.FindAllSubmatch(data, -1) {
		rawURL := decodeDuckURL(html.UnescapeString(string(match[1])))
		if !looksLikeJobURL(rawURL) {
			continue
		}
		titleText := cleanText(stripTags(string(match[2])))
		title, company := splitTitleCompany(titleText, defaultCompany)
		if company == "" {
			company = companyFromURL(rawURL)
		}
		jobs = append(jobs, newJob(title, company, rawURL, portal, "web_search"))
	}
	return jobs
}

func newJob(title, company, jobURL, portal, source string) Job {
	return Job{
		Title:   title,
		Company: company,
		URL:     jobURL,
		Portal:  portal,
		Source:  source,
	}
}

func dedupeCandidates(jobs []Job) []Job {
	seen := make(map[string]bool)
	out := make([]Job, 0, len(jobs))
	for _, job := range jobs {
		job.URL = normalizeURL(job.URL)
		key := job.URL
		if key == "" {
			key = dedupKey(job.Company, job.Title)
		}
		if key == "" || seen[key] {
			continue
		}
		seen[key] = true
		out = append(out, job)
	}
	return out
}

func passesTitle(title string, filter TitleFilter) bool {
	titleLower := strings.ToLower(title)
	if len(filter.Positive) > 0 {
		matched := false
		for _, keyword := range filter.Positive {
			if containsKeyword(titleLower, keyword) {
				matched = true
				break
			}
		}
		if !matched {
			return false
		}
	}
	for _, keyword := range filter.Negative {
		if containsKeyword(titleLower, keyword) {
			return false
		}
	}
	return true
}

func scoreTitle(title string, filter TitleFilter) int {
	score := 0
	titleLower := strings.ToLower(title)
	for _, keyword := range filter.Positive {
		if containsKeyword(titleLower, keyword) {
			score += 10
		}
	}
	for _, keyword := range filter.SeniorityBoost {
		if containsKeyword(titleLower, keyword) {
			score += 3
		}
	}
	return score
}

func containsKeyword(text, keyword string) bool {
	keyword = strings.ToLower(strings.TrimSpace(keyword))
	if keyword == "" {
		return false
	}
	pattern := `(^|[^a-z0-9])` + regexp.QuoteMeta(keyword) + `([^a-z0-9]|$)`
	return regexp.MustCompile(pattern).MatchString(text)
}

func splitTitleCompany(raw, fallbackCompany string) (string, string) {
	text := cleanText(raw)
	for _, sep := range []string{" @ ", " at ", " | ", " — ", " – "} {
		if idx := strings.LastIndex(strings.ToLower(text), strings.ToLower(sep)); idx > 0 {
			return cleanText(text[:idx]), cleanText(text[idx+len(sep):])
		}
	}
	return text, fallbackCompany
}

func looksLikeJobLink(href, text string) bool {
	combined := strings.ToLower(href + " " + text)
	if text == "" || len(text) > 180 {
		return false
	}
	for _, marker := range []string{"job", "career", "opening", "position", "roles", "lever.co", "greenhouse", "ashbyhq", "workable"} {
		if strings.Contains(combined, marker) {
			return true
		}
	}
	return false
}

func looksLikeJobURL(raw string) bool {
	u, err := url.Parse(raw)
	if err != nil || u.Host == "" {
		return false
	}
	host := strings.TrimPrefix(strings.ToLower(u.Host), "www.")
	path := strings.ToLower(u.Path)
	if strings.Contains(host, "duckduckgo.") || strings.Contains(host, "bing.com") || strings.Contains(host, "google.") {
		return false
	}
	allowedHosts := []string{
		"jobs.lever.co",
		"boards.greenhouse.io",
		"job-boards.greenhouse.io",
		"job-boards.eu.greenhouse.io",
		"jobs.ashbyhq.com",
		"apply.workable.com",
		"linkedin.com",
		"itviec.com",
		"topdev.vn",
		"myworkdayjobs.com",
		"bamboohr.com",
		"teamtailor.com",
		"wellfound.com",
		"workatastartup.com",
		"ycombinator.com",
		"remoteok.com",
		"remotive.com",
		"weworkremotely.com",
		"workingnomads.com",
		"ai-jobs.net",
	}
	for _, allowed := range allowedHosts {
		if host == allowed || strings.HasSuffix(host, "."+allowed) {
			return host != "linkedin.com" || strings.Contains(path, "/jobs")
		}
	}
	return strings.Contains(path, "/careers") || strings.Contains(path, "/jobs")
}

func decodeDuckURL(raw string) string {
	u, err := url.Parse(raw)
	if err == nil {
		if uddg := u.Query().Get("uddg"); uddg != "" {
			return uddg
		}
	}
	return raw
}

func resolveURL(baseURL, href string) string {
	u, err := url.Parse(href)
	if err != nil {
		return href
	}
	if u.IsAbs() {
		return u.String()
	}
	base, err := url.Parse(baseURL)
	if err != nil {
		return href
	}
	return base.ResolveReference(u).String()
}

func normalizeURL(raw string) string {
	u, err := url.Parse(strings.TrimSpace(raw))
	if err != nil {
		return strings.TrimSpace(raw)
	}
	u.Fragment = ""
	q := u.Query()
	for key := range q {
		if strings.HasPrefix(strings.ToLower(key), "utm_") {
			q.Del(key)
		}
	}
	u.RawQuery = q.Encode()
	return u.String()
}

func companyFromURL(raw string) string {
	u, err := url.Parse(raw)
	if err != nil {
		return ""
	}
	host := strings.TrimPrefix(strings.ToLower(u.Host), "www.")
	switch {
	case strings.Contains(host, "lever.co"):
		return firstPathPart(u.Path)
	case strings.Contains(host, "ashbyhq.com"):
		return firstPathPart(u.Path)
	case strings.Contains(host, "greenhouse.io"):
		return firstPathPart(u.Path)
	default:
		return strings.TrimSuffix(host, ".com")
	}
}

func firstPathPart(path string) string {
	parts := strings.Split(strings.Trim(path, "/"), "/")
	if len(parts) == 0 {
		return ""
	}
	return strings.ReplaceAll(parts[0], "-", " ")
}

func rawFirstPathPart(path string) string {
	parts := strings.Split(strings.Trim(path, "/"), "/")
	if len(parts) == 0 {
		return ""
	}
	return parts[0]
}

func mustPath(raw string) string {
	u, err := url.Parse(raw)
	if err != nil {
		return ""
	}
	return u.Path
}

func hostOf(raw string) string {
	u, err := url.Parse(raw)
	if err != nil {
		return ""
	}
	return strings.ToLower(u.Host)
}

func stripTags(s string) string {
	tagRE := regexp.MustCompile(`(?is)<[^>]+>`)
	return tagRE.ReplaceAllString(s, " ")
}

func cleanText(s string) string {
	s = html.UnescapeString(s)
	s = strings.ReplaceAll(s, "\u00a0", " ")
	return strings.Join(strings.Fields(s), " ")
}

func splitTableRow(line string) []string {
	trimmed := strings.TrimSpace(line)
	if !strings.HasPrefix(trimmed, "|") || strings.HasPrefix(trimmed, "|---") || strings.HasPrefix(trimmed, "| #") {
		return nil
	}
	trimmed = strings.Trim(trimmed, "|")
	parts := strings.Split(trimmed, "|")
	fields := make([]string, 0, len(parts))
	for _, part := range parts {
		fields = append(fields, strings.TrimSpace(part))
	}
	return fields
}

func dedupKey(company, title string) string {
	normalize := func(s string) string {
		re := regexp.MustCompile(`[^a-z0-9]+`)
		return strings.Join(strings.Fields(re.ReplaceAllString(strings.ToLower(s), " ")), " ")
	}
	return normalize(company) + "|" + normalize(title)
}

func signature(company, title, rawURL string) string {
	sum := sha1.Sum([]byte(company + "\x00" + title + "\x00" + rawURL))
	return hex.EncodeToString(sum[:])
}

func safeTSV(s string) string {
	s = strings.ReplaceAll(s, "\t", " ")
	s = strings.ReplaceAll(s, "\n", " ")
	return s
}

func enabled(v *bool) bool {
	return v == nil || *v
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}
