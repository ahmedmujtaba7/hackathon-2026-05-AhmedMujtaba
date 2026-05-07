# Judges' Scorecard — AI Murder Mystery Detective
## Engineer: Ahmed Mujtaba

---

| # | Criterion | Weight | Score | Notes |
| - | --------- | ------ | ----- | ----- |
| 1 | Idea & utility | 8% | /10 | |
| 2 | Functionality — does it work end-to-end? | 15% | /10 | |
| 3 | Code quality | 10% | /10 | |
| 4 | Architecture & code complexity | 6% | /10 | |
| 5 | Database quality | 5% | /10 | |
| 6 | UI/UX & front-end | 10% | /10 | |
| 7 | Optimization & performance | 5% | /10 | |
| 8 | Observability, admin & hardening | 8% | /10 | |
| 9 | **Effective use of Claude Code** — BIGGEST | **25%** | /10 | |
| 10 | Submission & demo | 8% | /10 | |

---

## Judge notes

```
Project: AI Murder Mystery Detective      Engineer: Ahmed Mujtaba

1.  Idea & utility (8%):                     /10
2.  Functionality (15%):                     /10
3.  Code quality (10%):                      /10
4.  Architecture & code complexity (6%):     /10
5.  Database quality (5%):                   /10
6.  UI/UX & front-end (10%):                 /10
7.  Optimization & performance (5%):         /10
8.  Observability & hardening (8%):          /10
9.  Effective use of Claude Code (25%):      /10   ← BIGGEST
10. Submission & demo (8%):                  /10

Weighted total:                              /100
- Discipline penalty (if any):              -25 (missing CLAUDE.md or prompt log)
Final score:                                 /100

One thing this project did exceptionally well:

One thing the engineer should keep doing:
```

---

## Scoring anchors (reference)

### Criterion 9 — Effective use of Claude Code (25%)
| Score | Description |
| ----- | ----------- |
| 9–10 | Prompt log shows deliberate experimentation; at least one non-trivial agentic workflow; clear evidence of plan mode, sub-agents, or custom skill usage; cost is tracked and optimised. |
| 7–8 | Good prompts with context injection; some iteration visible in the log; cost tracked. |
| 5–6 | Claude used but mostly for boilerplate generation; minimal evidence of strategic prompting. |
| 1–4 | Minimal or no prompt log; Claude used as a basic autocomplete only. |

### Criterion 2 — Functionality (15%)
| Score | Description |
| ----- | ----------- |
| 9–10 | Full E2E flow works live: auth → case start → interrogation → hint → accusation → reveal. Coin economy correct. |
| 7–8 | Core loop works; minor edge cases missing (e.g. timer auto-submit not implemented). |
| 5–6 | Some features missing or broken; demo required workarounds. |
| 1–4 | Does not run end-to-end. |
