import React, { useMemo, useState } from "react";

const iconMap = {
  gym_trainer: "🏋️",
  athlete_event: "⚡",
  bni_business: "🏢",
  school_parent: "🎓",
  salon_spa: "✨",
  eye_dental_chiro: "👁️",
  yoga_wellness: "🧘",
  health_restaurant: "🥗",
  scanner_builder: "🤝"
};

const audiences = [
  {
    id: "gym_trainer",
    label: "Gym / Trainer",
    frame: "Performance, recovery, measurable progress",
    opener: "Most people track workouts, but they rarely track whether their nutrition is actually showing up in the body.",
    questions: [
      "What do your clients already track: weight, body fat, energy, performance, or recovery?",
      "Where do they usually fall off: food, supplements, sleep, consistency, or motivation?",
      "Would a 15-second scan help make the nutrition conversation easier for them to take seriously?",
      "If your clients could see progress monthly, would that help them stay on plan?",
      "Would this be more valuable as a member benefit, a challenge, or an added revenue center?"
    ],
    bestFit: ["LifePak Elements", "LifePak", "TRMe GO Protein+", "ageLOC Meta"],
    nextStep: "Offer a 3-day member scan pop-up, then show the owner how many people want a rescan."
  },
  {
    id: "athlete_event",
    label: "Athlete / Event Attendee",
    frame: "Fast awareness, curiosity, competition",
    opener: "This is like a nutrition mirror. It gives you a quick color score so you can see where your antioxidant habits are trending.",
    questions: [
      "Do you care more about energy, recovery, endurance, or staying healthy long-term?",
      "Do you already take supplements, or do you mostly try to get everything from food?",
      "When you see your score, would you want food ideas first, supplement ideas first, or both?",
      "Would you rescan in 30 days if you had a simple plan to improve it?",
      "Who else on your team or at this event would probably want to test this?"
    ],
    bestFit: ["LifePak Elements", "LifePak", "G3", "TRMe GO Protein+"],
    nextStep: "Use the scan as the hook. Keep the conversation under 5 minutes, then invite a 30-day rescan."
  },
  {
    id: "bni_business",
    label: "BNI / Business Owner",
    frame: "Simple offer, revenue center, easy referral",
    opener: "This turns wellness from a vague conversation into something measurable your clients can understand in seconds.",
    questions: [
      "Who already trusts you with their health, beauty, fitness, or wellness decisions?",
      "Would a measurable scanner make your offer easier to explain?",
      "Could this become a low-friction add-on instead of a whole new business?",
      "What type of customer would be easiest for you to introduce this to?",
      "If the follow-up was automated, would you be interested in placing a scanner?"
    ],
    bestFit: ["Prysm iO", "LifePak Elements", "LifePak", "Business follow-up system"],
    nextStep: "Pitch scanner placement, not supplement selling. Show how the device creates repeat conversations."
  },
  {
    id: "school_parent",
    label: "Parents / Schools",
    frame: "Education, gamified habits, no sales pressure",
    opener: "Kids understand colors faster than nutrition lectures. The scan can make eating colorful food feel like a game.",
    questions: [
      "Would kids respond better to nutrition if it felt like a game instead of a lecture?",
      "What habits would you want them to notice first: colorful food, sleep, water, or less junk food?",
      "Would a class challenge make this easier to teach?",
      "Would parents want a simple explanation of what the colors mean?",
      "Should this stay education-only in schools and move product conversations outside school settings?"
    ],
    bestFit: ["Education-only scanner demo", "Food-color challenge", "LifePak Elements only for parent-led conversations"],
    nextStep: "Build a school-safe version with no product pitch: scan, teach color, set habit, rescan."
  },
  {
    id: "salon_spa",
    label: "Salon / Spa / Nail Salon",
    frame: "Beauty from within, oxidative stress, repeat visits",
    opener: "You already help people look better on the outside. This gives them a simple way to understand what is happening from the inside.",
    questions: [
      "Do your clients already ask about skin, glow, aging, dryness, or beauty supplements?",
      "Would a quick scan make the beauty-from-within conversation easier?",
      "Do staff spend long hours around stress, fumes, or low breaks?",
      "Would monthly rescans fit naturally into appointments?",
      "Would this work better as a client perk or a premium wellness add-on?"
    ],
    bestFit: ["Beauty Focus Collagen+", "LifePak Elements", "LifePak", "ageLOC Youth", "G3"],
    nextStep: "Position as beauty-from-within plus measurable wellness progress."
  },
  {
    id: "eye_dental_chiro",
    label: "Eye / Dental / Chiro / Clinic",
    frame: "Professional education, compliant language, targeted wellness",
    opener: "This is not a diagnostic tool. It is a wellness awareness tool that helps people see carotenoid trends and make better lifestyle decisions.",
    questions: [
      "What wellness conversation do patients already need but rarely act on?",
      "Would a non-invasive score help make education more concrete?",
      "Which topic fits your office best: eyes, gums, inflammation awareness, posture recovery, or lifestyle habits?",
      "Would you prefer education-only scans or a product follow-up pathway?",
      "Who on staff could run the scans without slowing the office down?"
    ],
    bestFit: ["Prysm iO", "Eye Formula", "LifePak", "ageLOC Meta", "Education handout"],
    nextStep: "Keep claims conservative. Focus on awareness, habits, and approved supplement support language."
  },
  {
    id: "yoga_wellness",
    label: "Yoga / Wellness Community",
    frame: "Conscious living, body awareness, habit alignment",
    opener: "You already pay attention to how your body feels. This gives you one simple number to see how your nutrition habits are trending.",
    questions: [
      "What do you already practice: clean food, breathwork, movement, meditation, or supplements?",
      "Where do you feel most out of balance: energy, sleep, stress, digestion, or consistency?",
      "Would you rather improve through food first, habits first, or supplement support?",
      "Would a monthly scan help you stay connected to your wellness routine?",
      "Who in your community would enjoy this as a wellness circle activity?"
    ],
    bestFit: ["LifePak Elements", "Nu Biome", "MYND360 Night Time", "ageLOC Meta", "G3"],
    nextStep: "Use language around awareness, alignment, and measurable habits."
  },
  {
    id: "health_restaurant",
    label: "Health Store / Restaurant",
    frame: "Foot traffic, education, repeat visits",
    opener: "This gives customers a reason to come back and see whether their food and wellness habits are improving their score.",
    questions: [
      "Do customers already ask what foods support energy, immunity, skin, or wellness?",
      "Could the scanner create a reason for them to return in 30 days?",
      "Would a colorful-food challenge fit your brand?",
      "Would customers prefer food recommendations, supplement recommendations, or both?",
      "Could this become a monthly community wellness event?"
    ],
    bestFit: ["Prysm iO", "LifePak Elements", "Food-first habit plan", "G3"],
    nextStep: "Make the store/restaurant the trusted place for monthly nutrition awareness."
  },
  {
    id: "scanner_builder",
    label: "Scanner Business Candidate",
    frame: "Simple business model, duplication, scanner placement",
    opener: "You do not need to become a supplement expert. The scanner creates the conversation, the app tracks the score, and the system guides the follow-up.",
    questions: [
      "Who do you already know who owns a gym, salon, clinic, studio, restaurant, or event group?",
      "Would you rather run scans yourself or place scanners with business owners?",
      "Can you commit to one introduction per week?",
      "Do you want this as side income, community impact, or both?",
      "Would a script and follow-up system make this easy enough to duplicate?"
    ],
    bestFit: ["Prysm iO", "M5-style activity tracker", "Referral code", "15-minute presentation script"],
    nextStep: "Focus on one warm introduction per week and track activity, not hype."
  }
];

