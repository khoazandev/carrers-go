package cmd

import (
	"fmt"
	"github.com/khoazandev/career-ops/internal/config"
	"github.com/khoazandev/career-ops/internal/github"
	"github.com/spf13/cobra"
)

var githubCmd = &cobra.Command{
	Use:   "github [repo_url]",
	Short: "Analyze a single GitHub repository",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		repoURL := args[0]
		fmt.Printf("Analyzing GitHub repo: %s\n", repoURL)
		// TODO: Call github analyzer
	},
}

var githubProfileCmd = &cobra.Command{
	Use:   "github-profile [username]",
	Short: "Build full developer profile (all repos)",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		username := args[0]
		fmt.Printf("Building full developer profile for user: %s\n", username)
		
		cfg, _ := config.LoadScanRules("config/scan-rules.json")
		err := github.BuildProfile(username, cfg)
		if err != nil {
			fmt.Println("Error:", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(githubCmd)
	rootCmd.AddCommand(githubProfileCmd)
}
