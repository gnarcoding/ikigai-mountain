// Records a narration for every stop on the trail with ElevenLabs.
//
// Reads the stop text straight from app.js, turns each stop into a script
// written for listening, and only calls ElevenLabs for stops whose script,
// voice or settings changed since the last run. Writes audio/<id>.mp3 and
// audio/manifest.json, which the page reads to show its Listen buttons.
//
// Needs ELEVENLABS_API_KEY in the environment (a GitHub Actions secret) and a
// voiceId in narration.config.json. Without either it exits quietly.

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AUDIO_DIR = path.join(ROOT, "audio");
const MANIFEST = path.join(AUDIO_DIR, "manifest.json");

const config = JSON.parse(await readFile(path.join(ROOT, "narration.config.json"), "utf8"));
const apiKey = process.env.ELEVENLABS_API_KEY || "";


// ---------------------------------------------------------------- stop text

const appJs = await readFile(path.join(ROOT, "app.js"), "utf8");
const start = appJs.indexOf("  var TRAILHEADS = {");
const end = appJs.indexOf("  /* Circles, zones and ridges");
if (start < 0 || end < 0) throw new Error("Could not find the stop text in app.js");
const data = new Function(appJs.slice(start, end) + "\nreturn { TRAILHEADS, FACE_STOPS, RIDGE_STOPS, FALSE_SUMMIT, SUMMIT_STOP };")();

// Record in the order a visitor meets the stops on the default trail (the
// page starts on the Love side), so a run that hits the credit budget still
// covers the trail most people walk. The other trailheads come last.
const SIDE_ANGLE = { love: 90, good: 180, needs: 0, paid: 270 };
const sideAt = (deg) => Object.keys(SIDE_ANGLE).reduce((best, k) => {
  const d = Math.abs(((deg - SIDE_ANGLE[k] + 540) % 360) - 180);
  return d < best.d ? { k, d } : best;
}, { k: "love", d: 999 }).k;
const ridgeAt = (deg) => ({ 45: "mission", 135: "passion", 225: "profession" })[((deg % 360) + 360) % 360] || "vocation";

const DEFAULT_START = "love";
const sections = [["trailhead-" + DEFAULT_START, data.TRAILHEADS[DEFAULT_START]]];
const faceVisits = {}, ridgeVisits = {};
for (let k = 1; k <= 24; k++) {
  const deg = SIDE_ANGLE[DEFAULT_START] + k * 45;
  if (k % 2 === 0) {
    const side = sideAt(deg);
    faceVisits[side] = (faceVisits[side] || 0) + 1;
    sections.push([`${side}-${faceVisits[side]}`, data.FACE_STOPS[side][faceVisits[side] - 1]]);
  } else {
    const ridge = ridgeAt(deg);
    ridgeVisits[ridge] = (ridgeVisits[ridge] || 0) + 1;
    sections.push([`${ridge}-${ridgeVisits[ridge]}`, data.RIDGE_STOPS[ridge][ridgeVisits[ridge] - 1]]);
  }
}
sections.push(["false-summit", data.FALSE_SUMMIT], ["summit", data.SUMMIT_STOP]);
for (const key of Object.keys(data.TRAILHEADS)) if (key !== DEFAULT_START) sections.push(["trailhead-" + key, data.TRAILHEADS[key]]);
if (sections.length !== 30 || sections.some(([, d]) => !d)) throw new Error("Stop list doesn't match the trail (expected 30 sections).");

// ---------------------------------------------------------------- scripts

const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const upperFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const clean = (s) => s
  .replace(/生き甲斐,?\s*/g, "")  // the summit's title already says "Ikigai"
  .replace(/[“”]/g, '"')
  .replace(/\s+/g, " ")
  .trim();

function scriptFor(d) {
  const signsLabel = d.signsLabel || "You might be here if";
  const signs = d.signs.map(clean);
  const parts = [
    clean(d.title) + ".",
    upperFirst(clean(d.feels)),
    `${clean(d.voiceLabel || "The voice that keeps you here says")}: "${clean(d.voice)}"`,
    `${signsLabel} ${lowerFirst(signs[0])} ${signs.slice(1).join(" ")}`,
    `${clean(d.throughLabel || "The way through")}. ${clean(d.through)}`,
    `A question to carry up: ${clean(d.question)}`
  ];
  // Paragraph breaks give natural pauses without spending credits on pause tags.
  return parts.join("\n\n");
}

