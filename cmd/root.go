package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:           "career-ops",
	Short:         "Career-Ops is an AI-powered job search pipeline",
	Long:          `A fast and concurrent CLI pipeline for parsing GitHub profiles, generating CVs, and tracking job applications utilizing Golang.`,
	SilenceUsage:  true,
	SilenceErrors: true,
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
