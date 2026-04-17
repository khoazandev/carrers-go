package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
	"github.com/khoazandev/career-ops/internal/pipeline"
)

var pipelineCmd = &cobra.Command{
	Use:   "pipeline",
	Short: "JD extraction, scaffolding, finalization",
}

var pipelineExtractCmd = &cobra.Command{
	Use:   "extract [url]",
	Short: "Extract JD from URL",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		url := args[0]
		err := pipeline.ExtractJD(url)
		if err != nil {
			fmt.Println("Error:", err)
		}
	},
}

var pipelineRenderCmd = &cobra.Command{
	Use:   "render [cv_markdown_path] [out_html_path]",
	Short: "Render CV to HTML utilizing AST parser",
	Args:  cobra.ExactArgs(2),
	Run: func(cmd *cobra.Command, args []string) {
		mdPath := args[0]
		outPath := args[1]
		fmt.Printf("Rendering CV from %s to %s...\n", mdPath, outPath)
		err := pipeline.RenderCV(mdPath, outPath)
		if err != nil {
			fmt.Println("Error:", err)
		}
	},
}

var pipelinePdfCmd = &cobra.Command{
	Use:   "pdf [html_path] [pdf_out_path]",
	Short: "Generate PDF from HTML CV using Headless Chrome (go-rod)",
	Args:  cobra.ExactArgs(2),
	Run: func(cmd *cobra.Command, args []string) {
		err := pipeline.GeneratePDF(args[0], args[1])
		if err != nil {
			fmt.Println("Error:", err)
		}
	},
}

func init() {
	pipelineCmd.AddCommand(pipelineExtractCmd)
	pipelineCmd.AddCommand(pipelineRenderCmd)
	pipelineCmd.AddCommand(pipelinePdfCmd)
	rootCmd.AddCommand(pipelineCmd)
}
