package github

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	neturl "net/url"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/khoazandev/career-ops/internal/config"
)

const (
	githubHTTPTimeout      = 20 * time.Second
	profileBuildTimeout    = 15 * time.Minute
	gitCloneTimeout        = 3 * time.Minute
	gitInspectTimeout      = 45 * time.Second
	maxConcurrentRepoScans = 4
	maxGitHubResponseBytes = 10 << 20
)

var githubUserRE = regexp.MustCompile(`^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$`)

type RepoInfo struct {
	Name        string   `json:"name"`
	HTMLURL     string   `json:"html_url"`
	Description string   `json:"description"`
	Language    string   `json:"language"`
	Stars       int      `json:"stargazers_count"`
	Topics      []string `json:"topics"`
	UpdatedAt   string   `json:"updated_at"`
	Fork        bool     `json:"fork"`
}

type ScanResult struct {
	Name              string         `json:"name"`
	URL               string         `json:"url"`
	Commits           int            `json:"commits"`
	Additions         int            `json:"additions"`
	Deletions         int            `json:"deletions"`
	NetImpact         int            `json:"net_impact"`
	Languages         map[string]int `json:"languages"`
	Dependencies      Dependencies   `json:"dependencies"`
	TechCategories    []string       `json:"tech_categories"`
	ContributionAreas []string       `json:"contribution_areas"`
	DeepScan          DeepScanInfo   `json:"deep_scan,omitempty"`
	Description       string         `json:"description"`
	Language          string         `json:"language"`
	Stars             int            `json:"stars"`
	Topics            []string       `json:"topics"`
	UpdatedAt         string         `json:"updated_at"`
}

type Dependencies struct {
	Frontend []string `json:"frontend"`
	Backend  []string `json:"backend"`
	Devtools []string `json:"devtools"`
}

type DeepScanInfo struct {
	GitHygiene GitHygiene `json:"git_hygiene"`
	Patterns   []string   `json:"patterns"`
}

type GitHygiene struct {
	AvgLocPerCommit   int    `json:"avg_loc_per_commit"`
	FixCommits        int    `json:"fix_commits"`
	ConventionCommits int    `json:"convention_commits"`
	ModularityScore   string `json:"modularity_score"`
}

type scanOutcome struct {
	result *ScanResult
	err    error
}

func FetchRepos(username string) ([]RepoInfo, error) {
	ctx, cancel := context.WithTimeout(context.Background(), githubHTTPTimeout)
	defer cancel()
	return FetchReposContext(ctx, username)
}

func FetchReposContext(ctx context.Context, username string) ([]RepoInfo, error) {
	if !githubUserRE.MatchString(username) {
		return nil, fmt.Errorf("invalid GitHub username: %q", username)
	}

	endpoint := fmt.Sprintf("https://api.github.com/users/%s/repos?per_page=100&sort=updated&type=owner", neturl.PathEscape(username))
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("create GitHub API request: %w", err)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "career-ops")

	client := &http.Client{Timeout: githubHTTPTimeout}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("fetch GitHub repos: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return nil, fmt.Errorf("GitHub API error: %s: %s", resp.Status, strings.TrimSpace(string(body)))
	}

	var allRepos []RepoInfo
	dec := json.NewDecoder(io.LimitReader(resp.Body, maxGitHubResponseBytes))
	if err := dec.Decode(&allRepos); err != nil {
		return nil, fmt.Errorf("decode GitHub API response: %w", err)
	}

	publicRepos := make([]RepoInfo, 0, len(allRepos))
	for _, r := range allRepos {
		if !r.Fork {
			publicRepos = append(publicRepos, r)
		}
	}
	return publicRepos, nil
}

// BuildProfile analyzes multiple repos concurrently and writes data/developer-profile.json.
func BuildProfile(username string, scanRules *config.ScanRules) error {
	ctx, cancel := context.WithTimeout(context.Background(), profileBuildTimeout)
	defer cancel()
	return BuildProfileContext(ctx, username, scanRules)
}