const scoreGuidance = {
  red: "Start with awareness. Keep it non-shaming: one simple habit, then rescan.",
  orange: "Show quick wins. Ask what habit is easiest to improve this week.",
  yellow: "Position as close to momentum. Build a 30-day habit plan.",
  green: "Affirm what is working. Offer targeted support based on their goal.",
  blue: "They are already serious. Ask if they want optimization or to host scans.",
  purple: "They are a walking proof point. Ask if they want to help others understand this."
};

const scoreTone = {
  red: "lower starting point",
  orange: "early improvement zone",
  yellow: "middle momentum zone",
  green: "healthy momentum zone",
  blue: "strong optimization zone",
  purple: "high proof-point zone"
};

const goals = [
  "Energy",
  "Sleep",
  "Stress",
  "Nutrition gaps",
  "Eye/screen support",
  "Skin/beauty",
  "Metabolism",
  "Gut comfort",
  "Athletic recovery",
  "Family education",
  "Extra income",
  "Place scanner"
];

const flowSteps = [
  ["1. Frame", "Set expectation: this is wellness awareness, not diagnosis."],
  ["2. Scan", "Run the 15-second scan and show the color/score."],
  ["3. Explain", "Explain the carotenoid trend in plain language."],
  ["4. Ask", "Ask 3–5 questions based on their setting and goals."],
  ["5. Next Step", "Offer food-first plan, supplement-fit path, or scanner placement."]
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getAudienceById(id) {
  return audiences.find((audience) => audience.id === id) || audiences[0];
}

function buildRecommendation(audience, selectedGoals, score) {
  const recs = new Set(audience.bestFit || []);
  if (selectedGoals.includes("Eye/screen support")) recs.add("Eye Formula");
  if (selectedGoals.includes("Skin/beauty")) recs.add("Beauty Focus Collagen+");
  if (selectedGoals.includes("Metabolism")) recs.add("ageLOC Meta");
  if (selectedGoals.includes("Gut comfort")) recs.add("Nu Biome / ProBio PCC");
  if (selectedGoals.includes("Sleep")) recs.add("MYND360 Night Time");
  if (selectedGoals.includes("Athletic recovery")) recs.add("TRMe GO Protein+");
  if (selectedGoals.includes("Extra income") || selectedGoals.includes("Place scanner")) recs.add("Prysm iO scanner placement path");
  if (selectedGoals.includes("Family education")) recs.add("Food-color challenge");
  if (selectedGoals.includes("Nutrition gaps") || ["red", "orange", "yellow"].includes(score)) recs.add("LifePak Elements");
  return Array.from(recs);
}

function runSelfTests() {
  const gym = getAudienceById("gym_trainer");
  const unknown = getAudienceById("missing_id");
  const redRecs = buildRecommendation(gym, [], "red");
  const eyeRecs = buildRecommendation(gym, ["Eye/screen support"], "green");
  const businessRecs = buildRecommendation(gym, ["Place scanner", "Extra income"], "blue");
  const uniqueCheck = new Set(buildRecommendation(gym, ["Nutrition gaps"], "red"));
  const testResults = [
    ["Fallback audience works", unknown.id === "gym_trainer"],
    ["Red score adds LifePak Elements", redRecs.includes("LifePak Elements")],
    ["Eye goal adds Eye Formula", eyeRecs.includes("Eye Formula")],
    ["Scanner goal adds placement path", businessRecs.includes("Prysm iO scanner placement path")],
    ["Recommendations are unique", uniqueCheck.size === buildRecommendation(gym, ["Nutrition gaps"], "red").length],
    ["Every audience has five questions", audiences.every((audience) => audience.questions.length === 5)],
    ["Every audience has an icon", audiences.every((audience) => Boolean(iconMap[audience.id]))]
  ];
  return testResults.map(([name, passed]) => ({ name, passed }));
}

function Card({ children, className = "" }) {
  return <div className={cx("rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl shadow-black/20", className)}>{children}</div>;
}

function Badge({ children, active = false }) {
  return <span className={cx("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium", active ? "border-emerald-400 bg-emerald-400 text-zinc-950" : "border-zinc-700 bg-zinc-950 text-zinc-300")}>{children}</span>;
}

function FieldLabel({ children }) {
  return <p className="text-sm font-medium text-zinc-400">{children}</p>;
}

function TabButton({ active, children, onClick }) {
  return (
    <button onClick={onClick} className={cx("rounded-xl px-3 py-2 text-sm font-medium transition", active ? "bg-emerald-400 text-zinc-950" : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800")}>
      {children}
    </button>
  );
}

function OptionButton({ active, children, onClick }) {
  return (
    <button onClick={onClick} className={cx("rounded-xl border px-3 py-3 text-left text-sm transition", active ? "border-emerald-400 bg-emerald-400 text-zinc-950" : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600")}>
      {children}
    </button>
  );
}

function ProductPill({ children }) {
  return <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200">{children}</span>;
}

export default function PrysmPipeline() {
  const [audienceId, setAudienceId] = useState("gym_trainer");
  const [score, setScore] = useState("yellow");
  const [selectedGoals, setSelectedGoals] = useState(["Nutrition gaps"]);
  const [presenterName, setPresenterName] = useState("Bobby");
  const [activeTab, setActiveTab] = useState("builder");

  const audience = getAudienceById(audienceId);
  const recommendations = useMemo(() => buildRecommendation(audience, selectedGoals, score), [audience, selectedGoals, score]);
  const selfTests = useMemo(() => runSelfTests(), []);
  const passedCount = selfTests.filter((test) => test.passed).length;

  const toggleGoal = (goal) => {
    setSelectedGoals((current) => current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]);
  };

  const scriptText = `${presenterName}: Before I explain anything, this is not a medical test and I'm not here to diagnose anything. Think of it as a nutrition mirror. It gives us a quick look at your carotenoid trend, which can reflect how your food, supplements, and lifestyle habits are showing up.

Let's do a 15-second scan first.

Your score is in the ${scoreTone[score]} today. I would not overcomplicate this. The first question is: what would you most want to improve — energy, sleep, recovery, skin, stress, or just knowing your nutrition is actually working?

${audience.questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}

Here is the simple read: your score gives us a starting point. The goal is not to shame the number. The goal is to pick one or two habits, support them if needed, and rescan so you can see progress.

For you, I would start with: ${recommendations.slice(0, 3).join(", ")}.

The next step is simple: try the plan for 30 days, rescan, and see what changed.`;

  const promptText = `You are a compliant wellness conversation assistant for a Prysm iO scanner demo.

Goal:
Create a short, human, non-pushy conversation that helps the presenter explain the scanner, ask the right questions, and recommend a simple next step.

Rules:
- Do not diagnose, treat, cure, prevent, or imply disease treatment.
- Do not claim weight loss, cure, detox, reverse disease, or replace medical advice.
- Use approved wellness support language only.
- Start food-first and lifestyle-first.
- Mention supplements only as optional support when aligned with the person's goals.
- Keep the tone simple, warm, and practical.

Inputs:
Audience type: ${audience.label}
Scan color: ${score}
Main goals: ${selectedGoals.join(", ") || "None selected"}
Possible products: ${recommendations.join(", ")}

Output:
1. One opening line
2. Five questions
3. Simple explanation of the score
4. Suggested next step
5. Product-fit explanation using compliant language
6. Follow-up message for 30-day rescan`;

  return (
    <main className="min-h-screen bg-zinc-950 p-4 text-zinc-50 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="space-y-4">
          <Badge>Demo concept</Badge>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Prysm Pipeline</h1>
            <p className="max-w-3xl text-lg text-zinc-300">A 15–20 minute scanner-first conversation system that adapts to the person, their setting, and their wellness goal.</p>
          </div>
        </section>

        <section className="flex flex-wrap gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-2">
          <TabButton active={activeTab === "builder"} onClick={() => setActiveTab("builder")}>Builder</TabButton>
          <TabButton active={activeTab === "script"} onClick={() => setActiveTab("script")}>Script</TabButton>
          <TabButton active={activeTab === "prompt"} onClick={() => setActiveTab("prompt")}>AI Prompt</TabButton>
          <TabButton active={activeTab === "guardrails"} onClick={() => setActiveTab("guardrails")}>Guardrails</TabButton>
          <TabButton active={activeTab === "tests"} onClick={() => setActiveTab("tests")}>Tests</TabButton>
        </section>

        {activeTab === "builder" && (
          <section className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
            <Card>
              <div className="space-y-5 p-5">
                <div className="space-y-3">
                  <FieldLabel>Presenter name</FieldLabel>
                  <input value={presenterName} onChange={(event) => setPresenterName(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-400" />
                </div>

                <div className="space-y-3">
                  <FieldLabel>Who are we talking to?</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {audiences.map((item) => (
                      <OptionButton key={item.id} active={audienceId === item.id} onClick={() => setAudienceId(item.id)}>
                        <span className="mr-2">{iconMap[item.id]}</span>
                        {item.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <FieldLabel>Scan color</FieldLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(scoreGuidance).map((item) => (
                      <OptionButton key={item} active={score === item} onClick={() => setScore(item)}>
                        <span className="capitalize">{item}</span>
                      </OptionButton>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <FieldLabel>Primary goals</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {goals.map((goal) => (
                      <button key={goal} onClick={() => toggleGoal(goal)} className={cx("rounded-full border px-3 py-2 text-sm transition", selectedGoals.includes(goal) ? "border-emerald-400 bg-emerald-400 text-zinc-950" : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600")}>
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-3xl">{iconMap[audience.id]}</div>
                  <div>
                    <h2 className="text-2xl font-semibold">{audience.label}</h2>
                    <p className="text-zinc-400">{audience.frame}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="mb-1 text-sm text-zinc-400">Opening line</p>
                  <p className="text-lg">{audience.opener}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Core questions</p>
                  {audience.questions.map((question, index) => (
                    <div key={question} className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                      <span className="font-semibold text-emerald-300">{index + 1}</span>
                      <p>{question}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                    <p className="mb-2 text-sm text-zinc-400">Score guidance</p>
                    <p>{scoreGuidance[score]}</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                    <p className="mb-2 text-sm text-zinc-400">Possible product fit</p>
                    <div className="flex flex-wrap gap-2">
                      {recommendations.map((item) => <ProductPill key={item}>{item}</ProductPill>)}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <p className="mb-1 text-sm text-emerald-200">Recommended next step</p>
                  <p>{audience.nextStep}</p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {activeTab === "script" && (
          <Card>
            <div className="space-y-5 p-6">
              <h2 className="text-2xl font-semibold">15–20 Minute Test Script</h2>
              <div className="grid gap-3 md:grid-cols-5">
                {flowSteps.map(([title, body]) => (
                  <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                    <p className="mb-2 font-semibold">{title}</p>
                    <p className="text-sm text-zinc-300">{body}</p>
                  </div>
                ))}
              </div>
              <pre className="whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-950 p-5 font-sans leading-relaxed text-zinc-100">{scriptText}</pre>
            </div>
          </Card>
        )}

        {activeTab === "prompt" && (
          <Card>
            <div className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold">AI Prompt Structure</h2>
              <pre className="whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-950 p-5 font-sans leading-relaxed text-zinc-100">{promptText}</pre>
            </div>
          </Card>
        )}

        {activeTab === "guardrails" && (
          <Card>
            <div className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold">Compliance Guardrails</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                  <p className="mb-2 font-semibold">Say this</p>
                  <ul className="space-y-2 text-zinc-300">
                    <li>Wellness awareness tool</li>
                    <li>Carotenoid trend</li>
                    <li>Supports healthy habits</li>
                    <li>Helps track progress over time</li>
                    <li>Food, sleep, stress, and lifestyle matter first</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                  <p className="mb-2 font-semibold">Avoid this</p>
                  <ul className="space-y-2 text-zinc-300">
                    <li>Diagnoses deficiency</li>
                    <li>Treats disease</li>
                    <li>Cures inflammation</li>
                    <li>Causes weight loss</li>
                    <li>Replaces bloodwork or medical care</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-amber-100">This demo is for sales-flow design only. Real deployment should use Nu Skin's official approved claims, market-specific rules, product labels, and compliance guidance.</div>
            </div>
          </Card>
        )}

        {activeTab === "tests" && (
          <Card>
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold">Self Tests</h2>
                <Badge active={passedCount === selfTests.length}>{passedCount}/{selfTests.length} passing</Badge>
              </div>
              <div className="space-y-2">
                {selfTests.map((test) => (
                  <div key={test.name} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                    <span>{test.name}</span>
                    <span className={test.passed ? "text-emerald-300" : "text-red-300"}>{test.passed ? "Pass" : "Fail"}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
