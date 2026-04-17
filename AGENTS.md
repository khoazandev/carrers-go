# Career-Ops for AI Agents (Antigravity / Codex / Claude)

Read `CLAUDE.md` for all project instructions, routing, and behavioral rules.

## Quick Reference

### One-Click Apply Flow
When user says "Apply cho job này: <URL>":
1. Read `modes/one-click-apply.md` for full workflow
2. Read `modes/evaluate.md` for evaluation method
3. Use `data/developer-profile.json` for GitHub context
4. Use `cv.md` for base CV data
5. Use `config/profile.yml` for contact info

### CLI Commands
```bash
node cli.mjs --help                    # All commands
node cli.mjs github-profile khoazandev # Build/refresh profile (run periodically)
node cli.mjs pipeline extract <url>    # Extract JD
node cli.mjs render <report>           # Render CV
node cli.mjs pipeline info             # Status
node cli.mjs doctor                    # Health check
```

### Key Rules
- Reuse existing modes, scripts, templates — do not create parallel logic
- Store user config in `config/profile.yml` — never in shared files
- **Never submit an application on the user's behalf**
- CV output language follows JD language (VN job → VN summary optional, keywords always EN)
- Developer profile at `data/developer-profile.json` is the **absolute source of truth**. It contains not just commit counts, but advanced "Deep Scan" insights (Git Hygiene, Modularity, Design Patterns). Always inject the `verified_bullets` literally into the output CV to prove senior-level traits.
