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
