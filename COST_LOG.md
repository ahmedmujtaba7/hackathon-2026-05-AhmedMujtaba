# Daily Cost Log — Ahmed Mujtaba — AI Murder Mystery Detective

| Day | Spend (USD) | Sessions | Hours coding | $/hour | Notes |
| --- | ----------- | -------- | ------------ | ------ | ----- |
| Thu May 7 |  |  |  |  |  |
| Fri May 8 |  |  |  | |  |
| Sat May 9 |  |  |  |  |  |
| **Total** |  |  |  |  |  |

**Soft cap:** $75/day. **Hard cap:** $100/day.

---

## Spend breakdown by feature area

| Feature | Est. Claude calls | Avg tokens/call | Est. cost |
| ------- | ----------------- | --------------- | --------- |
| Case generation (per game start) | 1 | ~2 100 | ~$0.008 |
| Suspect interrogation (per turn) | 1 | ~920 | ~$0.003 |
| Hint generation (per hint) | 1 | ~960 | ~$0.003 |
| Verdict reveal (per accusation) | 1 | ~1 200 | ~$0.004 |
| Architecture / planning spikes | ~5 | ~1 300 | ~$0.025 |
| UI code generation | ~20 | ~800 | ~$0.025 |

**Model default:** claude-sonnet-4-6
**Upgrade threshold:** Only switch to Opus for architectural decisions; revert immediately after.

---

## Notes
- Track spend in real time via `claude /cost` or the Anthropic console.
- If daily spend hits $75, switch all prompts to Sonnet and disable streaming previews.
- At $100 hard cap, commit and stop for the day — no exceptions.
