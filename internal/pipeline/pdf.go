package pipeline

import (
	"fmt"
	"path/filepath"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/proto"
	"github.com/go-rod/rod/lib/utils"
)

// GeneratePDF uses headless Chrome via go-rod to render an HTML CV into PDF.
// This handles Phase 5 of the pipeline.
func GeneratePDF(htmlPath string, pdfOutPath string) error {
	absPath, err := filepath.Abs(htmlPath)
	if err != nil {
		return err
	}

	fmt.Printf("🖨️ Generating PDF from: %s\n", absPath)

	browser := rod.New().MustConnect()
	defer browser.MustClose()

	page := browser.MustPage("file://" + filepath.ToSlash(absPath)).MustWaitLoad()

	// Wait for any animations or fonts to settle
	page.MustWaitIdle()

	pdfData, err := page.PDF(&proto.PagePrintToPDF{
		PrintBackground: true,
	})
	if err != nil {
		return err
	}

	err = utils.OutputFile(pdfOutPath, pdfData)
	if err != nil {
		return err
	}

	fmt.Printf("✅ PDF successfully saved to: %s\n", pdfOutPath)
	return nil
}
