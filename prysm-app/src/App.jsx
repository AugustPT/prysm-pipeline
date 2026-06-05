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

// ── Visual Support Components ───────────────────────────────────────────
function LoginView({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        onLogin(data.user);
      } else {
        const errData = await res.json();
        setError(errData.error || "Login failed.");
      }
    } catch (err) {
      // Fallback for local Vite dev server running without serverless middleware
      if (email.includes("@") && password.length >= 4) {
        const name = email.split("@")[0];
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        const role = email.toLowerCase().includes("manager") ? "manager" : "presenter";
        onLogin({ email, name: capitalized, role });
      } else {
        setError("Please enter a valid email and a password (min. 4 characters).");
      }
    }
  };

  const handleDemoLogin = () => {
    onLogin({ email: "bobby@prysmpipeline.com", name: "Bobby", role: "presenter" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-zinc-50 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 z-10">
        <div className="text-center space-y-2 animate-fade-in">
          <Badge>Sales Presentation Companion</Badge>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">Prysm Pipeline</h1>
          <p className="text-sm text-zinc-400">Manage your scanner client pipeline and assessments</p>
        </div>

        <Card className="p-6 md:p-8 backdrop-blur-md bg-zinc-900/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <FieldLabel>Email Address</FieldLabel>
              <input 
                type="email"
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-400 transition"
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Password</FieldLabel>
              <input 
                type="password"
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-400 transition"
              />
            </div>
            <button 
              type="submit"
              className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-300 transition duration-200 cursor-pointer shadow-lg shadow-emerald-400/10"
            >
              Login
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
            <span className="relative bg-zinc-900/80 px-3 text-xs text-zinc-500 uppercase">Or bypass for demo</span>
          </div>

          <div className="space-y-2.5">
            <button 
              onClick={handleDemoLogin}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-600 transition duration-200 cursor-pointer animate-fade-in"
            >
              Demo Presenter Login
            </button>
            <button 
              onClick={() => onLogin({ email: "manager@prysmpipeline.com", name: "Manager", role: "manager" })}
              className="w-full rounded-xl border border-emerald-500/20 bg-emerald-550/10 px-4 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition duration-200 cursor-pointer shadow-sm shadow-emerald-400/5 animate-fade-in"
            >
              Demo Manager Login
            </button>
          </div>
        </Card>
      </div>
    </main>
  );
}

function WizardView({
  presenterName,
  onPresenterNameChange,
  profile,
  setProfile,
  audienceId,
  setAudienceId,
  score,
  setScore,
  selectedGoals,
  toggleGoal,
  recommendations,
  audience,
  scoreTone,
  scoreGuidance,
  goals,
  iconMap,
  wizardStep,
  setWizardStep,
  onSaveClient
}) {
  const [cardIndex, setCardIndex] = useState(1);
  const [checkedQuestions, setCheckedQuestions] = useState({});
  const [configCollapsed, setConfigCollapsed] = useState(false);

  // Auto-collapse setup drawer when user starts the assessment questions or recommendations
  React.useEffect(() => {
    if (cardIndex > 1) {
      setConfigCollapsed(true);
    }
  }, [cardIndex]);

  const handleToggleQuestion = (index) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleNext = () => {
    if (cardIndex < 3) setCardIndex(cardIndex + 1);
  };

  const handleBack = () => {
    if (cardIndex > 1) setCardIndex(cardIndex - 1);
  };

  const handleReset = () => {
    setCardIndex(1);
    setCheckedQuestions({});
    setConfigCollapsed(false); // expand the setup panel when resetting
  };

  const steps = [
    { num: 1, label: "Opening Hook" },
    { num: 2, label: "Core Questions" },
    { num: 3, label: "Fit & Close" }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── TOP COMPACT CONFIG PANEL ── */}
      <Card className="bg-zinc-900/90 border border-zinc-800 p-4 md:p-5 shadow-lg transition duration-200">
        {configCollapsed ? (
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="text-3xl shrink-0">{iconMap[audienceId]}</span>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-bold text-zinc-400 uppercase tracking-wider leading-none">Active Setup</p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-base md:text-lg font-semibold text-zinc-100">
                  <span className="truncate">{audience.label}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="flex items-center gap-2 capitalize">
                    <span className={cx("h-3.5 w-3.5 rounded-full shadow-sm", 
                      score === "red" ? "bg-red-500" :
                      score === "orange" ? "bg-orange-500" :
                      score === "yellow" ? "bg-yellow-400" :
                      score === "green" ? "bg-emerald-500" :
                      score === "blue" ? "bg-cyan-500" : "bg-purple-500"
                    )} />
                    {score}
                  </span>
                  {selectedGoals.length > 0 && (
                    <>
                      <span className="text-zinc-650">•</span>
                      <span className="text-zinc-350 truncate max-w-[200px] font-normal text-sm md:text-base">{selectedGoals.join(", ")}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setConfigCollapsed(false)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4.5 py-2.5 text-sm font-bold text-emerald-400 hover:border-zinc-700 hover:bg-zinc-900 transition shrink-0 ml-3 cursor-pointer shadow-sm"
            >
              Edit Setup
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Configure Scan Presentation</span>
              <button 
                onClick={() => setConfigCollapsed(true)}
                className="text-sm font-semibold text-zinc-400 hover:text-zinc-205 px-2.5 py-1.5 transition cursor-pointer"
              >
                Collapse ✕
              </button>
            </div>
            
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider block mb-2">Client Setting (Audience)</label>
                <div className="relative">
                  <select 
                    value={audienceId}
                    onChange={(e) => {
                      setAudienceId(e.target.value);
                      setCheckedQuestions({});
                    }}
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base md:text-lg font-semibold text-zinc-100 outline-none focus:border-emerald-400 cursor-pointer pr-10"
                  >
                    {audiences.map((item) => (
                      <option key={item.id} value={item.id}>
                        {iconMap[item.id]} {item.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400 text-sm">
                    ▼
                  </div>
                </div>
              </div>
              
              <div className="flex-1 sm:ml-4">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider block mb-2">Presenter Name</label>
                <input
                  type="text"
                  value={presenterName}
                  onChange={(e) => onPresenterNameChange(e.target.value)}
                  placeholder="Presenter Name"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base md:text-lg font-semibold text-zinc-100 outline-none focus:border-emerald-400 animate-fade-in"
                />
              </div>
            </div>

            {/* Goals Pill Row */}
            <div>
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider block mb-2">Client Goals</label>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {goals.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={cx(
                        "rounded-full px-3.5 py-2 text-sm font-semibold border transition cursor-pointer shrink-0",
                        isSelected 
                          ? "border-emerald-400 bg-emerald-400/20 text-emerald-400 font-extrabold" 
                          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-650"
                      )}
                    >
                      {goal} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scan Color Row */}
            <div>
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider block mb-2">Scan Score Color</label>
              <div className="flex gap-2 bg-zinc-950 border border-zinc-850 rounded-xl p-2 overflow-x-auto no-scrollbar">
                {Object.keys(scoreGuidance).map((item) => {
                  const bgColors = {
                    red: "bg-red-500",
                    orange: "bg-orange-500",
                    yellow: "bg-yellow-400",
                    green: "bg-emerald-500",
                    blue: "bg-cyan-500",
                    purple: "bg-purple-500"
                  };
                  const isSelected = score === item;
                  return (
                    <button
                      key={item}
                      onClick={() => setScore(item)}
                      className={cx(
                        "flex items-center gap-1 rounded-lg px-2 py-1.5 text-base font-semibold capitalize border transition cursor-pointer shrink-0",
                        isSelected 
                          ? "border-emerald-400 bg-emerald-400/10 text-emerald-300 font-bold" 
                          : "border-transparent bg-transparent text-zinc-400 hover:text-zinc-200"
                      )}
                    >
                      <span className={cx("h-3 w-3 rounded-full shadow-inner shrink-0", bgColors[item])} />
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ── CUE CARD DISPLAY ── */}
      <Card className="bg-zinc-900/80 border border-zinc-800 p-5 md:p-6 shadow-xl relative overflow-hidden">
        {/* Card Progress Indicator */}
        <div className="flex items-center justify-between text-zinc-400 mb-3.5 border-b border-zinc-850 pb-3">
          <span className="font-extrabold text-emerald-400 uppercase tracking-wider text-sm">{steps[cardIndex - 1].label}</span>
          <span className="text-base font-semibold text-zinc-400">Card {cardIndex} of 3</span>
        </div>

        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-emerald-400 transition-all duration-300 shadow-md shadow-emerald-400/20"
            style={{ width: `${(cardIndex / 3) * 100}%` }}
          />
        </div>

        {/* Card Content Block */}
        <div className="min-h-[300px] flex flex-col justify-between">
          <div className="space-y-5.5">
            
            {/* CARD 1: THE OPENING HOOK */}
            {cardIndex === 1 && (
              <div className="space-y-4.5 animate-fade-in">
                {/* Step 1: Compliance Disclaimer */}
                <div className="space-y-2">
                  <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">
                    Step 1: Frame the Scanner
                  </span>
                  <div className="bg-zinc-950/40 border border-zinc-855 rounded-xl p-5 shadow-inner">
                    <p className="text-zinc-50 text-base md:text-lg leading-relaxed font-sans font-semibold">
                      "Before I explain anything, <span className="text-emerald-300 font-extrabold">this is not a medical test</span> and I'm not here to diagnose anything. Think of it as a <span className="text-emerald-300 font-extrabold">nutrition mirror</span>. It gives us a quick look at your carotenoid trend, which reflects how your food, supplements, and lifestyle habits show up."
                    </p>
                  </div>
                </div>

                {/* Step 2: The Scan Action */}
                <div className="space-y-2">
                  <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">
                    Step 2: Run Scan
                  </span>
                  <div className="bg-zinc-950/40 border border-zinc-855 rounded-xl p-5 shadow-inner">
                    <p className="text-zinc-50 text-base md:text-lg leading-relaxed font-sans font-semibold">
                      "Let's do a quick <span className="text-emerald-300 font-extrabold">15-second scan first</span>."
                    </p>
                  </div>
                </div>

                {/* Step 3: Audience Hook Opener */}
                <div className="space-y-2">
                  <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">
                    Step 3: Audience Hook ({audience.label})
                  </span>
                  <div className="bg-emerald-400/5 border border-emerald-500/15 rounded-xl p-5 md:p-6 shadow-inner">
                    <p className="text-zinc-50 text-lg md:text-xl font-sans font-extrabold leading-relaxed">
                      "{audience.opener}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CARD 2: TAILORED QUESTIONS */}
            {cardIndex === 2 && (
              <div className="space-y-4.5 animate-fade-in">
                {/* Intro Script */}
                <div className="bg-zinc-950/40 border border-zinc-855 rounded-xl p-5 shadow-inner">
                  <p className="text-zinc-50 text-base md:text-lg leading-relaxed font-sans font-semibold">
                    "Your score is in the <span className="text-emerald-300 font-extrabold capitalize">{scoreTone[score]}</span> today. I would not overcomplicate this. To help personalize this, let me ask you a few questions..."
                  </p>
                </div>

                <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Ask These Questions (Check off as you speak):</p>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 animate-fade-in">
                  {audience.questions.map((q, idx) => {
                    const isChecked = !!checkedQuestions[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => handleToggleQuestion(idx)}
                        className={cx(
                          "w-full flex items-start gap-4 rounded-xl border p-5 text-left text-base transition cursor-pointer",
                          isChecked 
                            ? "border-emerald-500/30 bg-emerald-500/5 text-zinc-450" 
                            : "border-zinc-800 bg-zinc-950/60 text-zinc-200 hover:border-zinc-700"
                        )}
                      >
                        <span className={cx(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded border text-sm font-extrabold mt-0.5",
                          isChecked ? "bg-emerald-400 border-emerald-400 text-zinc-950" : "border-zinc-700 text-transparent"
                        )}>
                          ✓
                        </span>
                        <div className="min-w-0">
                          <span className={cx("font-extrabold text-xs uppercase tracking-wider block mb-0.5", isChecked ? "text-zinc-500" : "text-emerald-400")}>
                            Question {idx + 1}
                          </span>
                          <p className={cx("font-sans leading-relaxed text-base md:text-lg font-semibold", isChecked && "line-through text-zinc-500")}>{q}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CARD 3: THE RECOMMENDATION & CLOSE */}
            {cardIndex === 3 && (
              <div className="space-y-4.5 animate-fade-in max-h-[400px] overflow-y-auto pr-1">
                {/* Closing Script */}
                <div className="bg-emerald-400/5 border border-emerald-500/10 rounded-xl p-5 md:p-6 space-y-3">
                  <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">
                    Closing Explanation (Say This)
                  </span>
                  <p className="text-zinc-50 text-base md:text-lg leading-relaxed font-sans font-semibold">
                    "Here is the simple read: your score gives us a starting point. The goal is not to shame the number. The goal is to pick one or two habits, support them if needed, and rescan so you can see progress."
                  </p>
                  <p className="text-zinc-50 text-base md:text-lg leading-relaxed font-sans font-semibold">
                    "Based on your setting and goals, I would suggest starting with: <span className="text-emerald-300 font-extrabold">{recommendations.slice(0, 3).join(", ")}</span>."
                  </p>
                  <p className="text-zinc-50 text-base md:text-lg leading-relaxed font-sans font-semibold">
                    "The next step is simple: try the plan for 30 days, rescan, and see what changed."
                  </p>
                </div>

                <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
                  {/* Score meaning detail */}
                  <div className="rounded-xl bg-zinc-950 border border-zinc-850 p-5 space-y-2">
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider leading-none">Score Meaning ({score})</p>
                    <p className="text-zinc-300 text-sm md:text-base font-sans leading-relaxed font-medium">{scoreGuidance[score]}</p>
                  </div>

                  {/* Next Step detail */}
                  <div className="rounded-xl bg-zinc-950 border border-zinc-855 p-5 space-y-2">
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider leading-none">Next Action</p>
                    <p className="text-zinc-300 text-sm md:text-base font-sans leading-relaxed font-medium">{audience.nextStep}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ── CARD BOTTOM ACTIONS ── */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
            {cardIndex > 1 ? (
              <button
                onClick={handleBack}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-6 py-3.5 text-base font-bold text-zinc-300 hover:border-zinc-700 transition cursor-pointer"
              >
                ← Back
              </button>
            ) : (
              <div /> // spacer
            )}

            {cardIndex < 3 ? (
              <button
                onClick={handleNext}
                className="rounded-xl bg-emerald-400 px-7 py-3.5 text-base font-extrabold text-zinc-950 hover:bg-emerald-300 transition cursor-pointer shadow-md shadow-emerald-400/10"
              >
                {cardIndex === 1 ? "Start Assessment →" : "See Recommendations →"}
              </button>
            ) : (
              <div className="flex gap-2.5 flex-1">
                <button
                  onClick={onSaveClient}
                  className="flex-1 rounded-xl bg-emerald-400 py-3.5 text-center text-base font-extrabold text-zinc-950 hover:bg-emerald-300 transition cursor-pointer shadow-md shadow-emerald-400/10"
                >
                  Save Client
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-zinc-855 bg-zinc-900 px-5 py-3.5 text-center text-base font-bold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition cursor-pointer"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

        </div>
      </Card>
    </div>
  );
}

function ManagerDashboardView({
  currentUser,
  pipeline,
  presenterList,
  onLogout,
  onViewCompanion,
  onDeleteClient,
  onStatusChange
}) {
  const [selectedPresenterFilter, setSelectedPresenterFilter] = useState("all");
  const [selectedColorFilter, setSelectedColorFilter] = useState("all");

  const filteredClients = useMemo(() => {
    return pipeline.filter(c => {
      const matchPresenter = selectedPresenterFilter === "all" || c.presenter === selectedPresenterFilter;
      const matchColor = selectedColorFilter === "all" || c.score === selectedColorFilter;
      return matchPresenter && matchColor;
    });
  }, [pipeline, selectedPresenterFilter, selectedColorFilter]);

  const totalTeamScans = presenterList.reduce((acc, p) => acc + p.scans, 0);
  const totalSavedClients = pipeline.length;
  const teamConversionRate = totalTeamScans > 0 ? Math.round((totalSavedClients / totalTeamScans) * 100) : 0;
  
  const collectiveGoal = presenterList.reduce((acc, p) => acc + p.scanGoal, 0);
  const goalPercentage = Math.min(100, Math.round((totalSavedClients / collectiveGoal) * 100));

  const scoreCounts = pipeline.reduce((acc, item) => {
    acc[item.score] = (acc[item.score] || 0) + 1;
    return acc;
  }, {});

  const getPresenterClientCount = (name) => {
    return pipeline.filter(c => c.presenter === name).length;
  };

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

  return (
    <div className="space-y-6 animate-fade-in text-zinc-50">
      {/* Header banner */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge active={true}>Corporate Manager Mode</Badge>
            <span className="text-xs text-zinc-500">Company: Prysm Corporate Operations</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Manager Dashboard</h1>
          <p className="max-w-3xl text-sm text-zinc-300">Measure sales performance, track conversion analytics, and audit the client pipeline.</p>
        </div>
        <button 
          onClick={onLogout}
          className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-3 text-sm font-bold text-red-400 hover:bg-red-950/20 hover:border-red-900/30 transition cursor-pointer shadow-sm self-start md:self-center"
        >
          Logout Account
        </button>
      </section>

      {/* Team Metrics Overview */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card className="p-5 flex flex-col justify-between bg-zinc-900/50">
          <div>
            <p className="text-zinc-400 text-sm font-medium">Total Team Scans</p>
            <p className="text-4xl font-bold text-zinc-50 mt-1">{totalTeamScans}</p>
          </div>
          <span className="text-xs text-zinc-500 mt-3 block">Total presentation touchpoints</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between bg-zinc-900/50">
          <div>
            <p className="text-zinc-400 text-sm font-medium">Total Saved Clients</p>
            <p className="text-4xl font-bold text-emerald-400 mt-1">{totalSavedClients}</p>
          </div>
          <span className="text-xs text-zinc-500 mt-3 block">Total database conversions</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between bg-zinc-900/50">
          <div>
            <p className="text-zinc-400 text-sm font-medium">Team Conversion Rate</p>
            <p className="text-4xl font-bold text-zinc-50 mt-1">{teamConversionRate}%</p>
          </div>
          <span className="text-xs text-zinc-500 mt-3 block">Scans converted to clients</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between bg-zinc-900/50">
          <div>
            <p className="text-zinc-400 text-sm font-medium">Corporate Target Progress</p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-3xl font-bold text-zinc-50">{totalSavedClients} / {collectiveGoal}</p>
              <span className="text-sm font-semibold text-emerald-400">{goalPercentage}%</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-2 mt-3 overflow-hidden border border-zinc-800">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${goalPercentage}%` }}></div>
            </div>
          </div>
          <span className="text-xs text-zinc-500 mt-2 block">Team collective monthly target</span>
        </Card>
      </div>

      {/* Salesperson Leaderboard */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-zinc-850 bg-zinc-900/30">
          <h2 className="text-xl font-bold text-zinc-50">Salesperson Performance Leaderboard</h2>
          <p className="text-xs text-zinc-400">Track raw activity, client pipeline conversions, and target achievements.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="p-4">Salesperson</th>
                <th className="p-4">Scan Goal Progress</th>
                <th className="p-4">Saved Clients</th>
                <th className="p-4">Conversion Rate</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {presenterList.map(p => {
                const clientsCount = getPresenterClientCount(p.name);
                const convRate = p.scans > 0 ? Math.round((clientsCount / p.scans) * 100) : 0;
                const progressPercentage = Math.min(100, Math.round((p.scans / p.scanGoal) * 100));
                
                // Determine status badge
                let statusText = "Needs Support";
                let statusClass = "bg-red-500/10 text-red-400 border border-red-500/20";
                if (clientsCount >= p.scanGoal || progressPercentage >= 100) {
                  statusText = "Goal Met";
                  statusClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                } else if (convRate >= 15) {
                  statusText = "On Track";
                  statusClass = "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
                }

                return (
                  <tr key={p.name} className="hover:bg-zinc-900/20 transition">
                    <td className="p-4">
                      <p className="font-bold text-zinc-100">{p.name}</p>
                      <p className="text-xs text-zinc-500">{p.email}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-zinc-350 w-12">{p.scans} / {p.scanGoal}</span>
                        <div className="flex-1 max-w-[150px] bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-900">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-semibold">{progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-zinc-100">{clientsCount}</td>
                    <td className="p-4 font-semibold text-zinc-300">{convRate}%</td>
                    <td className="p-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${statusClass}`}>
                        {statusText}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onViewCompanion(p)}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition cursor-pointer"
                      >
                        👁️ View Companion
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Global client database with filters */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-zinc-850 bg-zinc-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-50">Global Client Pipeline Database</h2>
            <p className="text-xs text-zinc-400 font-medium">Audit saved carotenoid scores, goals, and offered products across the entire company.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by salesperson */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Salesperson:</span>
              <select
                value={selectedPresenterFilter}
                onChange={(e) => setSelectedPresenterFilter(e.target.value)}
                className="bg-zinc-950 text-zinc-300 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-emerald-400 transition cursor-pointer"
              >
                <option value="all">All Salespeople</option>
                {presenterList.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Filter by scan color */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Scan Color:</span>
              <select
                value={selectedColorFilter}
                onChange={(e) => setSelectedColorFilter(e.target.value)}
                className="bg-zinc-950 text-zinc-300 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-emerald-400 transition cursor-pointer"
              >
                <option value="all">All Colors</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
                <option value="yellow">Yellow</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="p-4">Client Name</th>
                <th className="p-4">Presenter</th>
                <th className="p-4">Audience</th>
                <th className="p-4">Score</th>
                <th className="p-4">Goals</th>
                <th className="p-4">Products Offered</th>
                <th className="p-4">Scan Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-zinc-500">
                    No client records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredClients.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-900/20 transition">
                    <td className="p-4">
                      <p className="font-bold text-zinc-100">{item.clientName}</p>
                      <p className="text-xs text-zinc-500">{item.clientEmail}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-zinc-300">{item.presenter || "Bobby"}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-350">
                        {iconMap[item.audienceId] || "👤"} {item.audienceId ? (item.audienceId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')) : "General"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cx(
                        "inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
                        item.score === 'red' && 'bg-red-500/10 text-red-400 border border-red-500/20',
                        item.score === 'orange' && 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
                        item.score === 'yellow' && 'bg-yellow-500/10 text-amber-300 border border-amber-500/20',
                        item.score === 'green' && 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
                        item.score === 'blue' && 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
                        item.score === 'purple' && 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      )}>
                        {item.score}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[130px]">
                        {item.goals.slice(0, 2).map(g => (
                          <span key={g} className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-medium">{g}</span>
                        ))}
                        {item.goals.length > 2 && <span className="text-[10px] text-zinc-500 px-1 font-bold">+{item.goals.length - 2}</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {item.products.slice(0, 3).map(p => (
                          <span key={p} className="text-[9px] bg-emerald-400/5 text-emerald-300 border border-emerald-400/10 px-1.5 py-0.5 rounded whitespace-nowrap font-medium">{p}</span>
                        ))}
                        {item.products.length > 3 && <span className="text-[9px] text-emerald-500 font-bold">+{item.products.length - 3}</span>}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-zinc-300 font-semibold">{item.date}</td>
                    <td className="p-4">
                      <select 
                        value={item.status} 
                        onChange={(e) => onStatusChange(item.id, e.target.value)}
                        className="bg-zinc-950 text-zinc-350 border border-zinc-850 rounded-xl p-1.5 text-xs outline-none focus:border-emerald-400 transition cursor-pointer"
                      >
                        <option value="Scan Completed">Scan Completed</option>
                        <option value="Follow-up Sent">Follow-up Sent</option>
                        <option value="Rescan Scheduled">Rescan Scheduled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onDeleteClient(item.id)}
                        className="text-zinc-500 hover:text-red-400 px-2 py-1 text-xs font-semibold transition duration-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function PrysmPipeline() {
  // Sales Session State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("prysm_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [masqueradingPresenter, setMasqueradingPresenter] = useState(null);

  // Presentation State
  const [audienceId, setAudienceId] = useState("gym_trainer");
  const [score, setScore] = useState("yellow");
  const [selectedGoals, setSelectedGoals] = useState(["Nutrition gaps"]);
  const [activeTab, setActiveTab] = useState("builder");

  // Client Pipeline Modal State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");

  // presenter Profile State
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("prysm_profile");
      return saved ? JSON.parse(saved) : {
        name: "Bobby",
        email: "bobby@prysmpipeline.com",
        company: "Prysm Wellness Group",
        scannerModel: "Prysm iO",
        scanGoal: 25
      };
    } catch {
      return {
        name: "Bobby",
        email: "bobby@prysmpipeline.com",
        company: "Prysm Wellness Group",
        scannerModel: "Prysm iO",
        scanGoal: 25
      };
    }
  });

  const [presenterName, setPresenterName] = useState(profile.name);

  // Responsive / Layout Mode State
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    try {
      return window.innerWidth < 768;
    } catch {
      return false;
    }
  });

  const [layoutMode, setLayoutMode] = useState(() => {
    try {
      return window.innerWidth < 768 ? "mobile-wizard" : "desktop";
    } catch {
      return "desktop";
    }
  });

  const [wizardStep, setWizardStep] = useState(1);

  // Viewport resize listener to automatically adjust layout defaults
  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileViewport(isMobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync default mode on viewport changes, but allow manual toggle overrides
  React.useEffect(() => {
    setLayoutMode(isMobileViewport ? "mobile-wizard" : "desktop");
  }, [isMobileViewport]);

  // Fetch clients from Vercel Serverless API on mount
  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        if (res.ok) {
          const data = await res.json();
          setPipeline(data);
        }
      } catch (err) {
        console.warn("API load failed, using localStorage fallback:", err.message);
      }
    };
    fetchClients();
  }, []);

  // Sync builder presenter name to profile
  const handlePresenterNameChange = (name) => {
    if (masqueradingPresenter) {
      setMasqueradingPresenter(prev => prev ? { ...prev, name } : null);
      return;
    }
    setPresenterName(name);
    setProfile((prev) => {
      const updated = { ...prev, name };
      localStorage.setItem("prysm_profile", JSON.stringify(updated));
      return updated;
    });
  };

  // Saved Client database state
  const [pipeline, setPipeline] = useState(() => {
    try {
      const saved = localStorage.getItem("prysm_pipeline");
      if (saved) return JSON.parse(saved);
    } catch {}
    
    return [
      {
        id: "mock-1",
        clientName: "Sarah Miller",
        clientEmail: "sarah.m@example.com",
        audienceId: "yoga_wellness",
        score: "green",
        goals: ["Energy", "Gut comfort"],
        products: ["LifePak Elements", "Nu Biome"],
        date: "2026-05-15",
        status: "Scan Completed",
        presenter: "Bobby"
      },
      {
        id: "mock-2",
        clientName: "David Chen",
        clientEmail: "dchen@example.com",
        audienceId: "gym_trainer",
        score: "yellow",
        goals: ["Athletic recovery", "Energy"],
        products: ["TRMe GO Protein+", "LifePak Elements"],
        date: "2026-05-28",
        status: "Follow-up Sent",
        presenter: "Bobby"
      },
      {
        id: "mock-3",
        clientName: "Emma Rodriguez",
        clientEmail: "emma.rod@example.com",
        audienceId: "salon_spa",
        score: "orange",
        goals: ["Skin/beauty", "Stress"],
        products: ["Beauty Focus Collagen+", "Nu Biome"],
        date: "2026-06-01",
        status: "Rescan Scheduled",
        presenter: "Alex"
      },
      {
        id: "mock-4",
        clientName: "Marcus Vance",
        clientEmail: "marcus.v@example.com",
        audienceId: "scanner_builder",
        score: "red",
        goals: ["Place scanner", "Extra income"],
        products: ["Prysm iO scanner placement path", "LifePak Elements"],
        date: "2026-06-03",
        status: "Scan Completed",
        presenter: "Alex"
      },
      {
        id: "mock-5",
        clientName: "Chloe Higgins",
        clientEmail: "chloe.h@example.com",
        audienceId: "yoga_wellness",
        score: "blue",
        goals: ["Gut comfort", "Skin/beauty"],
        products: ["Beauty Focus Collagen+", "Nu Biome"],
        date: "2026-06-02",
        status: "Completed",
        presenter: "Sarah"
      },
      {
        id: "mock-6",
        clientName: "Michael Vance",
        clientEmail: "m.vance@example.com",
        audienceId: "athlete_event",
        score: "purple",
        goals: ["Athletic recovery"],
        products: ["TRMe GO Protein+"],
        date: "2026-06-03",
        status: "Scan Completed",
        presenter: "Sarah"
      },
      {
        id: "mock-7",
        clientName: "James Watson",
        clientEmail: "jwatson@example.com",
        audienceId: "gym_trainer",
        score: "yellow",
        goals: ["Energy", "Sleep"],
        products: ["LifePak Elements", "MYND360 Night Time"],
        date: "2026-05-20",
        status: "Follow-up Sent",
        presenter: "David"
      },
      {
        id: "mock-8",
        clientName: "Lisa Wong",
        clientEmail: "lisa.wong@example.com",
        audienceId: "eye_dental_chiro",
        score: "green",
        goals: ["Nutrition gaps"],
        products: ["LifePak Elements"],
        date: "2026-05-25",
        status: "Scan Completed",
        presenter: "David"
      }
    ];
  });

  const savePipeline = (updated) => {
    setPipeline(updated);
    localStorage.setItem("prysm_pipeline", JSON.stringify(updated));
  };

  // Computed Presenter List for Manager and Team metrics
  const presenterList = useMemo(() => {
    const defaultList = [
      { name: "Bobby", email: "bobby@prysmpipeline.com", scanGoal: 25, scans: 15 },
      { name: "Alex", email: "alex@prysmpipeline.com", scanGoal: 20, scans: 8 },
      { name: "Sarah", email: "sarah@prysmpipeline.com", scanGoal: 30, scans: 12 },
      { name: "David", email: "david@prysmpipeline.com", scanGoal: 25, scans: 10 }
    ];
    // If the logged in presenter is not in the default list, add them dynamically
    const currentName = currentUser && currentUser.role !== "manager" ? currentUser.name : null;
    if (currentName && !defaultList.some(p => p.name === currentName)) {
      defaultList.push({
        name: currentName,
        email: currentUser.email || `${currentName.toLowerCase()}@prysmpipeline.com`,
        scanGoal: profile.scanGoal || 25,
        scans: pipeline.filter(c => c.presenter === currentName).length + 2
      });
    }
    return defaultList;
  }, [currentUser, pipeline, profile.scanGoal]);

  const activePresenterName = masqueradingPresenter ? masqueradingPresenter.name : ((currentUser && currentUser.role === "manager") ? "Manager" : presenterName);

  const activePresenter = useMemo(() => {
    if (masqueradingPresenter) {
      return presenterList.find(p => p.name === masqueradingPresenter.name) || {
        name: masqueradingPresenter.name,
        email: masqueradingPresenter.email || `${masqueradingPresenter.name.toLowerCase()}@prysmpipeline.com`,
        company: "Prysm Wellness Group",
        scannerModel: "Prysm iO",
        scanGoal: 25
      };
    }
    return {
      name: presenterName,
      email: profile.email,
      company: profile.company,
      scannerModel: profile.scannerModel,
      scanGoal: profile.scanGoal
    };
  }, [masqueradingPresenter, presenterList, presenterName, profile]);

  const handleSaveClient = async () => {
    if (!newClientName) return;
    const activeName = masqueradingPresenter ? masqueradingPresenter.name : ((currentUser && currentUser.role === "manager") ? "Manager" : presenterName);
    const newRecord = {
      id: "scan-" + Date.now(),
      clientName: newClientName,
      clientEmail: newClientEmail || `${newClientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      audienceId,
      score,
      goals: [...selectedGoals],
      products: [...recommendations],
      date: new Date().toISOString().split("T")[0],
      status: "Scan Completed",
      presenter: activeName
    };

    // Optimistic local update
    const updated = [newRecord, ...pipeline];
    savePipeline(updated);

    try {
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord)
      });
    } catch (err) {
      console.warn("API save client failed, using local fallback:", err.message);
    }

    setNewClientName("");
    setNewClientEmail("");
    setShowSaveModal(false);
  };

  const handleDeleteClient = async (id) => {
    const updated = pipeline.filter(item => item.id !== id);
    savePipeline(updated);

    try {
      await fetch(`/api/clients?id=${id}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.warn("API delete client failed, using local fallback:", err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const updated = pipeline.map(item => item.id === id ? { ...item, status: newStatus } : item);
    savePipeline(updated);

    try {
      await fetch("/api/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (err) {
      console.warn("API update status failed, using local fallback:", err.message);
    }
  };

  const audience = getAudienceById(audienceId);
  const recommendations = useMemo(() => buildRecommendation(audience, selectedGoals, score), [audience, selectedGoals, score]);
  const selfTests = useMemo(() => runSelfTests(), []);
  const passedCount = selfTests.filter((test) => test.passed).length;

  const toggleGoal = (goal) => {
    setSelectedGoals((current) => current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]);
  };

  const scriptText = `${activePresenter.name}: Before I explain anything, this is not a medical test and I'm not here to diagnose anything. Think of it as a nutrition mirror. It gives us a quick look at your carotenoid trend, which can reflect how your food, supplements, and lifestyle habits are showing up.

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

  // Render Authentication View if not logged in
  if (!currentUser) {
    return (
      <LoginView 
        onLogin={(user) => {
          localStorage.setItem("prysm_user", JSON.stringify(user));
          setCurrentUser(user);
        }} 
      />
    );
  }

  // Render manager dashboard if role is manager and not masquerading
  if (currentUser.role === "manager" && !masqueradingPresenter) {
    return (
      <main className="min-h-screen bg-zinc-950 p-4 text-zinc-50 md:p-8 relative">
        <div className="mx-auto max-w-6xl space-y-6">
          <ManagerDashboardView
            currentUser={currentUser}
            pipeline={pipeline}
            presenterList={presenterList}
            onLogout={() => {
              localStorage.removeItem("prysm_user");
              setCurrentUser(null);
            }}
            onViewCompanion={(pres) => {
              setMasqueradingPresenter(pres);
              setActiveTab("builder");
            }}
            onDeleteClient={handleDeleteClient}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>
    );
  }

  // Filter client pipeline based on the active presenter
  const activePresenterPipeline = pipeline.filter(item => item.presenter === activePresenter.name);

  // Dashboard calculations
  const totalScans = activePresenterPipeline.length;
  const currentMonthScans = activePresenterPipeline.filter(s => s.date.startsWith("2026-06")).length;
  const targetPercentage = Math.min(100, Math.round((currentMonthScans / activePresenter.scanGoal) * 100));

  const scoreCounts = activePresenterPipeline.reduce((acc, item) => {
    acc[item.score] = (acc[item.score] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 relative">
      {/* Masquerade Mode Warning Banner */}
      {masqueradingPresenter && (
        <div className="bg-emerald-500 text-zinc-950 font-bold px-4 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span>👁️ Masquerading as <strong>{masqueradingPresenter.name}</strong></span>
            <span className="text-xs bg-zinc-950/20 px-2 py-0.5 rounded font-extrabold">Manager View Mode</span>
          </div>
          <button 
            onClick={() => setMasqueradingPresenter(null)}
            className="bg-zinc-950 text-emerald-400 hover:bg-zinc-900 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer"
          >
            Exit Masquerade
          </button>
        </div>
      )}

      <div className="mx-auto max-w-6xl p-4 md:p-8 space-y-6">
        
        {/* App Title Banner */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge>Sales Dashboard</Badge>
              <span className="text-xs text-zinc-500">Presenter: {activePresenter.name} ({activePresenter.company})</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Prysm Pipeline</h1>
            <p className="max-w-3xl text-sm text-zinc-300">Scanner-first client management system to convert scans to recurring pipeline support.</p>
          </div>

          {/* Responsive Layout Switcher Toggle & Logout */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-center">
            <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 rounded-xl p-1">
              <button 
                onClick={() => setLayoutMode("desktop")} 
                className={cx(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer", 
                  layoutMode === "desktop" 
                    ? "bg-emerald-400 text-zinc-950 font-bold" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                )}
              >
                Desktop Grid
              </button>
              <button 
                onClick={() => setLayoutMode("mobile-wizard")} 
                className={cx(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer", 
                  layoutMode === "mobile-wizard" 
                    ? "bg-emerald-400 text-zinc-950 font-bold" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                )}
              >
                Mobile Wizard
              </button>
            </div>

            <button 
              onClick={() => {
                localStorage.removeItem("prysm_user");
                setCurrentUser(null);
                setMasqueradingPresenter(null);
              }}
              className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-950/20 hover:border-red-900/30 transition cursor-pointer shadow-sm"
            >
              Logout Account
            </button>
          </div>
        </section>

        {/* Global tab routing */}
        <section className="flex flex-wrap gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-2">
          <TabButton active={activeTab === "builder"} onClick={() => setActiveTab("builder")}>Builder</TabButton>
          <TabButton active={activeTab === "script"} onClick={() => setActiveTab("script")}>Script</TabButton>
          <TabButton active={activeTab === "prompt"} onClick={() => setActiveTab("prompt")}>AI Prompt</TabButton>
          <TabButton active={activeTab === "guardrails"} onClick={() => setActiveTab("guardrails")}>Guardrails</TabButton>
          <TabButton active={activeTab === "pipeline"} onClick={() => setActiveTab("pipeline")}>Pipeline</TabButton>
          <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>Profile</TabButton>
          <TabButton active={activeTab === "tests"} onClick={() => setActiveTab("tests")}>Tests</TabButton>
        </section>

        {/* Builder View */}
        {activeTab === "builder" && (
          layoutMode === "desktop" ? (
            <section className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
              <Card>
                <div className="space-y-5 p-5">
                  <div className="space-y-3">
                    <FieldLabel>Presenter name</FieldLabel>
                    <input 
                      value={activePresenter.name} 
                      onChange={(event) => handlePresenterNameChange(event.target.value)} 
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-400" 
                    />
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
                    <FieldLabel>Primary goals</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {goals.map((goal) => (
                        <button key={goal} onClick={() => toggleGoal(goal)} className={cx("rounded-full border px-3 py-2 text-sm transition", selectedGoals.includes(goal) ? "border-emerald-400 bg-emerald-400 text-zinc-950" : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600")}>
                          {goal}
                        </button>
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

                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="mb-1 text-sm text-emerald-200">Recommended next step</p>
                      <p>{audience.nextStep}</p>
                    </div>
                    <button 
                      onClick={() => setShowSaveModal(true)}
                      className="shrink-0 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-300 transition duration-200 cursor-pointer shadow-md shadow-emerald-400/5"
                    >
                      Save Client to Pipeline
                    </button>
                  </div>
                </div>
              </Card>
            </section>
          ) : (
            <WizardView
              presenterName={activePresenter.name}
              onPresenterNameChange={handlePresenterNameChange}
              profile={activePresenter}
              setProfile={setProfile}
              audienceId={audienceId}
              setAudienceId={setAudienceId}
              score={score}
              setScore={setScore}
              selectedGoals={selectedGoals}
              toggleGoal={toggleGoal}
              recommendations={recommendations}
              audience={audience}
              scoreTone={scoreTone}
              scoreGuidance={scoreGuidance}
              goals={goals}
              iconMap={iconMap}
              wizardStep={wizardStep}
              setWizardStep={setWizardStep}
              onSaveClient={() => setShowSaveModal(true)}
            />
          )
        )}

        {/* Script View */}
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

        {/* Prompt View */}
        {activeTab === "prompt" && (
          <Card>
            <div className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold">AI Prompt Structure</h2>
              <pre className="whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-950 p-5 font-sans leading-relaxed text-zinc-100">{promptText}</pre>
            </div>
          </Card>
        )}

        {/* Guardrails View */}
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

        {/* Client Pipeline Tab */}
        {activeTab === "pipeline" && (
          <div className="space-y-6">
            
            {/* KPI metrics cards */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card className="p-5 flex flex-col justify-between">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">Pipeline Size</p>
                  <p className="text-4xl font-bold text-zinc-50 mt-1">{totalScans} Client Scans</p>
                </div>
                <span className="text-xs text-zinc-500 mt-2 block">Total historical evaluations conducted</span>
              </Card>

              <Card className="p-5 flex flex-col justify-between">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">Monthly Scan Target</p>
                  <div className="flex items-baseline justify-between mt-1">
                    <p className="text-4xl font-bold text-zinc-50">{currentMonthScans} / {activePresenter.scanGoal}</p>
                    <span className="text-sm font-semibold text-emerald-400">{targetPercentage}%</span>
                  </div>
                  <div className="w-full bg-zinc-950 rounded-full h-2 mt-3 overflow-hidden border border-zinc-800">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${targetPercentage}%` }}></div>
                  </div>
                </div>
                <span className="text-xs text-zinc-500 mt-2 block">Monthly target: {activePresenter.scanGoal} scans</span>
              </Card>

              <Card className="p-5 flex flex-col justify-between">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">Scan Color Spread</p>
                  <div className="flex gap-1.5 mt-2">
                    {['red', 'orange', 'yellow', 'green', 'blue', 'purple'].map(color => (
                      <div key={color} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-zinc-950 rounded-lg h-10 flex items-end overflow-hidden border border-zinc-900">
                          <div 
                            className={cx(
                              "w-full rounded-b-md transition-all duration-500",
                              color === 'red' && 'bg-red-500',
                              color === 'orange' && 'bg-orange-500',
                              color === 'yellow' && 'bg-amber-400',
                              color === 'green' && 'bg-emerald-500',
                              color === 'blue' && 'bg-blue-500',
                              color === 'purple' && 'bg-purple-500'
                            )}
                            style={{ height: `${totalScans ? ((scoreCounts[color] || 0) / totalScans) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium capitalize mt-1">{color.slice(0, 3)}</span>
                        <span className="text-xs font-bold text-zinc-300 mt-0.5">{scoreCounts[color] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Main table container */}
            <Card className="overflow-hidden">
              <div className="p-5 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/30">
                <div>
                  <h2 className="text-xl font-semibold">Active Client Pipeline</h2>
                  <p className="text-xs text-zinc-400">Progression tracker to monitor rescan compliance and product conversions.</p>
                </div>
                <button 
                  onClick={() => {
                    setAudienceId("gym_trainer");
                    setScore("yellow");
                    setSelectedGoals(["Nutrition gaps"]);
                    setActiveTab("builder");
                  }}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-600 transition"
                >
                  + Add Client Scan
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                      <th className="p-4">Client / Contact</th>
                      <th className="p-4">Audience</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Goals</th>
                      <th className="p-4">Products Offered</th>
                      <th className="p-4">Scan Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {activePresenterPipeline.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-zinc-500">
                          No client records logged yet. Run a scan in the Builder tab to save a client.
                        </td>
                      </tr>
                    ) : (
                      activePresenterPipeline.map(item => {
                        const scanDateObj = new Date(item.date);
                        const diffTime = Math.abs(new Date().getTime() - scanDateObj.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        const isRescanDue = diffDays >= 30;

                        return (
                          <tr key={item.id} className="hover:bg-zinc-900/20 transition">
                            <td className="p-4">
                              <p className="font-semibold text-zinc-100">{item.clientName}</p>
                              <p className="text-xs text-zinc-500">{item.clientEmail}</p>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 rounded bg-zinc-800/80 px-2 py-1 text-xs text-zinc-300">
                                {iconMap[item.audienceId] || "👤"} {getAudienceById(item.audienceId)?.label || item.audienceId}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={cx(
                                "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                                item.score === 'red' && 'bg-red-500/10 text-red-400 border border-red-500/20',
                                item.score === 'orange' && 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
                                item.score === 'yellow' && 'bg-yellow-500/10 text-amber-300 border border-amber-500/20',
                                item.score === 'green' && 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
                                item.score === 'blue' && 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
                                item.score === 'purple' && 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                              )}>
                                {item.score}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-[150px]">
                                {item.goals.slice(0, 2).map(g => (
                                  <span key={g} className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">{g}</span>
                                ))}
                                {item.goals.length > 2 && <span className="text-[10px] text-zinc-500 px-1 font-medium">+{item.goals.length - 2}</span>}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {item.products.map(p => (
                                  <span key={p} className="text-[10px] bg-emerald-400/5 text-emerald-300 border border-emerald-400/10 px-1.5 py-0.5 rounded whitespace-nowrap">{p}</span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <p className="text-zinc-200">{item.date}</p>
                              {isRescanDue && (
                                <span className="text-[9px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 rounded px-1 mt-1 inline-block animate-pulse">
                                  Rescan Due
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <select 
                                value={item.status} 
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                className="bg-zinc-950 text-zinc-300 border border-zinc-800 rounded-lg p-1.5 text-xs outline-none focus:border-emerald-400 transition"
                              >
                                <option value="Scan Completed">Scan Completed</option>
                                <option value="Follow-up Sent">Follow-up Sent</option>
                                <option value="Rescan Scheduled">Rescan Scheduled</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td className="p-4 text-center">
                              <button 
                                onClick={() => handleDeleteClient(item.id)}
                                className="text-zinc-500 hover:text-red-400 px-2 py-1 text-xs transition duration-200 cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Profile Settings View */}
        {activeTab === "profile" && (
          <section className="max-w-2xl mx-auto animate-fade-in">
            <Card>
              <div className="p-6 space-y-6">
                <div className="border-b border-zinc-800 pb-4">
                  <h2 className="text-2xl font-semibold">Presenter Settings</h2>
                  <p className="text-sm text-zinc-400">Manage salesperson credentials, scanner hardware details, and goals.</p>
                </div>

                {masqueradingPresenter && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-550/10 p-4 text-xs font-bold text-amber-400">
                    ⚠️ Settings are read-only while masquerading as {activePresenter.name}.
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <FieldLabel>Full Name</FieldLabel>
                      <input 
                        type="text" 
                        value={activePresenter.name}
                        disabled={!!masqueradingPresenter}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPresenterName(val);
                          setProfile(prev => {
                            const updated = { ...prev, name: val };
                            localStorage.setItem("prysm_profile", JSON.stringify(updated));
                            return updated;
                          });
                        }}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-400 transition disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Email Address</FieldLabel>
                      <input 
                        type="email" 
                        value={activePresenter.email || ""}
                        disabled={!!masqueradingPresenter}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProfile(prev => {
                            const updated = { ...prev, email: val };
                            localStorage.setItem("prysm_profile", JSON.stringify(updated));
                            return updated;
                          });
                        }}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-400 transition disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <FieldLabel>Company/Team Name</FieldLabel>
                      <input 
                        type="text" 
                        value={activePresenter.company || ""}
                        disabled={!!masqueradingPresenter}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProfile(prev => {
                            const updated = { ...prev, company: val };
                            localStorage.setItem("prysm_profile", JSON.stringify(updated));
                            return updated;
                          });
                        }}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-400 transition disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Scanner Model</FieldLabel>
                      <select 
                        value={activePresenter.scannerModel || "Prysm iO"}
                        disabled={!!masqueradingPresenter}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProfile(prev => {
                            const updated = { ...prev, scannerModel: val };
                            localStorage.setItem("prysm_profile", JSON.stringify(updated));
                            return updated;
                          });
                        }}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-400 transition disabled:opacity-50 cursor-pointer"
                      >
                        <option value="Prysm iO">Prysm iO</option>
                        <option value="Scanner M5">Scanner M5</option>
                        <option value="Scanner S3">Scanner S3</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <FieldLabel>Target Monthly Client Scans</FieldLabel>
                    <input 
                      type="number" 
                      value={activePresenter.scanGoal || 0}
                      disabled={!!masqueradingPresenter}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setProfile(prev => {
                          const updated = { ...prev, scanGoal: val };
                          localStorage.setItem("prysm_profile", JSON.stringify(updated));
                          return updated;
                        });
                      }}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-400 transition disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Linked to Vercel and GitHub repository deployments</span>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("prysm_user");
                      setCurrentUser(null);
                      setMasqueradingPresenter(null);
                    }}
                    className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition duration-200 cursor-pointer"
                  >
                    Logout Account
                  </button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Tests View */}
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

      {/* Save Client to Pipeline Modal overlay */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md overflow-hidden bg-zinc-900 border border-zinc-800 shadow-3xl">
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-zinc-50">Save Client Assessment</h3>
                <p className="text-xs text-zinc-400">Log this carotenoid scan directly into your active Pipeline client tracker.</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <FieldLabel>Client Name</FieldLabel>
                  <input 
                    type="text"
                    placeholder="Client Name" 
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-400 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Client Email</FieldLabel>
                  <input 
                    type="email"
                    placeholder="Client Email" 
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => {
                    setShowSaveModal(false);
                    setNewClientName("");
                    setNewClientEmail("");
                  }}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-600 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveClient}
                  className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-300 transition cursor-pointer shadow-lg shadow-emerald-400/5"
                >
                  Save to Pipeline
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
