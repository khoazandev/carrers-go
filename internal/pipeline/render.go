package pipeline

import (
	"bytes"
	"fmt"
	"os"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
	"github.com/yuin/goldmark/text"
)

// RenderCV parses the Markdown CV into an AST, extracts data, and generates a structured HTML.
func RenderCV(markdownPath string, outPath string) error {
	source, err := os.ReadFile(markdownPath)
	if err != nil {
		return fmt.Errorf("failed to read CV: %w", err)
	}

	md := goldmark.New(
		goldmark.WithExtensions(extension.GFM),
		goldmark.WithParserOptions(parser.WithAutoHeadingID()),
		goldmark.WithRendererOptions(html.WithHardWraps()),
	)

	doc := md.Parser().Parse(text.NewReader(source))
	err = ast.Walk(doc, func(n ast.Node, entering bool) (ast.WalkStatus, error) {
		if entering {
			switch n.Kind() {
			case ast.KindHeading:
				heading := n.(*ast.Heading)
				fmt.Printf("Found section: level %d\n", heading.Level)
			case ast.KindList:
				fmt.Println("Found list block")
			}
		}
		return ast.WalkContinue, nil
	})
	if err != nil {
		return err
	}

	var buf bytes.Buffer
	buf.WriteString("<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n<title>CV</title>\n</head>\n<body>\n")

	if err := md.Convert(source, &buf); err != nil {
		return err
	}

	buf.WriteString("\n</body>\n</html>")

	fmt.Printf("Rendered CV HTML to %s\n", outPath)
	return os.WriteFile(outPath, buf.Bytes(), 0644)
}
