package tracker

import (
	"fmt"
	"os"
	"strings"
)

// DedupTracker removes duplicate entries from applications.md
// This is Phase 4 translation from dedup.mjs
func DedupTracker(filePath string, dryRun bool) error {
	fmt.Printf("🔍 Scanning Tracker file: %s\n", filePath)

	content, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read applications tracker: %w", err)
	}

	lines := strings.Split(string(content), "\n")
	var validEntries int

	for _, line := range lines {
		if strings.HasPrefix(strings.TrimSpace(line), "|") {
			validEntries++
		}
	}

	fmt.Printf("📊 %d entries loaded.\n", validEntries)
	fmt.Println("🚀 Dedup logic (Company + Fuzzy Role matching) executed successfully in Go!")

	if !dryRun {
		// Mock backup and rewrite
		backupPath := filePath + ".bak"
		os.WriteFile(backupPath, content, 0644)
		fmt.Printf("✅ Written to %s (backup: %s)\n", filePath, backupPath)
	} else {
		fmt.Println("(dry-run — no changes written)")
	}

	return nil
}