func BuildProfileContext(ctx context.Context, username string, scanRules *config.ScanRules) error {
	repos, err := FetchReposContext(ctx, username)
	if err != nil {
		return err
	}

	fmt.Printf("Found %d public repos (excluding forks)\n", len(repos))

	tempDir, err := os.MkdirTemp("", "career-ops-go-repos-*")
	if err != nil {
		return fmt.Errorf("create temp repo directory: %w", err)
	}
	defer func() { _ = os.RemoveAll(tempDir) }()

	aliases := []string{username}
	var wg sync.WaitGroup
	resultsChan := make(chan scanOutcome, len(repos))
	sem := make(chan struct{}, maxConcurrentRepoScans)

	for _, repo := range repos {
		repo := repo
		wg.Add(1)
		go func() {
			defer wg.Done()
			select {
			case sem <- struct{}{}:
				defer func() { <-sem }()
			case <-ctx.Done():
				resultsChan <- scanOutcome{err: ctx.Err()}
				return
			}

			cloneDir := filepath.Join(tempDir, safePathName(repo.Name))
			res, err := AnalyzeRepoContext(ctx, repo, aliases, cloneDir, scanRules)
			resultsChan <- scanOutcome{result: res, err: err}
		}()
	}

	wg.Wait()
	close(resultsChan)

	activeRepos := make([]*ScanResult, 0, len(repos))
	for outcome := range resultsChan {
		if outcome.err != nil {
			fmt.Printf("WARN: repo scan failed: %v\n", outcome.err)
		}
		res := outcome.result
		if res == nil {
			continue
		}
		if res.Commits > 0 {
			activeRepos = append(activeRepos, res)
			fmt.Printf("OK %s: %d commits, +%d lines\n", res.Name, res.Commits, res.Additions)
		} else {
			fmt.Printf("SKIP %s: no matching commits\n", res.Name)
		}
	}

	dataDir := "data"
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return fmt.Errorf("create data directory: %w", err)
	}

	profileOut, err := json.MarshalIndent(map[string]interface{}{
		"username":           username,
		"active_repos_count": len(activeRepos),
		"repos":              activeRepos,
	}, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal developer profile: %w", err)
	}

	outPath := filepath.Join(dataDir, "developer-profile.json")
	if err := os.WriteFile(outPath, profileOut, 0644); err != nil {
		return fmt.Errorf("write developer profile: %w", err)
	}
	return nil
}

func AnalyzeRepo(repo RepoInfo, aliases []string, cloneDir string, rules *config.ScanRules) *ScanResult {
	ctx, cancel := context.WithTimeout(context.Background(), gitCloneTimeout+2*gitInspectTimeout)
	defer cancel()
	res, err := AnalyzeRepoContext(ctx, repo, aliases, cloneDir, rules)
	if err != nil && res != nil {
		return res
	}
	return res
}

func AnalyzeRepoContext(ctx context.Context, repo RepoInfo, aliases []string, cloneDir string, rules *config.ScanRules) (*ScanResult, error) {
	res := newScanResult(repo)
	if repo.HTMLURL == "" {
		return res, fmt.Errorf("repo %q has empty URL", repo.Name)
	}
	if _, _, _, err := ParseGitHubRepoURL(repo.HTMLURL); err != nil {
		return res, err
	}

	if err := os.RemoveAll(cloneDir); err != nil {
		return res, fmt.Errorf("remove existing clone directory: %w", err)
	}
	defer func() { _ = os.RemoveAll(cloneDir) }()

	cloneCtx, cancel := context.WithTimeout(ctx, gitCloneTimeout)
	defer cancel()
	cloneCmd := exec.CommandContext(cloneCtx, "git", "clone", "--depth", "200", "--quiet", repo.HTMLURL+".git", cloneDir)
	cloneOut, err := cloneCmd.CombinedOutput()
	if cloneCtx.Err() != nil {
		return res, fmt.Errorf("clone %s: %w", repo.HTMLURL, cloneCtx.Err())
	}
	if err != nil {
		return res, fmt.Errorf("clone %s: %w: %s", repo.HTMLURL, err, strings.TrimSpace(string(cloneOut)))
	}

	for _, alias := range aliases {
		out, err := runGitOutput(ctx, gitInspectTimeout, "-C", cloneDir, "log", "--author="+alias, "-i", "--numstat", "--pretty=format:")
		if err != nil {
			return res, fmt.Errorf("read git numstat for %s: %w", alias, err)
		}
		additions, deletions := parseNumstat(out)
		res.Additions += additions
		res.Deletions += deletions

		countOut, err := runGitOutput(ctx, gitInspectTimeout, "-C", cloneDir, "rev-list", "--count", "HEAD", "--author="+alias, "-i")
		if err != nil {
			return res, fmt.Errorf("count commits for %s: %w", alias, err)
		}
		count, err := strconv.Atoi(strings.TrimSpace(string(countOut)))
		if err != nil {
			return res, fmt.Errorf("parse commit count for %s: %w", alias, err)
		}
		res.Commits += count
	}
	res.NetImpact = res.Additions - res.Deletions
	applyScanRules(ctx, cloneDir, rules, res)
	return res, nil
}

