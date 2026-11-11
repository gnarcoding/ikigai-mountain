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

The Trail Journal saves answers and readings in the visitor's own browser (`localStorage`, keys starting with `ikigai-mountain:`). Nothing is sent to a server, and the page loads nothing from third parties: fonts and three.js are served from this site. The Content Security Policy in `vercel.json` enforces that (`default-src 'self'`).

## Deploy on Vercel

**From GitHub (recommended).** In Vercel, choose Add New → Project, import this repository, leave Framework Preset as "Other" with no build command, and deploy. Every push to `main` then deploys automatically.

**From the command line.** In this folder, run `npx vercel` once to link it, then `npx vercel --prod`.

## Point gnarcoding.com at Vercel

1. In the Vercel project, go to Settings → Domains and add `gnarcoding.com` and `www.gnarcoding.com`. Vercel shows the exact DNS records it wants.
2. In Namecheap, open Domain List → gnarcoding.com → Advanced DNS.
3. Delete the parking records: the `@` record that points at Namecheap's parking or redirect address, and the `www` CNAME to `parkingpage.namecheap.com`.
4. Add the records Vercel showed. They are usually an `A` record for `@` pointing to `76.76.21.21` and a `CNAME` for `www` pointing to `cname.vercel-dns.com`.
5. Leave the Zoho mail records (`MX` and the `TXT` SPF record) as they are, or email stops working.

Vercel issues the HTTPS certificate once DNS has updated, usually within an hour.
