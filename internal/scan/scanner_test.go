package scan

import "testing"

func TestContainsKeywordDoesNotMatchInsideWords(t *testing.T) {
	if containsKeyword("technical recruiter", "React") {
		t.Fatal("React must not match Recruiter")
	}
	if !containsKeyword("software engineer, react platform", "React") {
		t.Fatal("React should match as a standalone token")
	}
}

func TestSearchURLFilterRejectsAds(t *testing.T) {
	if looksLikeJobURL("https://duckduckgo.com/y.js?u3=https%3A%2F%2Fwww.udemy.com%2Fcourse%2Freact") {
		t.Fatal("search ads must not be treated as jobs")
	}
	if !looksLikeJobURL("https://jobs.ashbyhq.com/workos/f2674bd8-3062-4cf8-98fb-72cb81dc5d39") {
		t.Fatal("Ashby job URLs should be accepted")
	}
}

func TestAugmentConfigSourcesCountsCompanySourcesOnly(t *testing.T) {
	enabledValue := true
	cfg := &Config{
		SearchQueries: []Query{
			{Name: "q1", Query: "site:jobs.example.com frontend", Enabled: &enabledValue},
			{Name: "q2", Query: "site:jobs.example.com react", Enabled: &enabledValue},
		},
		TrackedCompanies: []Company{
			{Name: "Existing", CareersURL: "https://jobs.ashbyhq.com/existing"},
		},
	}

	augmentConfigSources(cfg, 3)

	if got := countPrimarySources(cfg); got < 3 {
		t.Fatalf("expected at least 3 primary company sources, got %d", got)
	}
}
