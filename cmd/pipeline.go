package cmd

import (
	"fmt"

	"github.com/khoazandev/career-ops/internal/pipeline"
	"github.com/spf13/cobra"
)

var pipelineCmd = &cobra.Command{
	Use:   "pipeline",
	Short: "JD extraction, scaffolding, finalization",
}

var pipelineExtractCmd = &cobra.Command{
	Use:   "extract [url]",
	Short: "Extract JD from URL",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		return pipeline.ExtractJD(args[0])
	},
}

var pipelineRenderCmd = &cobra.Command{
	Use:   "render [cv_markdown_path] [out_html_path]",
	Short: "Render CV to HTML utilizing AST parser",
	Args:  cobra.ExactArgs(2),
	RunE: func(cmd *cobra.Command, args []string) error {
		mdPath := args[0]
		outPath := args[1]
		fmt.Printf("Rendering CV from %s to %s...\n", mdPath, outPath)
		return pipeline.RenderCV(mdPath, outPath)
	},
}

var pipelinePdfCmd = &cobra.Command{
	Use:   "pdf [html_path] [pdf_out_path]",
	Short: "Generate PDF from HTML CV using Headless Chrome (go-rod)",
	Args:  cobra.ExactArgs(2),
	RunE: func(cmd *cobra.Command, args []string) error {
		return pipeline.GeneratePDF(args[0], args[1])
	},
}

func init() {
	pipelineCmd.AddCommand(pipelineExtractCmd)
	pipelineCmd.AddCommand(pipelineRenderCmd)
	pipelineCmd.AddCommand(pipelinePdfCmd)
	rootCmd.AddCommand(pipelineCmd)
}
