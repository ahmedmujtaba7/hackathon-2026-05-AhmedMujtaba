# Prompt Log — Ahmed Mujtaba — AI Murder Mystery Detective

## Top 5 prompts that worked

### 1. Full case generation in one shot
**Context:** I needed a single Claude call to produce a complete, internally consistent murder mystery — victim, crime scene, 3–6 suspects with private truths, one murderer, motive, and red herrings — ready to drive the whole game.
**Prompt:**
```
You are a murder mystery author. Generate a complete murder mystery case as a JSON object.

Difficulty: {{difficulty}}

The JSON must include:
- victim: { name, occupation, found_at, time_of_death, cause }
- crime_scene_description: string (2–3 vivid sentences)
- murderer_id: string (must match one suspect's id)
- motive: string
- how_it_was_done: string
- how_it_was_concealed: string
- suspects: array of {
    id, name, age, relationship_to_victim,
    private_truth: string,   // what ONLY they know — may be unrelated to murder
    alibi: string,           // what they'll claim publicly
    alibi_is_true: boolean,
    personality: string,     // e.g. "nervous, deflects with sarcasm"
    secrets: string[],       // non-murder secrets they'll protect
    will_crack_if: string    // what question or confrontation breaks them
  }
- key_clues: string[]
- red_herrings: string[]

For {{difficulty}}=hard, plant at least 2 red herrings and ensure the murderer has a perfect alibi that can be disproved only by cross-referencing two suspects.

Return ONLY valid JSON. No commentary.
```
**Why it worked:** Explicit schema with boolean `alibi_is_true` and `will_crack_if` fields gave the interrogation engine concrete rules without extra prompting. The difficulty injection kept the design contract clear.
**Output quality:** 5
**Model used:** Sonnet 4.6
**Approx tokens / cost:** ~1 200 input / ~900 output ≈ $0.008

---

### 2. Stateful suspect interrogation with injected case context
**Context:** Each interrogation turn needed the suspect to stay consistent with their private truth across many questions, while never leaking the murderer directly.
**Prompt:**
```
You are {{suspect.name}}, {{suspect.age}}, {{suspect.relationship_to_victim}}.

Your personality: {{suspect.personality}}
Your alibi (what you claim publicly): {{suspect.alibi}}
Your alibi is actually {{suspect.alibi_is_true ? "true" : "false"}}.
Your private truth (never reveal directly): {{suspect.private_truth}}
Your secrets you will protect: {{suspect.secrets}}
You will crack and hint at the truth if: {{suspect.will_crack_if}}

The detective is questioning you. Respond in character — {{suspect.personality}}.
Never confess outright. If the detective hits {{suspect.will_crack_if}}, become visibly nervous or contradict yourself in a subtle way.
Keep answers under 4 sentences.

Conversation so far:
{{conversation_history}}

Detective says: "{{player_question}}"
```
**Why it worked:** Injecting the full suspect object (server-side only) gave Claude enough context to stay in character. The explicit crack condition created natural dramatic moments without hard-coding branching logic.
**Output quality:** 5
**Model used:** Sonnet 4.6
**Approx tokens / cost:** ~800 input / ~120 output ≈ $0.003 per turn

---

### 3. Hint generation without spoiling the answer
**Context:** The hint system needed to nudge players without revealing the murderer — a tricky balance.
**Prompt:**
```
You are a detective's inner voice — a gut instinct, not a narrator.

Full case (do not reveal): {{case_json}}
Player's interrogation history so far: {{conversation_history}}

The player is stuck. Generate ONE hint — a subtle, first-person instinct that points toward something they may have missed.
Rules:
- Do NOT name the murderer.
- Do NOT quote evidence verbatim.
- Frame it as: "Something about [vague reference] doesn't sit right..."
- Max 2 sentences.
```
**Why it worked:** Persona framing ("inner voice") naturally constrained the output to stay vague. Hard rules prevented spoilers while the case JSON gave Claude enough context to make the hint genuinely useful.
**Output quality:** 4
**Model used:** Sonnet 4.6
**Approx tokens / cost:** ~900 input / ~60 output ≈ $0.003

