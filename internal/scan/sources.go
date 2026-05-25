package scan

func augmentConfigSources(cfg *Config, minSources int) {
	if cfg == nil || minSources <= 0 {
		return
	}
	seen := make(map[string]bool)
	for _, company := range cfg.TrackedCompanies {
		seen[sourceKey(company)] = true
	}
	for _, company := range defaultCompanies() {
		if countPrimarySources(cfg) >= minSources {
			return
		}
		key := sourceKey(company)
		if seen[key] {
			continue
		}
		seen[key] = true
		cfg.TrackedCompanies = append(cfg.TrackedCompanies, company)
	}
}

func countPrimarySources(cfg *Config) int {
	count := 0
	for _, company := range cfg.TrackedCompanies {
		if !enabled(company.Enabled) {
			continue
		}
		if company.API != "" || company.CareersURL != "" {
			count++
		}
	}
	return count
}

func sourceKey(company Company) string {
	if company.CareersURL != "" {
		return company.CareersURL
	}
	if company.API != "" {
		return company.API
	}
	return company.Name
}

func defaultCompanies() []Company {
	return []Company{
		{Name: "Anthropic", CareersURL: "https://job-boards.greenhouse.io/anthropic", API: "https://boards-api.greenhouse.io/v1/boards/anthropic/jobs"},
		{Name: "OpenAI", CareersURL: "https://openai.com/careers", ScanQuery: `site:openai.com/careers "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "PolyAI", CareersURL: "https://job-boards.eu.greenhouse.io/polyai", API: "https://boards-api.greenhouse.io/v1/boards/polyai/jobs"},
		{Name: "Parloa", CareersURL: "https://job-boards.eu.greenhouse.io/parloa", API: "https://boards-api.greenhouse.io/v1/boards/parloa/jobs"},
		{Name: "Intercom", CareersURL: "https://job-boards.greenhouse.io/intercom", API: "https://boards-api.greenhouse.io/v1/boards/intercom/jobs"},
		{Name: "Hume AI", CareersURL: "https://job-boards.greenhouse.io/humeai", API: "https://boards-api.greenhouse.io/v1/boards/humeai/jobs"},
		{Name: "ElevenLabs", CareersURL: "https://jobs.ashbyhq.com/elevenlabs"},
		{Name: "Deepgram", CareersURL: "https://jobs.ashbyhq.com/deepgram"},
		{Name: "Vapi", CareersURL: "https://jobs.ashbyhq.com/vapi"},
		{Name: "Bland AI", CareersURL: "https://jobs.ashbyhq.com/bland"},
		{Name: "Retool", CareersURL: "https://retool.com/careers", ScanQuery: `site:retool.com/careers "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Airtable", CareersURL: "https://job-boards.greenhouse.io/airtable", API: "https://boards-api.greenhouse.io/v1/boards/airtable/jobs"},
		{Name: "Vercel", CareersURL: "https://job-boards.greenhouse.io/vercel", API: "https://boards-api.greenhouse.io/v1/boards/vercel/jobs"},
		{Name: "Temporal", CareersURL: "https://job-boards.greenhouse.io/temporal", API: "https://boards-api.greenhouse.io/v1/boards/temporal/jobs"},
		{Name: "Arize AI", CareersURL: "https://job-boards.greenhouse.io/arizeai", API: "https://boards-api.greenhouse.io/v1/boards/arizeai/jobs"},
		{Name: "RunPod", CareersURL: "https://job-boards.greenhouse.io/runpod", API: "https://boards-api.greenhouse.io/v1/boards/runpod/jobs"},
		{Name: "Glean", CareersURL: "https://job-boards.greenhouse.io/gleanwork", API: "https://boards-api.greenhouse.io/v1/boards/gleanwork/jobs"},
		{Name: "Ada", CareersURL: "https://job-boards.greenhouse.io/ada", API: "https://boards-api.greenhouse.io/v1/boards/ada/jobs"},
		{Name: "LivePerson", CareersURL: "https://liveperson.com/company/careers", ScanQuery: `site:liveperson.com/careers "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Sierra", CareersURL: "https://jobs.ashbyhq.com/sierra"},
		{Name: "Decagon", CareersURL: "https://jobs.ashbyhq.com/decagon"},
		{Name: "Talkdesk", CareersURL: "https://www.talkdesk.com/careers", ScanQuery: `site:talkdesk.com/careers "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Twilio", CareersURL: "https://www.twilio.com/en-us/company/jobs", ScanQuery: `site:twilio.com/company/jobs "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Dialpad", CareersURL: "https://www.dialpad.com/careers", ScanQuery: `site:dialpad.com/careers "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Gong", CareersURL: "https://www.gong.io/careers", ScanQuery: `site:gong.io/careers "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Genesys", CareersURL: "https://www.genesys.com/careers", ScanQuery: `site:genesys.com/careers "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Salesforce", CareersURL: "https://careers.salesforce.com", ScanQuery: `site:careers.salesforce.com "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Langfuse", CareersURL: "https://langfuse.com/careers", ScanQuery: `site:langfuse.com/careers "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Lindy", CareersURL: "https://jobs.ashbyhq.com/lindy"},
		{Name: "Cognigy", CareersURL: "https://careers.cognigy.com", ScanQuery: `site:careers.cognigy.com "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Speechmatics", CareersURL: "https://job-boards.greenhouse.io/speechmatics", API: "https://boards-api.greenhouse.io/v1/boards/speechmatics/jobs"},
		{Name: "n8n", CareersURL: "https://jobs.ashbyhq.com/n8n"},
		{Name: "Zapier", CareersURL: "https://jobs.ashbyhq.com/zapier"},
		{Name: "Make", CareersURL: "https://www.make.com/en/careers", ScanQuery: `site:make.com/en/careers "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Cohere", CareersURL: "https://jobs.ashbyhq.com/cohere"},
		{Name: "LangChain", CareersURL: "https://jobs.ashbyhq.com/langchain"},
		{Name: "Pinecone", CareersURL: "https://jobs.ashbyhq.com/pinecone"},
		{Name: "Mistral AI", CareersURL: "https://jobs.lever.co/mistral"},
		{Name: "Weights & Biases", CareersURL: "https://jobs.lever.co/wandb"},
		{Name: "Palantir", CareersURL: "https://jobs.lever.co/palantir"},
		{Name: "Factorial", CareersURL: "https://job-boards.greenhouse.io/factorial", API: "https://boards-api.greenhouse.io/v1/boards/factorial/jobs"},
		{Name: "Attio", CareersURL: "https://jobs.ashbyhq.com/attio"},
		{Name: "Tinybird", CareersURL: "https://jobs.ashbyhq.com/tinybird"},
		{Name: "Clarity AI", CareersURL: "https://jobs.lever.co/clarity-ai"},
		{Name: "Travelperk", CareersURL: "https://jobs.ashbyhq.com/travelperk"},
		{Name: "Aleph Alpha", CareersURL: "https://jobs.ashbyhq.com/AlephAlpha"},
		{Name: "DeepL", CareersURL: "https://jobs.ashbyhq.com/DeepL"},
		{Name: "Black Forest Labs", CareersURL: "https://job-boards.greenhouse.io/blackforestlabs", API: "https://boards-api.greenhouse.io/v1/boards/blackforestlabs/jobs"},
		{Name: "Helsing", CareersURL: "https://job-boards.greenhouse.io/helsing", API: "https://boards-api.greenhouse.io/v1/boards/helsing/jobs"},
		{Name: "Celonis", CareersURL: "https://job-boards.greenhouse.io/celonis", API: "https://boards-api.greenhouse.io/v1/boards/celonis/jobs"},
		{Name: "Contentful", CareersURL: "https://job-boards.greenhouse.io/contentful", API: "https://boards-api.greenhouse.io/v1/boards/contentful/jobs"},
		{Name: "GetYourGuide", CareersURL: "https://job-boards.greenhouse.io/getyourguide", API: "https://boards-api.greenhouse.io/v1/boards/getyourguide/jobs"},
		{Name: "HelloFresh", CareersURL: "https://job-boards.greenhouse.io/hellofresh", API: "https://boards-api.greenhouse.io/v1/boards/hellofresh/jobs"},
		{Name: "N26", CareersURL: "https://job-boards.greenhouse.io/n26", API: "https://boards-api.greenhouse.io/v1/boards/n26/jobs"},
		{Name: "Trade Republic", CareersURL: "https://job-boards.greenhouse.io/traderepublicbank", API: "https://boards-api.greenhouse.io/v1/boards/traderepublicbank/jobs"},
		{Name: "SumUp", CareersURL: "https://job-boards.greenhouse.io/sumup", API: "https://boards-api.greenhouse.io/v1/boards/sumup/jobs"},
		{Name: "Qonto", CareersURL: "https://jobs.lever.co/qonto"},
		{Name: "Forto", CareersURL: "https://jobs.lever.co/forto"},
		{Name: "Lakera", CareersURL: "https://jobs.ashbyhq.com/lakera.ai"},
		{Name: "Scandit", CareersURL: "https://job-boards.greenhouse.io/scandit", API: "https://boards-api.greenhouse.io/v1/boards/scandit/jobs"},
		{Name: "Cradle", CareersURL: "https://jobs.ashbyhq.com/cradlebio"},
		{Name: "Hugging Face", CareersURL: "https://apply.workable.com/huggingface/", ScanQuery: `site:apply.workable.com/huggingface "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Photoroom", CareersURL: "https://jobs.ashbyhq.com/photoroom"},
		{Name: "Pigment", CareersURL: "https://jobs.lever.co/pigment"},
		{Name: "Wayve", CareersURL: "https://job-boards.greenhouse.io/wayve", API: "https://boards-api.greenhouse.io/v1/boards/wayve/jobs"},
		{Name: "Isomorphic Labs", CareersURL: "https://job-boards.greenhouse.io/isomorphiclabs", API: "https://boards-api.greenhouse.io/v1/boards/isomorphiclabs/jobs"},
		{Name: "PhysicsX", CareersURL: "https://job-boards.greenhouse.io/physicsx", API: "https://boards-api.greenhouse.io/v1/boards/physicsx/jobs"},
		{Name: "Stability AI", CareersURL: "https://job-boards.greenhouse.io/stabilityai", API: "https://boards-api.greenhouse.io/v1/boards/stabilityai/jobs"},
		{Name: "Synthesia", CareersURL: "https://jobs.ashbyhq.com/synthesia"},
		{Name: "Faculty", CareersURL: "https://jobs.ashbyhq.com/faculty"},
		{Name: "Causaly", CareersURL: "https://jobs.ashbyhq.com/causaly"},
		{Name: "Lovable", CareersURL: "https://jobs.ashbyhq.com/lovable"},
		{Name: "Legora", CareersURL: "https://jobs.ashbyhq.com/legora"},
		{Name: "Spotify", CareersURL: "https://jobs.lever.co/spotify"},
		{Name: "Vinted", CareersURL: "https://jobs.lever.co/vinted"},
		{Name: "Amplemarket", CareersURL: "https://job-boards.greenhouse.io/amplemarket", API: "https://boards-api.greenhouse.io/v1/boards/amplemarket/jobs"},
		{Name: "Perplexity", CareersURL: "https://jobs.ashbyhq.com/perplexity"},
		{Name: "Clay Labs", CareersURL: "https://jobs.ashbyhq.com/claylabs"},
		{Name: "Runway", CareersURL: "https://job-boards.greenhouse.io/runwayml", API: "https://boards-api.greenhouse.io/v1/boards/runwayml/jobs"},
		{Name: "Hightouch", CareersURL: "https://job-boards.greenhouse.io/hightouch", API: "https://boards-api.greenhouse.io/v1/boards/hightouch/jobs"},
		{Name: "WorkOS", CareersURL: "https://jobs.ashbyhq.com/workos"},
		{Name: "Supabase", CareersURL: "https://jobs.ashbyhq.com/supabase"},
		{Name: "Resend", CareersURL: "https://jobs.ashbyhq.com/resend"},
		{Name: "Clerk", CareersURL: "https://jobs.ashbyhq.com/clerk"},
		{Name: "Inngest", CareersURL: "https://jobs.ashbyhq.com/inngest"},
		{Name: "PlanetScale", CareersURL: "https://job-boards.greenhouse.io/planetscale", API: "https://boards-api.greenhouse.io/v1/boards/planetscale/jobs"},
		{Name: "GitLab", CareersURL: "https://job-boards.greenhouse.io/gitlab", API: "https://boards-api.greenhouse.io/v1/boards/gitlab/jobs"},
		{Name: "Figma", CareersURL: "https://job-boards.greenhouse.io/figma", API: "https://boards-api.greenhouse.io/v1/boards/figma/jobs"},
		{Name: "Stripe", CareersURL: "https://job-boards.greenhouse.io/stripe", API: "https://boards-api.greenhouse.io/v1/boards/stripe/jobs"},
		{Name: "Airbnb", CareersURL: "https://job-boards.greenhouse.io/airbnb", API: "https://boards-api.greenhouse.io/v1/boards/airbnb/jobs"},
		{Name: "Cloudflare", CareersURL: "https://job-boards.greenhouse.io/cloudflare", API: "https://boards-api.greenhouse.io/v1/boards/cloudflare/jobs"},
		{Name: "MongoDB", CareersURL: "https://job-boards.greenhouse.io/mongodb", API: "https://boards-api.greenhouse.io/v1/boards/mongodb/jobs"},
		{Name: "Elastic", CareersURL: "https://job-boards.greenhouse.io/elastic", API: "https://boards-api.greenhouse.io/v1/boards/elastic/jobs"},
		{Name: "Snyk", CareersURL: "https://job-boards.greenhouse.io/snyk", API: "https://boards-api.greenhouse.io/v1/boards/snyk/jobs"},
		{Name: "HashiCorp", CareersURL: "https://job-boards.greenhouse.io/hashicorp", API: "https://boards-api.greenhouse.io/v1/boards/hashicorp/jobs"},
		{Name: "Grafana Labs", CareersURL: "https://job-boards.greenhouse.io/grafanalabs", API: "https://boards-api.greenhouse.io/v1/boards/grafanalabs/jobs"},
		{Name: "Docker", CareersURL: "https://job-boards.greenhouse.io/docker", API: "https://boards-api.greenhouse.io/v1/boards/docker/jobs"},
		{Name: "Postman", CareersURL: "https://job-boards.greenhouse.io/postman", API: "https://boards-api.greenhouse.io/v1/boards/postman/jobs"},
		{Name: "Sentry", CareersURL: "https://job-boards.greenhouse.io/sentry", API: "https://boards-api.greenhouse.io/v1/boards/sentry/jobs"},
		{Name: "Notion", CareersURL: "https://job-boards.greenhouse.io/notion", API: "https://boards-api.greenhouse.io/v1/boards/notion/jobs"},
		{Name: "Ramp", CareersURL: "https://job-boards.greenhouse.io/ramp", API: "https://boards-api.greenhouse.io/v1/boards/ramp/jobs"},
		{Name: "Rippling", CareersURL: "https://job-boards.greenhouse.io/rippling", API: "https://boards-api.greenhouse.io/v1/boards/rippling/jobs"},
		{Name: "Brex", CareersURL: "https://job-boards.greenhouse.io/brex", API: "https://boards-api.greenhouse.io/v1/boards/brex/jobs"},
		{Name: "Mercury", CareersURL: "https://jobs.ashbyhq.com/mercury"},
		{Name: "Miro", CareersURL: "https://job-boards.greenhouse.io/miro", API: "https://boards-api.greenhouse.io/v1/boards/miro/jobs"},
		{Name: "Canva", CareersURL: "https://www.lifeatcanva.com/en/jobs/", ScanQuery: `site:lifeatcanva.com/en/jobs "Frontend" OR "React" OR "Software Engineer"`},
		{Name: "Netlify", CareersURL: "https://job-boards.greenhouse.io/netlify", API: "https://boards-api.greenhouse.io/v1/boards/netlify/jobs"},
		{Name: "Automattic", CareersURL: "https://automattic.com/work-with-us/", ScanQuery: `site:automattic.com/work-with-us "Frontend" OR "React" OR "Software Engineer"`},
	}
}
