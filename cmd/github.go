package cmd

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/khoazandev/career-ops/internal/config"
	"github.com/khoazandev/career-ops/internal/github"
	"github.com/spf13/cobra"
)

var githubCmd = &cobra.Command{
	Use:   "github [repo_url]",
	Short: "Analyze a single GitHub repository",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		owner, name, htmlURL, err := github.ParseGitHubRepoURL(args[0])
		if err != nil {
			return err
		}
		fmt.Printf("Analyzing GitHub repo: %s\n", htmlURL)

		cfg, err := loadOptionalScanRules("config/scan-rules.json")
		if err != nil {
			return err
		}
		tempDir, err := os.MkdirTemp("", "career-ops-repo-*")
		if err != nil {
			return fmt.Errorf("create temp repo directory: %w", err)
		}
		defer func() { _ = os.RemoveAll(tempDir) }()

		res, err := github.AnalyzeRepoContext(cmd.Context(), github.RepoInfo{
			Name:    name,
			HTMLURL: htmlURL,
		}, []string{owner}, filepath.Join(tempDir, name), cfg)
		if err != nil {
			return err
		}
		out, err := json.MarshalIndent(res, "", "  ")
		if err != nil {
			return fmt.Errorf("marshal repo analysis: %w", err)
		}
		fmt.Println(string(out))
		return nil
	},
}

var githubProfileCmd = &cobra.Command{
	Use:   "github-profile [username]",
	Short: "Build full developer profile (all repos)",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		username := args[0]
		fmt.Printf("Building full developer profile for user: %s\n", username)

		cfg, err := loadOptionalScanRules("config/scan-rules.json")
		if err != nil {
			return err
		}
		return github.BuildProfileContext(cmd.Context(), username, cfg)
	},
}

func loadOptionalScanRules(path string) (*config.ScanRules, error) {
	cfg, err := config.LoadScanRules(path)
	if err == nil {
		return cfg, nil
	}
	if os.IsNotExist(err) {
		return nil, nil
	}
	return nil, fmt.Errorf("load scan rules: %w", err)
}

func init() {
	rootCmd.AddCommand(githubCmd)
	rootCmd.AddCommand(githubProfileCmd)
}
