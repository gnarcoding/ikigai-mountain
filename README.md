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

A separate, mobile-friendly action adventure starts at the Love-side Base Camp.
The first chapter has three forest terraces, collectible Curiosity/Play/Courage
sparks, moss slimes, ranged wisps, charging thornlings and a telegraphed guardian
fight. Collect all three sparks to open the upper gate; defeat the Doubtkeeper
and reach the beacon to finish. The other 26 chapters are clearly marked as
future game levels, with their existing story and narration available now.

- Desktop: WASD/arrows to move, Space/J to strike, Shift/K to dash, Escape to pause.
- Phone: hold/drag the thumbstick and hold Strike; Dash grants brief protection.
  Pointer capture supports simultaneous thumbs and cancels on interrupted input.
- Every spark and enemy defeat is saved locally. The upper gate is a checkpoint.
  Retrying restores hearts and preserves earned sparks. Saves use only the
  ikigai-mountain:game:base-camp:v1 key and tolerate unavailable storage.
- The field guide pauses combat and plays the existing self-hosted narration.
  Closing it pauses audio. Hiding the page pauses the game. Optional game sounds
  are synthesized locally and start only after the sound button is pressed.
- Canvas 2D artwork is original and generated locally; no WebGL, libraries,
  external assets, accounts or network services are required for gameplay.
  Reduced motion removes ambient drift, bobbing and hit blinking. Combat still
  requires visual and motor interaction; the entire reading trail remains
  available independently.

game/engine.mjs is the pure simulation, game/art.mjs draws the world and
game/main.mjs connects input, menus, narration and saves. The chapter catalogue
is generated from the existing authored stops by
node scripts/build-game-data.mjs; run this when changing story content.

Checks: node --test tests/game.test.mjs tests/text-foil.test.cjs,
node scripts/build-game-data.mjs --check, and JavaScript syntax checks.
The game tests include an entire successful climb using normal movement and
combat, terrain/dash collision, death/retry, guardian timing and save validation.
For local static serving without Vercel's clean URLs, open /play.html.
