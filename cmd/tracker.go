package cmd

import (
	"fmt"
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
	Run: func(cmd *cobra.Command, args []string) {
		dryRun, _ := cmd.Flags().GetBool("dry-run")
		err := tracker.DedupTracker(args[0], dryRun)
		if err != nil {
			fmt.Println("Error:", err)
		}
	},
}

func init() {
	trackerDedupCmd.Flags().Bool("dry-run", false, "Simulate dedup without writing files")
	trackerCmd.AddCommand(trackerDedupCmd)
	rootCmd.AddCommand(trackerCmd)
}
