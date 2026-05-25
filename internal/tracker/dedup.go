package tracker

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

var nonKeyChars = regexp.MustCompile(`[^a-z0-9]+`)

// DedupTracker removes duplicate application rows from applications.md.
func DedupTracker(filePath string, dryRun bool) error {
	fmt.Printf("Scanning tracker file: %s\n", filePath)

	content, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read applications tracker: %w", err)
	}

	lines := strings.Split(string(content), "\n")
	seen := make(map[string]int)
	deduped := make([]string, 0, len(lines))
	duplicates := 0
	entries := 0

	for _, line := range lines {
		fields, ok := parseApplicationRow(line)
		if !ok {
			deduped = append(deduped, line)
			continue
		}

		entries++
		key := dedupKey(fields[2], fields[3])
		if firstLine, exists := seen[key]; exists {
			duplicates++
			fmt.Printf("Duplicate: %s / %s (kept first at table row %d)\n", fields[2], fields[3], firstLine)
			continue
		}
		seen[key] = entries
		deduped = append(deduped, line)
	}

	fmt.Printf("%d application entries loaded; %d duplicate entries detected.\n", entries, duplicates)
	if dryRun {
		fmt.Println("Dry-run: no changes written.")
		return nil
	}
	if duplicates == 0 {
		fmt.Println("No duplicate rows found.")
		return nil
	}

	backupPath := filePath + ".bak"
	if err := os.WriteFile(backupPath, content, 0644); err != nil {
		return fmt.Errorf("write backup: %w", err)
	}
	if err := os.WriteFile(filePath, []byte(strings.Join(deduped, "\n")), 0644); err != nil {
		return fmt.Errorf("write deduplicated tracker: %w", err)
	}

	fmt.Printf("Updated %s (backup: %s)\n", filePath, backupPath)
	return nil
}

func parseApplicationRow(line string) ([]string, bool) {
	trimmed := strings.TrimSpace(line)
	if !strings.HasPrefix(trimmed, "|") || strings.HasPrefix(trimmed, "|---") || strings.HasPrefix(trimmed, "| #") {
		return nil, false
	}

	trimmed = strings.Trim(trimmed, "|")
	parts := strings.Split(trimmed, "|")
	fields := make([]string, 0, len(parts))
	for _, part := range parts {
		fields = append(fields, strings.TrimSpace(part))
	}
	return fields, len(fields) >= 8
}

func dedupKey(company, role string) string {
	company = nonKeyChars.ReplaceAllString(strings.ToLower(company), " ")
	role = nonKeyChars.ReplaceAllString(strings.ToLower(role), " ")
	return strings.Join(strings.Fields(company+" "+role), " ")
}