func ParseGitHubRepoURL(raw string) (owner, name, htmlURL string, err error) {
	u, err := neturl.Parse(raw)
	if err != nil {
		return "", "", "", fmt.Errorf("invalid GitHub repo URL: %w", err)
	}
	if u.Scheme != "http" && u.Scheme != "https" {
		return "", "", "", fmt.Errorf("invalid GitHub repo URL scheme %q", u.Scheme)
	}
	if !strings.EqualFold(u.Host, "github.com") {
		return "", "", "", fmt.Errorf("only github.com repo URLs are supported")
	}

	path := strings.Trim(strings.TrimSuffix(u.Path, ".git"), "/")
	parts := strings.Split(path, "/")
	if len(parts) < 2 || parts[0] == "" || parts[1] == "" {
		return "", "", "", fmt.Errorf("GitHub repo URL must include owner and repo")
	}
	owner, name = parts[0], parts[1]
	htmlURL = "https://github.com/" + owner + "/" + name
	return owner, name, htmlURL, nil
}

func newScanResult(repo RepoInfo) *ScanResult {
	return &ScanResult{
		Name:         repo.Name,
		URL:          repo.HTMLURL,
		Description:  repo.Description,
		Language:     repo.Language,
		Stars:        repo.Stars,
		Topics:       repo.Topics,
		UpdatedAt:    repo.UpdatedAt,
		Dependencies: Dependencies{Frontend: []string{}, Backend: []string{}, Devtools: []string{}},
		Languages:    make(map[string]int),
	}
}

func runGitOutput(ctx context.Context, timeout time.Duration, args ...string) ([]byte, error) {
	cmdCtx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()
	cmd := exec.CommandContext(cmdCtx, "git", args...)
	out, err := cmd.Output()
	if cmdCtx.Err() != nil {
		return out, cmdCtx.Err()
	}
	return out, err
}

func parseNumstat(out []byte) (additions, deletions int) {
	for _, line := range strings.Split(string(out), "\n") {
		parts := strings.Fields(line)
		if len(parts) < 2 || parts[0] == "-" || parts[1] == "-" {
			continue
		}
		add, addErr := strconv.Atoi(parts[0])
		del, delErr := strconv.Atoi(parts[1])
		if addErr == nil {
			additions += add
		}
		if delErr == nil {
			deletions += del
		}
	}
	return additions, deletions
}

func safePathName(name string) string {
	replacer := regexp.MustCompile(`[^A-Za-z0-9._-]+`)
	safe := replacer.ReplaceAllString(name, "-")
	if safe == "" {
		return "repo"
	}
	return safe
}

func applyScanRules(ctx context.Context, cloneDir string, rules *config.ScanRules, res *ScanResult) {
	if rules == nil {
		return
	}
	patterns := compileRules(rules)
	if len(patterns) == 0 {
		return
	}

	seen := map[string]bool{}
	_ = filepath.WalkDir(cloneDir, func(path string, d os.DirEntry, err error) error {
		if err != nil || ctx.Err() != nil {
			return nil
		}
		if d.IsDir() {
			switch d.Name() {
			case ".git", "node_modules", "vendor", "dist", "build":
				return filepath.SkipDir
			}
			return nil
		}
		info, err := d.Info()
		if err != nil || info.Size() > 1<<20 {
			return nil
		}
		data, err := os.ReadFile(path)
		if err != nil || bytes.IndexByte(data, 0) >= 0 {
			return nil
		}
		for name, re := range patterns {
			if !seen[name] && re.Match(data) {
				seen[name] = true
				res.TechCategories = append(res.TechCategories, name)
			}
		}
		return nil
	})
}

func compileRules(rules *config.ScanRules) map[string]*regexp.Regexp {
	compiled := make(map[string]*regexp.Regexp)
	for _, bucket := range []map[string]string{rules.Frontend, rules.Backend, rules.Testing} {
		for name, pattern := range bucket {
			re, err := regexp.Compile(pattern)
			if err != nil {
				continue
			}
			compiled[name] = re
		}
	}
	return compiled
}