---

### 4. Narrative verdict reveal
**Context:** After the player submits their accusation, the game reveals the full story as a cinematic noir closing scene.
**Prompt:**
```
Write the closing scene of a noir detective story.

Case facts: {{case_json}}
Player accused: {{accused_name}}
Player was: {{correct ? "correct" : "wrong"}}

Structure:
1. Open with the detective's realisation (1 paragraph).
2. Reveal the true sequence of events — motive, method, concealment (2 paragraphs).
3. Note which suspects were lying and why (1 paragraph).
4. Close with a single atmospheric line.

Tone: serious, cinematic, noir. No humour. Respect the reader's intelligence.
```
**Why it worked:** Tight structure + tone directive produced consistently strong narrative prose. The correct/wrong flag let Claude write two emotionally distinct versions without separate prompts.
**Output quality:** 5
**Model used:** Sonnet 4.6
**Approx tokens / cost:** ~800 input / ~400 output ≈ $0.004

---

### 5. Plan-mode architecture spike before writing any code
**Context:** Before touching a line of code I used Claude Code plan mode to map out the full data model and API surface.
**Prompt:**
```
/plan

I'm building AI Murder Mystery Detective — see SPEC.md and idea.txt.

Design:
1. Postgres schema (all tables, columns, types, relations)
2. Next.js API routes surface (method, path, req body, res shape)
3. Server-side session state shape for an active game
4. Where Claude API calls happen and what data they need

Constraints: coins never go below 0. Private suspect truths never reach the client. One hint per case.
```
**Why it worked:** Running this before any code meant the architecture was locked before implementation started. Plan mode forced Claude to surface the "private truth never reaches client" invariant as a concrete data-flow constraint rather than a vague rule.
**Output quality:** 5
**Model used:** Sonnet 4.6
**Approx tokens / cost:** ~600 input / ~700 output ≈ $0.005

---

## Bottom 3 prompts that wasted time

### 1. Asking Claude to generate a suspect mid-conversation
**What I asked:** "Add a new suspect named Thomas who is the victim's business partner and acts suspicious."
**What went wrong:** Claude invented a suspect that contradicted the already-generated case JSON (wrong alibi timings, duplicate motive). Required full case regeneration.
**What I should have done:** Always generate the full case in one shot. Never mutate suspects after case creation. Add a hard rule to CLAUDE.md.

### 2. Letting Opus run for routine UI component generation
**What I asked:** Shadcn card component for displaying a suspect profile.
**What went wrong:** Opus produced over-engineered output (unnecessary animations, custom hooks) for what was a 30-line component. Took longer and cost 5× more than Sonnet.
**What I should have done:** Use Sonnet for all UI generation. Reserve Opus for architectural decisions only.

### 3. Prompting for coin logic without a schema reference
**What I asked:** "Write the coin deduction logic for when a player starts a game."
**What went wrong:** Claude wrote raw SQL strings instead of using Prisma, and didn't handle the "coins can't go below 0" guard. Two bugs to fix.
**What I should have done:** Always paste the Prisma schema into context and state the zero-floor constraint explicitly before asking for DB logic.

---

## Workflow patterns I'll keep using
- Plan mode for anything touching more than 3 files or a new API surface
- Full JSON schema injection into every Claude interrogation prompt (server-side only)
- One-shot full case generation rather than iterative suspect building
- Sonnet 4.6 as default; Opus only for architectural spikes

## Workflow patterns I'll stop
- Letting Claude mutate game state mid-session without a schema reference
- Using Opus for UI components — Sonnet is faster and cheaper for that
- Prompting without referencing CLAUDE.md conventions (caused the raw-SQL bug)
