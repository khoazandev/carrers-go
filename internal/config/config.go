package config

import (
	"encoding/json"
	"os"

	"gopkg.in/yaml.v3"
)

type Profile struct {
	Candidate   CandidateProfile `yaml:"candidate"`
	TargetRoles TargetRoles      `yaml:"target_roles"`
	Narrative   Narrative        `yaml:"narrative"`

	// Backward-compatible flat fields used by older local profile files.
	Name     string `yaml:"name"`
	Email    string `yaml:"email"`
	LinkedIn string `yaml:"linkedin"`
	GitHub   string `yaml:"github"`
}

type CandidateProfile struct {
	FullName            string `yaml:"full_name"`
	Email               string `yaml:"email"`
	Phone               string `yaml:"phone"`
	Location            string `yaml:"location"`
	LinkedIn            string `yaml:"linkedin"`
	PortfolioURL        string `yaml:"portfolio_url"`
	GitHub              string `yaml:"github"`
	Twitter             string `yaml:"twitter"`
	CanvaResumeDesignID string `yaml:"canva_resume_design_id"`
}

type TargetRoles struct {
	Primary    []string        `yaml:"primary"`
	Archetypes []RoleArchetype `yaml:"archetypes"`
}

type RoleArchetype struct {
	Name  string `yaml:"name"`
	Level string `yaml:"level"`
	Fit   string `yaml:"fit"`
}

type Narrative struct {
	Headline    string       `yaml:"headline"`
	ExitStory   string       `yaml:"exit_story"`
	Superpowers []string     `yaml:"superpowers"`
	ProofPoints []ProofPoint `yaml:"proof_points"`
	Dashboard   Dashboard    `yaml:"dashboard"`
}

type ProofPoint struct {
	Name       string `yaml:"name"`
	URL        string `yaml:"url"`
	HeroMetric string `yaml:"hero_metric"`
}

type Dashboard struct {
	URL      string `yaml:"url"`
	Password string `yaml:"password"`
}

type ScanRules struct {
	Frontend map[string]string `json:"frontend"`
	Backend  map[string]string `json:"backend"`
	Testing  map[string]string `json:"testing"`
}

func LoadProfile(path string) (*Profile, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var p Profile
	err = yaml.Unmarshal(data, &p)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func LoadScanRules(path string) (*ScanRules, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var rules ScanRules
	err = json.Unmarshal(data, &rules)
	if err != nil {
		return nil, err
	}
	return &rules, nil
}
