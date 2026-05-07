# Demo Script — AI Murder Mystery Detective
## Engineer: Ahmed Mujtaba | Slot: 5 min demo + 2–3 min Q&A

---

| Time | What you cover |
| ---- | -------------- |
| 0:00–0:30 | **Hook:** "Every murder mystery game gives you a script. This one generates a unique case — new victim, new suspects, new murderer — every single time, and you solve it by talking to the suspects like a real detective." |
| 0:30–2:30 | **Live demo** (3 user actions, end-to-end, no slides) |
| 2:30–3:30 | **Architecture** (1-paragraph version) |
| 3:30–4:30 | **Claude Code use** (1 worked, 1 didn't, 1 I'll keep) |
| 4:30–5:00 | **Cost** (total spend, $/feature, what surprised me) |

---

## The 3 user actions (live, on real data)

**Action 1 — Start a case**
- Open the app. Show the login screen. Sign in with Google. Coin balance: 1 000.
- Select **Medium** (100 coins deducted). Watch the case file load: victim name, cause of death, crime scene image, list of 4 suspects with profiles.
- "Claude generated this entire mystery — victim, motive, alibis, hidden secrets — in one API call. No two cases are the same."

**Action 2 — Interrogate suspects**
- Click suspect #1. Ask: *"Where were you at 11pm on the night of the murder?"*
- Show their response in character. Note the nervous tone.
- Click suspect #2. Ask: *"Did you see [suspect #1] that evening?"* Show the contradiction.
- Buy a hint (coin cost shown). Read the subtle instinct nudge aloud.

**Action 3 — Accuse and reveal**
- Click "Make Accusation." Select the murderer. Click Submit.
- Watch the noir narrative reveal scroll: true sequence of events, who was lying and why, the key clue that pointed to the answer.
- Show the updated coin balance (200 earned for a correct guess).

---

## Architecture (memorise — 3 sentences max)
Next.js frontend on Vercel talking to a separate NestJS backend on Railway, with Postgres for all state. The backend owns Google OAuth, JWT auth, and four Gemini-backed modules — case generation, interrogation, hint, and verdict reveal — so private suspect truths never leave the server. Sequelize handles all DB access; the frontend has no API routes and makes no AI calls directly.

---

## Claude Code (1 worked / 1 didn't / 1 I'll keep)
- **Worked:** Injecting the full case JSON server-side into every suspect prompt. Claude stayed perfectly in character across 20+ questions because it always had the full context.
- **Didn't:** Asking Claude to add a single suspect mid-game. It contradicted the existing case. Lesson: generate the full mystery in one shot or not at all.
- **I'll keep:** Plan mode before any multi-file change. Every time I skipped it I regretted it within 30 minutes.

---

## Cost
*(Fill in on demo day)*
- Total spend: $
- Approx cost per full game played: $
- What surprised me:

---

## Common failures to avoid
- No slides before demoing the app — demo first.
- Don't demo broken paths. If image generation is slow, hide it for the demo.
- Architecture is 3 sentences, not a code tour.
- Practice the 5 minutes once on May 11 morning. Set a timer.
