# The Ikigai Mountain

The homepage of [gnarcoding.com](https://gnarcoding.com): the four circles of ikigai as a 3D mountain, 27 stops along a trail that circles every face three times, and a Trail Journal that places you on it.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | The page: markup and styles |
| `app.js` | The mountain, the trail, the stops and the Trail Journal |
| `vendor/three.min.js` | three.js r128 (MIT), self-hosted |
| `fonts/` | Shippori Mincho and Zen Kaku Gothic New, latin subsets (SIL OFL), self-hosted |
| `favicon.svg`, `apple-touch-icon.png`, `og.png` | Icons and the link preview image |
| `vercel.json` | Security headers and caching for Vercel |

There is no build step. Edit the files and deploy the folder as it is.

## Holographic text

`text-foil.css` gives the title, trail headings and projected mountain labels a
foil finish clipped to the letters. `text-foil.js` moves the light with the mouse
or touch, and with phone tilt on supported HTTPS browsers. On browsers that
require motion permission (including iOS Safari), use **Enable tilt shimmer**.
If permission or sensor data is unavailable, touch-and-drag still works.

Tilt calibrates to the initial holding angle and recalibrates when screen
orientation changes. Reduced-motion preferences keep the foil static; hidden
pages stop sensor updates. No sensor readings are stored or transmitted.

Run the motion/permission regression checks with `node --test tests/text-foil.test.cjs`.
For a device smoke test, open the site over HTTPS on Android Chrome and iOS Safari,
tilt left/right and forward/back, then rotate to landscape. On iOS, also check
permission denial. Dragging the mountain and scrolling should still work normally.

## Privacy

The Trail Journal saves answers and readings in the visitor's own browser (`localStorage`, keys starting with `ikigai-mountain:`). Nothing is sent to a server, and the mountain page loads nothing from third parties: fonts and three.js are served from this site. The Content Security Policy in `vercel.json` enforces that (`default-src 'self'`).

The one exception is `/book`, whose policy also allows Cal.com's embed script and frame (`app.cal.com`, `cal.com`). Card details are entered inside Cal.com's frame and handled by Stripe, never by this site.

## Deployment

The site is the Vercel project **ikigai-mountain** in gnarcoding's projects. Every push to `main` deploys to production automatically, with no build step. The project's own address is ikigai-mountain.vercel.app.

| Domain | Role |
| --- | --- |
| `gnarcoding.com` | Production |
| `www.gnarcoding.com` | 308 permanent redirect to `gnarcoding.com` |

## Booking (`/book`)

`book.html` and `book.js` embed the Cal.com event **cal.com/gnarcoding/60min**: 60 minutes, $100, paid through Stripe before the booking is confirmed, held on Google Meet. To point the page at a different event, change `CAL_LINK` at the top of `book.js` and the fallback link in `book.html`. Price, length, availability and the meeting location live in Cal.com, not in this repo. If you change them there, update the matching text in `book.html`.

The page promises a full refund for cancellations made 24 or more hours ahead. Refunds are not automatic: issue them from the Stripe dashboard.

## Narration (read aloud)

Every stop can be played as audio. `scripts/narrate.mjs` turns each stop's text in `app.js` into a script written for listening and records it with ElevenLabs into `audio/<stop>.mp3`. It also writes `audio/manifest.json`, which the page reads to show its Listen buttons. Until that file exists, the page shows no audio controls.

The GitHub Actions workflow `.github/workflows/narrate.yml` runs the script whenever `app.js`, `narration.config.json` or the script changes on `main`, and you can also start it from the Actions tab. It records only stops whose script, voice or settings changed, so a re-run costs nothing when nothing changed. It then commits the audio, and Vercel deploys that commit.

- **API key:** the repository secret `ELEVENLABS_API_KEY`. It never appears in the code.
- **Intro:** the intro has a hand-written listening script in `narration/intro.txt`, recorded before the stops. Edit that file to change what's read there.
- **Voice and settings:** `narration.config.json` (`voiceId`, `modelId`, `voiceSettings`). Changing the voice re-records every stop.
- **Budget:** `maxCharactersPerRun` caps what one run can spend (1 character is about 1 credit). Stops are recorded in the order visitors meet them on the default Love-side trail, then the other three trailheads. Whatever doesn't fit, or hits ElevenLabs' credit limit, waits for the next run; start one from the Actions tab once credits renew.
- **Skipped sections:** ids listed under `skip` in `narration.config.json` are never recorded. The trailheads for the Good-at, World-needs and Paid-for starting sides are skipped for now; remove them from the list to record them (about 2,800 credits).
- **Preview the scripts without spending credits:** `node scripts/narrate.mjs --print`, or `--print love-2` for one stop.

## DNS at Namecheap

These are the host records for gnarcoding.com (Domain List → gnarcoding.com → Advanced DNS), as set up for Vercel on November 15, 2026.

| Type | Host | Value | Purpose |
| --- | --- | --- | --- |
| A | `@` | `216.198.79.1` | Vercel |
| CNAME | `www` | `92dae6e8f1fe873d.vercel-dns-017.com.` | Vercel |
| TXT | `@` | `v=spf1 include:zohomail.com ~all` | Zoho mail (SPF) |
| TXT | `zoho._domainkey` | Zoho DKIM key | Zoho mail (DKIM) |
| MX | `@` | `mx.zoho.com` (10), `mx2.zoho.com` (20), `mx3.zoho.com` (10) | Zoho mail |

Leave the Zoho records as they are, or email to gnarcoding.com stops working. If Vercel ever asks for different values, its project Settings → Domains page shows the current ones.

Before this change, `@` was a Namecheap URL redirect to `http://www.gnarcoding.com/` and `www` was a CNAME to `parkingpage.namecheap.com.` (the parking page).

## The First Ascent game (/play)

A mobile-friendly action adventure spans all 27 authored stops, from Base Camp
to Ikigai. Play them sequentially in the full ascent, or enter any chapter from
the trail map or its reading page. Every chapter keeps its original writing,
reflection question and narration. The reading experience remains independent.

Choose Ember (balanced), Reed (fast), Flint (six hearts), or Wren (longer reach).
Each has a distinct appearance and real movement/combat stats. Change characters
from the pause menu without losing objectives or completion history.

The six environments are forests, blue stone ruins, lantern wetlands, copper
canyons, violet ridgelands and cloud gardens. Chapters use different terrace
layouts, enemy mixes and five objective types: collect sparks, rescue spirits,
strike ordered runes, defeat armored wardens and awaken shrines. Guardians
telegraph charges, volleys or ground strikes; the final guardian combines them.
Complete each objective to open the upper gate, defeat the guardian, then light
the beacon. The final chapter brings together all four faces of the mountain.

- Keyboard: WASD/arrows move, Space/J strikes, Shift/K dashes, Escape pauses.
- Touch: left thumbstick, right strike and dash buttons; portrait and landscape.
- Browser saves include the selected climber, current chapter, campaign/single
  mode, per-level objectives, position/hearts, living enemy state, checkpoints,
  elapsed time, deaths, completion history and best times. Continue resumes the
  saved chapter. Replaying never removes a previously earned completion badge.
- Saves use localStorage key `ikigai-mountain:game:journey:v2`. Existing Base Camp
  v1 progress migrates without deleting the old key. Invalid v2 JSON is retained
  under `:recovery`. Storage failures show an honest session-only notice. Saves
  are specific to a browser/device/origin, without an account or cloud sync.
- Saving happens on meaningful events, every two seconds while playing, on
  pause, page hide and chapter changes. Newer saves in other chapters from
  another tab are merged. A fallen player resumes safely at their checkpoint.
- Dialogs pause gameplay. The field guide offers all 27 chapters and narration;
  closing it stops audio. Hiding the page pauses the game. Audio starts only after a user interaction; music and effects can be muted independently.
- Art is drawn locally with Canvas2D. There are no external game dependencies,
  new services or accounts. Reduced-motion preferences and safe-area insets are
  respected; DOM menus remain keyboard accessible.

`game/levels.mjs` defines the chapters and heroes; `game/engine.mjs` is the pure
simulation; `game/progress.mjs` handles saves and migration; `game/art.mjs` draws
terrain/sprites; `game/main.mjs` connects input, menus, narration and persistence.
The chapter catalogue is generated directly from the authored story in app.js:
run `node scripts/build-game-data.mjs` after changing that content.

Checks: `node --test tests/game.test.mjs tests/audio.test.mjs tests/text-foil.test.cjs`,
`node scripts/build-game-data.mjs --check`, and JavaScript syntax checks.
The tests exercise all chapters with ordinary movement and combat, objective
rules, collision, guardians, character stats, saves, migration and replay.


### Music, holographic lettering and visual effects

Every chapter has an original 16-bar composition in `game/score.mjs`, with a
chapter-specific title, key, melody, tempo and arrangement. `game/audio.mjs`
synthesizes plucked tones, bells/glass, pads, bass and percussion locally using
Web Audio. A separate guardian layer joins the current phrase during battle.
Sword swishes, impacts, dashes, footsteps, pickups, healing, gate unlocks,
guardian warnings and victory/failure cues use independent effect envelopes.
There are no streamed tracks, licensed samples or additional dependencies.

The Audio button opens Light & sound settings. Music/effects have independent
mute switches and volumes, remembered under `ikigai-mountain:audio:v1`.
The audio context is created only after an interaction. Menus duck the music;
narration mutes it; hidden pages suspend it and stop the scheduler. A compressor,
limited voice count and per-effect rate limits control overlapping combat audio.
The scheduler drops stale backlogs after browser throttling and fades old
chapter voices when switching levels.

Game titles, chapter names, player names and objectives use the existing
text-only foil shader and pointer/phone-tilt controller. Permission-based iOS
tilt remains behind the Enable tilt shimmer button in Light & sound. Mouse and
touch remain fallbacks; reduced-motion and forced-color modes keep text legible.

`game/scenery.mjs` caches carved terrain, path stones, cliff facets and vegetation.
The renderer adds cached canopy sprites with viewport culling, water ripples,
fireflies/dust/snow, light shafts and mist, shrine light, guardian courts,
sword arcs, dash afterimages, projectile trails and impact rings. Decorative
screen shake is bounded and is disabled with reduced motion or the Cinematic
effects setting. Cosmetic art does not change collisions or saved gameplay.

Browser checks can be run from `/tests/av-preview.html` in a local static preview.
It renders isolated scenes for all six environments and measures per-frame draw
cost; its audio check renders the actual Web Audio graph for all 27 scores with
combat effects, verifies finite/non-silent output and checks for clipping. It
never reads or writes player progress. Automated audio tests cover deterministic
scores, settings, context lifetime, ducking, hiding, scheduling, guardian layers,
chapter transitions, effect limits and audio-node cleanup.
