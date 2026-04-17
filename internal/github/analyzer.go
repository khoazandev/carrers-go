package github

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"sync"

	"github.com/khoazandev/career-ops/internal/config"
)

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
	Name              string              `json:"name"`
	URL               string              `json:"url"`
	Commits           int                 `json:"commits"`
	Additions         int                 `json:"additions"`
	Deletions         int                 `json:"deletions"`
	NetImpact         int                 `json:"net_impact"`
	Languages         map[string]int      `json:"languages"`
	Dependencies      Dependencies        `json:"dependencies"`
	TechCategories    []string            `json:"tech_categories"`
	ContributionAreas []string            `json:"contribution_areas"`
	DeepScan          DeepScanInfo        `json:"deep_scan,omitempty"`
	Description       string              `json:"description"`
	Language          string              `json:"language"`
	Stars             int                 `json:"stars"`
	Topics            []string            `json:"topics"`
	UpdatedAt         string              `json:"updated_at"`
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

func FetchRepos(username string) ([]RepoInfo, error) {
	url := fmt.Sprintf("https://api.github.com/users/%s/repos?per_page=100&sort=updated&type=owner", username)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("GitHub API error: %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var allRepos []RepoInfo
	if err := json.Unmarshal(body, &allRepos); err != nil {
		return nil, err
	}

	var publicRepos []RepoInfo
	for _, r := range allRepos {
		if !r.Fork {
			publicRepos = append(publicRepos, r)
		}
	}
	return publicRepos, nil
}

// BuildProfile analyzes multiple repos concurrently
func BuildProfile(username string, scanRules *config.ScanRules) error {
	repos, err := FetchRepos(username)
	if err != nil {
		return err
	}

	fmt.Printf("📦 Found %d public repos (excluding forks)\n", len(repos))
	
	// Create Temp Dir
	tempDir := filepath.Join(os.TempDir(), "career-ops-go-repos")
	os.MkdirAll(tempDir, os.ModePerm)
	defer os.RemoveAll(tempDir)

	// We skip alias detection here for brevity, assume "username" is the main alias
	aliases := []string{username}

	var wg sync.WaitGroup
	resultsChan := make(chan *ScanResult, len(repos))
	sem := make(chan struct{}, 4) // Max 4 concurrent workers

	for _, repo := range repos {
		wg.Add(1)
		go func(r RepoInfo) {
			defer wg.Done()
			sem <- struct{}{}        // Acquire token
			defer func() { <-sem }() // Release token

			cloneDir := filepath.Join(tempDir, r.Name)
			res := AnalyzeRepo(r, aliases, cloneDir, scanRules)
			resultsChan <- res
		}(repo)
	}

	wg.Wait()
	close(resultsChan)

	var activeRepos []*ScanResult
	for res := range resultsChan {
		if res != nil && res.Commits > 0 {
			activeRepos = append(activeRepos, res)
			fmt.Printf("✅ %s: %d commits, +%d lines\n", res.Name, res.Commits, res.Additions)
		} else if res != nil {
			fmt.Printf("⚪ %s: Skipped (no commits)\n", res.Name)
		}
	}

	// Output profile JSON (mocked saving)
	dataDir := "data"
	os.MkdirAll(dataDir, os.ModePerm)
	
	profileOut, _ := json.MarshalIndent(map[string]interface{}{
		"username": username,
		"active_repos_count": len(activeRepos),
		"repos": activeRepos,
	}, "", "  ")

	outPath := filepath.Join(dataDir, "developer-profile.json")
	return os.WriteFile(outPath, profileOut, 0644)
}

func AnalyzeRepo(repo RepoInfo, aliases []string, cloneDir string, rules *config.ScanRules) *ScanResult {
	res := &ScanResult{
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

	// 1. Shallow clone
	os.RemoveAll(cloneDir)
	cmd := exec.Command("git", "clone", "--depth", "200", "--quiet", repo.HTMLURL+".git", cloneDir)
	if err := cmd.Run(); err != nil {
		return res
	}

	// 2. Count lines
	for _, alias := range aliases {
		out, _ := exec.Command("git", "-C", cloneDir, "log", "--author="+alias, "-i", "--numstat", "--pretty=format:").Output()
		lines := strings.Split(string(out), "\n")
		for _, l := range lines {
			parts := strings.Fields(l)
			if len(parts) >= 2 {
				add, _ := strconv.Atoi(parts[0])
				del, _ := strconv.Atoi(parts[1])
				res.Additions += add
				res.Deletions += del
			}
		}

		countOut, _ := exec.Command("git", "-C", cloneDir, "rev-list", "--count", "HEAD", "--author="+alias, "-i").Output()
		count, _ := strconv.Atoi(strings.TrimSpace(string(countOut)))
		res.Commits += count
	}
	res.NetImpact = res.Additions - res.Deletions

	// Optional: add dependency parsing & git hygiene patterns...
	
	os.RemoveAll(cloneDir) // Clean up
	return res
}
