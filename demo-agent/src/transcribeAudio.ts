/**
 * transcribeAudio.ts — Transcribe walkthrough audio using OpenAI Whisper.
 *
 * Usage:  npx ts-node demo-agent/src/transcribeAudio.ts
 *
 * Requires:
 *   - OPENAI_API_KEY in .env
 *   - Audio file at DEMO_AUDIO_PATH
 *
 * If either is missing, the script skips gracefully.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.example' });

const AUDIO_PATH = process.env.DEMO_AUDIO_PATH || 'demo-agent/audio/walkthrough.mp3';
const OUTPUT_DIR = process.env.DEMO_OUTPUT_DIR || 'demo-agent/output';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║             Prysm Demo — Audio Transcription                ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log();

  // Check audio file
  const audioFullPath = path.resolve(AUDIO_PATH);
  if (!fs.existsSync(audioFullPath)) {
    console.log(`⚠️  Audio file not found: ${audioFullPath}`);
    console.log('   Place your walkthrough audio at DEMO_AUDIO_PATH and re-run.');
    console.log('   Skipping transcription.');
    return;
  }
  console.log(`  Audio file: ${audioFullPath}`);

  // Check API key
  if (!OPENAI_API_KEY) {
    console.log('⚠️  OPENAI_API_KEY not set in .env');
    console.log('   Set your key to enable Whisper transcription.');
    console.log('   Skipping transcription.');
    return;
  }

  console.log('  API key: configured ✓');
  console.log('  Sending to OpenAI Whisper...');
  console.log();

  try {
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const audioFile = fs.createReadStream(audioFullPath);

    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audioFile as any,
      response_format: 'verbose_json',
      timestamp_granularities: ['segment'],
    } as any);

    // Save transcript
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const transcriptPath = path.join(OUTPUT_DIR, 'transcript.json');
    fs.writeFileSync(transcriptPath, JSON.stringify(transcription, null, 2));
    console.log(`✅ Transcript saved: ${transcriptPath}`);

    // Also save a plain text version
    const textPath = path.join(OUTPUT_DIR, 'transcript.txt');
    const text = (transcription as any).text || JSON.stringify(transcription);
    fs.writeFileSync(textPath, text);
    console.log(`✅ Plain text saved: ${textPath}`);

    // Show preview
    console.log('\n  Preview (first 300 chars):');
    console.log(`  ${text.substring(0, 300)}...`);
  } catch (err: any) {
    console.error(`❌ Transcription failed: ${err.message}`);
    if (err.message.includes('401') || err.message.includes('Unauthorized')) {
      console.error('   Check your OPENAI_API_KEY.');
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('💥 Transcribe script crashed:', err);
  process.exit(1);
});