// Preview: node scripts/narrate.mjs --print [id]
if (process.argv.includes("--print")) {
  const only = process.argv[process.argv.indexOf("--print") + 1];
  let total = 0;
  for (const [id, d] of sections) {
    const t = scriptFor(d);
    total += t.length;
    if (!only || only === id) console.log(`=== ${id} (${t.length} characters)\n${t}\n`);
  }
  console.log(`${sections.length} stops, ${total} characters in all.`);
  process.exit(0);
}

if (!config.voiceId) {
  console.log("No voiceId in narration.config.json yet, so there is nothing to record.");
  process.exit(0);
}
if (!apiKey) {
  console.log("ELEVENLABS_API_KEY is not set. Add it as a repository secret to record narration.");
  process.exit(0);
}

// ---------------------------------------------------------------- recording

const settingsKey = JSON.stringify([config.voiceId, config.modelId, config.voiceSettings]);
const hashOf = (text, format) => createHash("sha256").update(settingsKey + "\n" + format + "\n" + text).digest("hex").slice(0, 16);
const kbpsOf = (format) => Number(String(format).split("_")[2]) || 128;

let manifest = { sections: {} };
try { manifest = JSON.parse(await readFile(MANIFEST, "utf8")); } catch { /* first run */ }
manifest.sections = manifest.sections || {};
await mkdir(AUDIO_DIR, { recursive: true });

const FORMATS = [config.outputFormat || "mp3_44100_96", "mp3_44100_128"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function record(text) {
  for (const format of FORMATS) {
    for (let attempt = 1; attempt <= 4; attempt++) {
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(config.voiceId)}?output_format=${format}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
        body: JSON.stringify({ text, model_id: config.modelId, voice_settings: config.voiceSettings })
      });
      if (res.ok) return { audio: Buffer.from(await res.arrayBuffer()), format };
      const detail = (await res.text()).slice(0, 300);
      if (/quota|insufficient|credits|character_limit/i.test(detail)) {
        const err = new Error(`ElevenLabs is out of credits for now (${res.status}).`);
        err.outOfCredits = true;
        throw err;
      }
      if (res.status === 429 || res.status >= 500) { await sleep(2000 * attempt); continue; }
      if ((res.status === 400 || res.status === 422) && /output_format|format/i.test(detail) && format !== FORMATS.at(-1)) break;
      throw new Error(`ElevenLabs answered ${res.status}: ${detail}`);
    }
  }
  throw new Error("ElevenLabs kept failing after retries.");
}

// Never send more than this many characters in one run (1 character ≈ 1 credit).
const budget = Number(config.maxCharactersPerRun) || Infinity;
let recorded = 0, kept = 0, characters = 0, failed = null;
const waiting = [];
for (const [id, d] of sections) {
  const text = scriptFor(d);
  const format = FORMATS[0];
  const hash = hashOf(text, format);
  const file = `${id}.mp3`;
  const prev = manifest.sections[id];
  let exists = false;
  try { exists = (await stat(path.join(AUDIO_DIR, file))).size > 0; } catch { /* missing */ }
  if (prev && prev.hash === hash && exists) { kept++; continue; }
  if (failed || characters + text.length > budget) { waiting.push(`${id} (${text.length})`); continue; }

  console.log(`Recording ${id} (${text.length} characters)…`);
  let result;
  try {
    result = await record(text);
  } catch (err) {
    failed = err;
    console.log(err.message);
    waiting.push(`${id} (${text.length})`);
    continue;
  }
  const { audio, format: used } = result;
  await writeFile(path.join(AUDIO_DIR, file), audio);
  manifest.sections[id] = {
    file,
    hash,
    bytes: audio.length,
    seconds: Math.round((audio.length * 8) / (kbpsOf(used) * 1000) * 10) / 10
  };
  recorded++;
  characters += text.length;
  // Save as we go, so a failure halfway keeps what was already paid for.
  manifest.voice = config.voiceName || config.voiceId;
  manifest.model = config.modelId;
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
}

// Drop entries for stops that no longer exist.
const ids = new Set(sections.map(([id]) => id));
for (const id of Object.keys(manifest.sections)) if (!ids.has(id)) delete manifest.sections[id];
manifest.voice = config.voiceName || config.voiceId;
manifest.model = config.modelId;
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

console.log(`Done: recorded ${recorded} stop(s) (${characters} characters), kept ${kept} unchanged.`);
if (waiting.length) {
  console.log(`Still to record, ${waiting.length} stop(s): ${waiting.join(", ")}`);
  console.log("Run the workflow again once there are credits (for example when the plan renews).");
}
// A real error (not just running out of credits) fails the run, after the
// audio recorded so far has been saved for the commit step.
if (failed && !failed.outOfCredits) process.exit(1);
