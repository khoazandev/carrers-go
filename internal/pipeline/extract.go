package pipeline

import (
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/proto"
)

const browserTimeout = 45 * time.Second

// ExtractJD scrapes the job description from a URL using headless Chrome.
func ExtractJD(rawURL string) error {
	if err := validateHTTPURL(rawURL); err != nil {
		return err
	}

	fmt.Printf("\nExtracting JD from: %s\n", rawURL)
	fmt.Println(strings.Repeat("-", 60))

	browser := rod.New().Timeout(browserTimeout)
	if err := browser.Connect(); err != nil {
		return fmt.Errorf("failed to start browser: %w", err)
	}
	defer func() { _ = browser.Close() }()

	page, err := browser.Page(proto.TargetCreateTarget{URL: rawURL})
	if err != nil {
		return fmt.Errorf("open page: %w", err)
	}
	page = page.Timeout(browserTimeout)
	if err := page.WaitLoad(); err != nil {
		return fmt.Errorf("wait for page load: %w", err)
	}

	titleObj, err := page.Eval("() => document.title")
	if err != nil {
		return fmt.Errorf("extract page title: %w", err)
	}
	title := strings.TrimSpace(titleObj.Value.String())

	body, err := page.Element("body")
	if err != nil {
		return fmt.Errorf("find page body: %w", err)
	}
	text, err := body.Text()
	if err != nil {
		return fmt.Errorf("extract page body text: %w", err)
	}
	text = strings.TrimSpace(text)
	if title == "" {
		title = "job-description"
	}
	if text == "" {
		return fmt.Errorf("could not parse page body")
	}

	slugReg := regexp.MustCompile(`[^a-zA-Z0-9]+`)
	slug := slugReg.ReplaceAllString(strings.ToLower(title), "-")
	slug = strings.Trim(slug, "-")
	if slug == "" {
		slug = "job-description"
	}
	if len(slug) > 40 {
		slug = slug[:40]
	}

	dateStr := time.Now().Format("2006-01-02")
	jdDir := "jds"
	if err := os.MkdirAll(jdDir, 0755); err != nil {
		return fmt.Errorf("create JD output directory: %w", err)
	}
	jdPath := filepath.Join(jdDir, fmt.Sprintf("%s-%s.md", slug, dateStr))

	content := fmt.Sprintf("# %s\n\n**URL:** %s\n**Extracted:** %s\n\n---\n\n%s\n", title, rawURL, dateStr, text)
	if err := os.WriteFile(jdPath, []byte(content), 0644); err != nil {
		return fmt.Errorf("write extracted JD: %w", err)
	}

	fmt.Printf("\nTitle: %s\n", title)
	fmt.Printf("JD length: %d chars\n", len(text))
	fmt.Printf("JD saved to: %s\n", jdPath)
	return nil
}

func validateHTTPURL(rawURL string) error {
	parsed, err := url.ParseRequestURI(rawURL)
	if err != nil {
		return fmt.Errorf("invalid URL: %w", err)
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return fmt.Errorf("unsupported URL scheme %q: only http and https are allowed", parsed.Scheme)
	}
	if parsed.Host == "" {
		return fmt.Errorf("invalid URL: host is required")
	}
	return nil
}
