package cmd

import (
	"github.com/khoazandev/career-ops/internal/tracker"
	"github.com/spf13/cobra"
)

var trackerCmd = &cobra.Command{
	Use:   "tracker",
	Short: "Career Ops Application Tracker management",
}

var trackerDedupCmd = &cobra.Command{
	Use:   "dedup [tracker_file_path]",
	Short: "Remove duplicate entries from the applications tracker",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		dryRun, _ := cmd.Flags().GetBool("dry-run")
		return tracker.DedupTracker(args[0], dryRun)
	},
}

func init() {
	trackerDedupCmd.Flags().Bool("dry-run", false, "Simulate dedup without writing files")
	trackerCmd.AddCommand(trackerDedupCmd)
	rootCmd.AddCommand(trackerCmd)
}
