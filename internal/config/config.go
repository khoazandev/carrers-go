package config

import (
	"encoding/json"
	"os"

	"gopkg.in/yaml.v3"
)

type Profile struct {
	Name     string `yaml:"name"`
	Email    string `yaml:"email"`
	LinkedIn string `yaml:"linkedin"`
	GitHub   string `yaml:"github"`
}

type ScanRules struct {
	// Placeholder for scan-rules.json structure
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
