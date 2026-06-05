# Goal: Mobile-First Step-by-Step Wizard Interface

Implement a mobile-first wizard layout for the **Prysm Pipeline** application that guides the salesperson through the client scanning process one step at a time, displaying only what is necessary on the screen per step.

## Ultimate Goal
Make it extremely easy for a salesperson to run a client scan and presentation on a mobile phone (or tablet) in real-time, step-by-step, without scrolling through a large desktop dashboard.

---

## Design Specifications

1. **Responsive Viewport Detection**:
   - Detect screen width dynamically using React `window.innerWidth` state.
   - Default to **Mobile Wizard View** on screen widths below `768px` (mobile & tablet).
   - Default to **Desktop Grid View** on screen widths `768px` and above.
   - Include a visual toggle (`[Desktop View] [Mobile Wizard]`) in the app header so users on any screen size can preview or choose their preferred layout.

2. **The 5-Step Wizard Flow**:
   - **Step 1: Presenter Profile** — Set who is running the scan.
   - **Step 2: Client Setting (Audience)** — Select client type (Gym, Athlete, BNI, etc.).
   - **Step 3: Scan Score Color** — Run the 15-second scan and click the color result.
   - **Step 4: Client Primary Goals** — Choose client goals (Energy, Sleep, Stress, etc.).
   - **Step 5: Generated Presentation Script** — Display the personalized presentation script in a timeline format:
     - **Timeline step 1: Opening line** (framed correctly).
     - **Timeline step 2: 5 core questions** (with checkmark interactions).
     - **Timeline step 3: Score guidance** (explaining the carotenoid color score).
     - **Timeline step 4: Product recommendation & Next step**.
     - **Action CTA**: "Save Client to Pipeline" modal launcher.
     - **Action CTA**: "Reset Wizard / Start New Scan" to repeat the flow.

3. **Premium Aesthetics & Navigation**:
   - Keep dark mode glassmorphism styles (`bg-zinc-900/80 border border-zinc-800 backdrop-blur-md`).
   - Add a sticky progress bar at the top of the wizard container showing `Step X of 5` with a glowing green progress bar.
   - Large, finger-friendly buttons with hover animations and clean active styling.
   - Bottom step navigation (`[Back]` and `[Next]` / `[Generate Script]`).
   - Clean, touch-friendly tab bar layout on mobile.

---

## Technical Tasks

- [ ] Add state management for `isMobileMode` (toggled by user or layout width detection) and `wizardStep` (active step 1-5).
- [ ] Implement responsive viewport event listeners in `App.jsx`.
- [ ] Build the step-by-step Wizard components within the Builder tab view in `App.jsx`.
- [ ] Structure the step 5 script output as an interactive timeline script viewer.
- [ ] Verify that existing Playwright walkthrough cues (`npm run demo:run`) continue to pass 100% since they run in landscape mode (1920x1080) which will default to the Desktop View.
- [ ] Take screenshots of the mobile-first wizard and pipeline dashboard to prove implementation.
- [ ] Commit changes to Git and deploy to production on Vercel.
