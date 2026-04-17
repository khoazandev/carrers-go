package pipeline

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/go-rod/rod"
)

// ExtractJD scrapes the Job Description from a URL using headless Chrome
func ExtractJD(url string) error {
	fmt.Printf("\n🔍 Extracting JD from: %s\n", url)
	fmt.Println(strings.Repeat("─", 60))

	browser := rod.New().MustConnect()
	defer browser.MustClose()

	page := browser.MustPage(url)
	page.MustWaitLoad()

	// 1. Extract Info
	title := page.MustEval("document.title").String()
	
	var text string
	body, err := page.Element("body")
	if err == nil {
		text, _ = body.Text()
	} else {
		return fmt.Errorf("could not parse page body")
	}

	// 2. Formatting
	slugReg := regexp.MustCompile(`[^a-zA-Z0-9]+`)
	slug := slugReg.ReplaceAllString(strings.ToLower(title), "-")
	slug = strings.Trim(slug, "-")
	if len(slug) > 40 {
		slug = slug[:40]
	}

	dateStr := time.Now().Format("2006-01-02")
	
	// 3. Output
	jdDir := "jds"
	os.MkdirAll(jdDir, 0755)
	jdPath := filepath.Join(jdDir, fmt.Sprintf("%s-%s.md", slug, dateStr))
	
	content := fmt.Sprintf("# %s\n\n**URL:** %s\n**Extracted:** %s\n\n---\n\n%s\n", title, url, dateStr, text)
	
	if err := os.WriteFile(jdPath, []byte(content), 0644); err != nil {
		return err
	}

	fmt.Printf("\n📋 Title: %s\n", title)
	fmt.Printf("📝 JD Length: %d chars\n", len(text))
	fmt.Printf("💾 JD saved to: %s\n", jdPath)
	
	return nil
}
