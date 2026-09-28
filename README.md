# Unlock Your Character

A lightweight classroom self-reflection web game for a **Core Identity** session.

## What students do
1. Enter a name or nickname.
2. Complete a Personal SWOT reflection:
   - Core Strength
   - Boss Battle
   - Level-Up Opportunity
   - What Gets in the Way
3. Complete four identity prompts inspired by an Ikigai-style reflection:
   - What makes me feel alive?
   - What am I good at?
   - What do I care about?
   - Who do I want to become?
4. Receive a primary + secondary reflection archetype.
5. Write one small “next quest” action.

## Reflection archetypes
- The Creator
- The Connector
- The Explorer
- The Catalyst
- The Solver
- The Nurturer

These are **not psychological diagnoses**. They are a classroom reflection device based on the student's own answers.

## Privacy
This version has **no backend and no database**.
All answers are processed in the student's browser and are not uploaded anywhere by the website.

## Files
- `index.html` — page structure
- `style.css` — responsive design
- `script.js` — quiz logic and scoring
- `assets/` — optional future character images

## Deploy with GitHub Pages
1. Create a public repository, for example `unlock-your-character`.
2. Upload `index.html`, `style.css`, `script.js`, and the `assets` folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
5. Click **Save**.
6. Wait a few minutes.
7. Your site will normally be available at:
   `https://YOUR-USERNAME.github.io/unlock-your-character/`
8. Turn that URL into a QR code and put it on your presentation slide.

## Replacing emoji with illustrated characters later
When you have original PNG/SVG illustrations, put them in `assets/`, then edit the `ARCHETYPES` object in `script.js` and change the result renderer to use `<img>` files instead of emoji.

Recommended file names:
- `assets/creator.png`
- `assets/connector.png`
- `assets/explorer.png`
- `assets/catalyst.png`
- `assets/solver.png`
- `assets/nurturer.png`

## Classroom flow suggestion
- 3–5 min: intro + scan QR
- 8–10 min: Level 1 (Personal SWOT)
- 7–10 min: Level 2 (Identity Map)
- 3 min: reveal + screenshot
- 5–10 min: pair/share discussion

Suggested debrief:
- Did anything in your result surprise you?
- Which answer felt easiest to write? Which felt hardest?
- Did your archetype feel accurate today?
- What part of your identity do you want to grow next?
