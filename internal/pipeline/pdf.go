package pipeline

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/proto"
)

// GeneratePDF uses headless Chrome via go-rod to render an HTML CV into PDF.
func GeneratePDF(htmlPath string, pdfOutPath string) error {
	absPath, err := filepath.Abs(htmlPath)
	if err != nil {
		return err
	}
	if _, err := os.Stat(absPath); err != nil {
		return fmt.Errorf("read HTML file: %w", err)
	}

	fmt.Printf("Generating PDF from: %s\n", absPath)

	browser := rod.New().Timeout(browserTimeout)
	if err := browser.Connect(); err != nil {
		return fmt.Errorf("failed to start browser: %w", err)
	}
	defer func() { _ = browser.Close() }()

	page, err := browser.Page(proto.TargetCreateTarget{URL: "file://" + filepath.ToSlash(absPath)})
	if err != nil {
		return fmt.Errorf("open HTML page: %w", err)
	}
	page = page.Timeout(browserTimeout)
	if err := page.WaitLoad(); err != nil {
		return fmt.Errorf("wait for HTML page load: %w", err)
	}
	if err := page.WaitIdle(2 * time.Second); err != nil {
		return fmt.Errorf("wait for HTML page idle: %w", err)
	}
	pdfData, err := page.PDF(&proto.PagePrintToPDF{PrintBackground: true})
	if err != nil {
		return fmt.Errorf("print page to PDF: %w", err)
	}
	defer pdfData.Close()

	outFile, err := os.Create(pdfOutPath)
	if err != nil {
		return fmt.Errorf("create PDF file: %w", err)
	}
	if _, err := io.Copy(outFile, pdfData); err != nil {
		_ = outFile.Close()
		return fmt.Errorf("write PDF: %w", err)
	}
	if err := outFile.Close(); err != nil {
		return fmt.Errorf("write PDF: %w", err)
	}

	fmt.Printf("PDF successfully saved to: %s\n", pdfOutPath)
	return nil
}
