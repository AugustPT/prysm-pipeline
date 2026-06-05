# Frictionless Sales Companion — Cue Card Interface

Applying **First Principles** and **Occam's Razor** to solve the salesperson's friction in real-time client presentations.

## First Principles Breakdown
1. **Core Objective**: The salesperson needs to know exactly what to say to the client *at the current moment of the conversation*, without losing eye contact or looking distracted by the phone.
2. **Current Friction**: The 5-step wizard forces the salesperson to click through set-up steps (Presenter info, Audience selection, Color selection, Goal selection) before they see any script. They are "fiddling" with setup instead of engaging.
3. **The Simplest Solution (Occam's Razor)**:
   - Put **all configurations** (Audience, Scan Color, Goals) on a single compact header panel at the top of the mobile screen. The seller can configure a scan in under 5 seconds with 3 taps.
   - Display the generated script as **3 High-Contrast Cue Cards** that show only one conversational phase at a time:
     - **Card 1: The Hook (Opener)** — Huge, clear, readable opening line.
     - **Card 2: The Assessment (Questions)** — An interactive checklist of the 5 tailored questions. The seller can tap to check them off as they speak.
     - **Card 3: The Recommendation (Close & Products)** — Tailored score meaning, product recommendations, next step, and the "Save Client" CTA.

---

## Design Specifications

1. **Top Quick Config Drawer**:
   - **Audience Menu**: A styled dropdown select menu (`select` element with modern styling) to choose the client type instantly.
   - **Scan Color Row**: A compact horizontal row of colored circle buttons representing the 6 carotenoid color bands.
   - **Goals Row**: A horizontal swipeable list of pill badges for the primary goals.

2. **Interactive Presentation Cue Cards**:
   - A single premium glassmorphic card representing the active card (`cardIndex` state: `1` to `3`).
   - A progress bar showing `Card X of 3` with glowing green status.
   - Large, clear, readable typography (`text-base` / `text-lg` / `text-xl`) to make it easily readable at a glance from arm's length.
   - **Bottom Navigation Bar**: Clean, sticky buttons at the bottom of the card (`[Previous Card]` and `[Next Card]`).
   - **Save & Reset**: On Card 3, display the primary CTA buttons: `[Save Client to Pipeline]` and `[Reset Scan]`.

---

## Technical Tasks

- [ ] Modify `WizardView` in `App.jsx` to be a single-screen **Frictionless Sales Companion** view.
- [ ] Add state `cardIndex` (integer: `1` to `3`) to track the active presentation cue card.
- [ ] Implement the Quick Config Bar at the top of the companion card (Audience dropdown, Color circle row, Goals multi-select pills).
- [ ] Build the interactive checklist for the 5 questions on Card 2 (allowing the seller to check them off as they go).
- [ ] Verify that existing Playwright walkthrough cues continue to pass 100% (runs in landscape desktop mode).
- [ ] Take screenshots of the new single-screen mobile design and the interactive cue cards.
- [ ] Commit changes to Git and deploy to production on Vercel.
