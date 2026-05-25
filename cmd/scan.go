package cmd

import (
	"encoding/json"
	"fmt"

	"github.com/khoazandev/career-ops/internal/scan"
	"github.com/spf13/cobra"
)

var scanCmd = &cobra.Command{
	Use:   "scan",
	Short: "Discover jobs from configured portals",
	RunE: func(cmd *cobra.Command, args []string) error {
		configPath, _ := cmd.Flags().GetString("config")
		outPath, _ := cmd.Flags().GetString("out")
		historyPath, _ := cmd.Flags().GetString("history")
		pipelinePath, _ := cmd.Flags().GetString("pipeline")
		limit, _ := cmd.Flags().GetInt("limit")
		minSources, _ := cmd.Flags().GetInt("min-sources")
		noWebSearch, _ := cmd.Flags().GetBool("no-web-search")
		noDefaultSources, _ := cmd.Flags().GetBool("no-default-sources")
		jsonOut, _ := cmd.Flags().GetBool("json")
		noWrite, _ := cmd.Flags().GetBool("no-write")
		noPipeline, _ := cmd.Flags().GetBool("no-pipeline")

		summary, err := scan.Run(cmd.Context(), scan.Options{
			ConfigPath:       configPath,
			OutPath:          outPath,
			HistoryPath:      historyPath,
			PipelinePath:     pipelinePath,
			Limit:            limit,
			MinSources:       minSources,
			NoWebSearch:      noWebSearch,
			NoDefaultSources: noDefaultSources,
			UpdateHistory:    !noWrite,
			UpdatePipeline:   !noWrite && !noPipeline,
		})
		if err != nil {
			return err
		}

		if jsonOut {
			data, err := json.MarshalIndent(summary, "", "  ")
			if err != nil {
				return fmt.Errorf("marshal scan summary: %w", err)
			}
			fmt.Println(string(data))
			return nil
		}

		fmt.Printf("Portal scan %s\n", summary.Date)
		fmt.Printf("Sources: %d | Found: %d | Added: %d | Skipped title: %d | Duplicates: %d | Expired: %d\n",
			summary.SourcesPlanned, summary.TotalFound, summary.Added, summary.SkippedTitle, summary.SkippedDup, summary.SkippedExpired)
		fmt.Printf("Output: %s\n", summary.OutPath)
		if len(summary.Warnings) > 0 {
			fmt.Printf("Warnings: %d\n", len(summary.Warnings))
			for _, warning := range summary.Warnings {
				fmt.Printf("  - %s\n", warning)
			}
		}
		printed := 0
		for _, job := range summary.Jobs {
			if job.Status != "added" {
				continue
			}
			fmt.Printf("  + %s | %s | %s\n", job.Company, job.Title, job.URL)
			printed++
			if printed >= 10 {
				break
			}
		}
		return nil
	},
}

func init() {
	scanCmd.Flags().String("config", "portals.yml", "Portal scanner config path")
	scanCmd.Flags().String("out", "output/ingested-jobs.json", "JSON output path")
	scanCmd.Flags().String("history", "data/scan-history.tsv", "Scan history TSV path")
	scanCmd.Flags().String("pipeline", "data/pipeline.md", "Pipeline markdown path")
	scanCmd.Flags().Int("limit", 50, "Maximum new jobs to add per scan")
	scanCmd.Flags().Int("min-sources", 100, "Minimum company/job-board sources to scan; built-in sources are added when config has fewer")
	scanCmd.Flags().Bool("no-web-search", false, "Disable broad web search queries and only scan tracked companies/APIs")
	scanCmd.Flags().Bool("no-default-sources", false, "Do not augment portals.yml with built-in company/job-board sources")
	scanCmd.Flags().Bool("no-write", false, "Write only the JSON output, not history or pipeline")
	scanCmd.Flags().Bool("no-pipeline", false, "Do not append added jobs to the pipeline markdown")
	scanCmd.Flags().Bool("json", false, "Print full scan summary as JSON")
	rootCmd.AddCommand(scanCmd)
}
