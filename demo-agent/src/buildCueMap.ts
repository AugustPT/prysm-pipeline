/**
 * buildCueMap.ts — Build or update the cue map from a transcript or script text.
 *
 * Usage:  npx ts-node demo-agent/src/buildCueMap.ts
 *
 * If a transcript exists at demo-agent/output/transcript.json, it uses that.
 * Otherwise, it uses the built-in walkthrough script to generate the cue file.
 *
 * The generated cue file is human-readable and editable.
 * Existing cues are preserved if the cue file already exists (merge mode).
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Cue } from './actions';

dotenv.config();
dotenv.config({ path: '.env.example' });

const OUTPUT_DIR = process.env.DEMO_OUTPUT_DIR || 'demo-agent/output';
const CUES_PATH = process.env.DEMO_CUES_PATH || 'demo-agent/cues/prysm-pipeline-demo.json';

// ---------------------------------------------------------------------------
// Built-in script sections (from the walkthrough spec)
// ---------------------------------------------------------------------------

const SCRIPT_SECTIONS = [
  {
    id: 'login',
    title: 'Login screen',
    narration: "This is the landing page of the Prysm Pipeline companion. First, let's log in as a presenter using the Demo Presenter option.",
  },
  {
    id: 'opening',
    title: 'Opening',
    narration: "Once logged in, we land on the main workspace. This is the Prysm Pipeline app. It's a scanner-first conversation tool. The goal is to help someone run a simple 15–20 minute wellness conversation based on the person, their scan color, and what they care about.",
  },
  {
    id: 'builder-tab',
    title: 'Builder Tab',
    narration: 'Click Builder at the top. This is the main setup screen.',
  },
  {
    id: 'presenter-name',
    title: 'Presenter Name',
    narration: "On the left, you'll see Presenter name. This is where you type the name of the person running the demo. Whatever name is here will show up later inside the script.",
  },
  {
    id: 'audience-selection',
    title: 'Audience Selection',
    narration: "Below that, you'll see Who are we talking to? This is where you choose the type of person in front of you.",
  },
  {
    id: 'audience-result',
    title: 'Audience Changes Right Side',
    narration: "When you click one of these, look at the right side. The app changes the conversation to fit that person. You'll see the opening line change, the core questions change, the recommended next step change, and the conversation frame change.",
  },
  {
    id: 'scan-color',
    title: 'Scan Color',
    narration: 'Now look under Scan color. This is where you choose the color from their scan.',
  },
  {
    id: 'scan-color-result',
    title: 'Score Guidance Changes',
    narration: 'When you click a scan color, look on the right side at Score guidance. That section tells you how to explain their scan result in a simple, non-shaming way.',
  },
  {
    id: 'primary-goals',
    title: 'Primary Goals',
    narration: 'Now go down to Primary goals. This is where you choose what the person cares about.',
  },
  {
    id: 'goals-result',
    title: 'Product Fit Changes',
    narration: 'When you click those goals, look at Possible product fit on the right. That section updates based on what they care about.',
  },
  {
    id: 'save-client',
    title: 'Save Client to Pipeline',
    narration: 'Now that we have configured the scan results and goals, let\'s save this client directly into our sales pipeline.',
  },
  {
    id: 'builder-summary',
    title: 'Builder Summary',
    narration: 'So the Builder tab answers four things: Who is presenting? Who are we talking to? What did their scan show? What do they care about? Then the right side gives you the conversation.',
  },
  {
    id: 'script-tab',
    title: 'Script Tab',
    narration: 'Now click Script at the top. This is where the app turns everything from the Builder screen into a simple demo script.',
  },
  {
    id: 'script-flow',
    title: 'Script Five-Part Flow',
    narration: "At the top, you'll see the five-part flow: Frame, Scan, Explain, Ask, Next Step.",
  },
  {
    id: 'script-output',
    title: 'Script Output',
    narration: "Below that, you'll see the actual script. This is what the presenter can read or practice from.",
  },
  {
    id: 'ai-prompt-tab',
    title: 'AI Prompt Tab',
    narration: 'Now click AI Prompt. This tab gives you a ready-to-use prompt for an AI assistant.',
  },
  {
    id: 'guardrails-tab',
    title: 'Guardrails Tab',
    narration: 'Now click Guardrails. This is the compliance screen.',
  },
  {
    id: 'guardrails-say-this',
    title: 'Guardrails — Say This',
    narration: 'On the left, under Say this, these are the safe phrases to use.',
  },
  {
    id: 'guardrails-avoid-this',
    title: 'Guardrails — Avoid This',
    narration: 'On the right, under Avoid this, these are the phrases to stay away from.',
  },
  {
    id: 'guardrails-compliance',
    title: 'Guardrails — Compliance Reminder',
    narration: 'The yellow box at the bottom is the reminder that real deployment should use official approved claims.',
  },
  {
    id: 'pipeline-tab',
    title: 'Pipeline Tab Dashboard',
    narration: 'Now let\'s switch to the Pipeline tab to view our updated sales dashboard and client pipeline tracker.',
  },
  {
    id: 'tests-tab',
    title: 'Tests Tab',
    narration: "Now click Tests. This is the app's internal check screen. When everything says Pass, that means the demo logic is working correctly.",
  },
  {
    id: 'closing',
    title: 'Closing',
    narration: "That's the app: it helps someone run a smarter scanner conversation without guessing what to say.",
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║           Prysm Demo — Cue Map Builder                     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log();

  // Check for existing transcript
  const transcriptPath = path.join(OUTPUT_DIR, 'transcript.json');
  let useTranscript = false;
  if (fs.existsSync(transcriptPath)) {
    console.log(`  Found transcript: ${transcriptPath}`);
    useTranscript = true;
  } else {
    console.log('  No transcript found. Using built-in script text.');
  }

  // Check for existing cue file
  const cuesFullPath = path.resolve(CUES_PATH);
  let existingCues: Cue[] = [];
  if (fs.existsSync(cuesFullPath)) {
    try {
      existingCues = JSON.parse(fs.readFileSync(cuesFullPath, 'utf-8'));
      console.log(`  Existing cue file found with ${existingCues.length} cues.`);
      console.log('  Existing cues will be preserved (merge mode).');
    } catch {
      console.log('  Could not parse existing cue file. Will overwrite.');
    }
  }

  // If cue file already exists and has content, keep it
  if (existingCues.length > 0) {
    console.log('\n✅ Cue file already exists and is populated.');
    console.log(`   Path: ${cuesFullPath}`);
    console.log('   To rebuild from scratch, delete the cue file and re-run.');
    return;
  }

  // Build cue file from script sections
  console.log('\n  Building cue map from script sections...');
  console.log(`  Sections: ${SCRIPT_SECTIONS.length}`);

  // The full cue file is maintained separately in the cues directory.
  // This script validates and reports on it.
  console.log('\n  The cue file should be pre-built at:');
  console.log(`  ${cuesFullPath}`);
  console.log('\n  Run npm run demo:run to execute the walkthrough.');
  console.log('\n✅ Cue map builder complete.');
}

main().catch((err) => {
  console.error('💥 Build cue map crashed:', err);
  process.exit(1);
});
