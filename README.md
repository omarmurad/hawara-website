# Hawara Advanced Contracting Co. — Website

A bilingual (English/Arabic) website built from the company's 2025 profile:
overview, mission, owner's welcome message, 11 services, org chart,
classification/membership certificates, all 50 projects (searchable &
sortable), 44 client logos, and a contact section.

Plain HTML/CSS/JS — no build step, no framework, no server required.

## Preview locally

Open `index.html` directly in a browser, or serve it (recommended, avoids
any local file-permission quirks):

```
cd hawara-site
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Files

```
index.html          the whole site (one page, all sections)
css/styles.css       all styling, brand colors and layout
js/i18n.js           English + Arabic copy (edit text here)
js/projects.js       all 50 projects (edit/add projects here)
js/main.js           language toggle, table search/sort, animations
assets/img/          logo, photos, certificates, client logos
```

To edit copy: open `js/i18n.js` — every piece of text on the site has an
`en` and `ar` entry with the same key.

To edit the project list: open `js/projects.js` — it's a plain array,
copy a line and change the values.

## Connect it to your Namecheap domain

This is a static site, so any static host works. Two easy free options:

### Option A — Netlify (fastest, drag-and-drop)
1. Go to https://app.netlify.com/drop
2. Drag the whole `hawara-site` folder onto the page — it goes live
   immediately on a netlify.app URL.
3. In Netlify: **Site settings → Domain management → Add a domain**,
   enter your Namecheap domain.
4. Netlify will show you DNS records to add. In Namecheap:
   **Domain List → Manage → Advanced DNS**, add the records Netlify gives
   you (usually an A record for the root domain and a CNAME for `www`).
5. Wait for DNS to propagate (can take a few minutes to a few hours).
   Netlify issues a free SSL certificate automatically.

### Option B — GitHub Pages (free, good if you already use GitHub)
1. Create a new GitHub repository and push the contents of `hawara-site`
   to it.
2. In the repo: **Settings → Pages → Deploy from a branch**, pick `main`
   and `/ (root)`.
3. In the repo, add a file named `CNAME` (no extension) containing just
   your domain, e.g. `www.hawariacc.com`.
4. In Namecheap → **Advanced DNS**, add:
   - a `CNAME` record for `www` pointing to `yourusername.github.io`
   - four `A` records for the root domain pointing to GitHub's IPs
     (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
5. GitHub Pages issues free SSL automatically once DNS resolves.

Either way, once DNS points at the host, your Namecheap domain will show
this site with HTTPS — no code changes needed.

## Notes
- The contact form is static (no backend) — it currently just shows a
  message asking people to email/call directly. Wiring it to a real inbox
  (e.g. via Formspree, Netlify Forms, or a small backend) is a quick
  follow-up if you want actual form submissions.
- All copy in `js/i18n.js` is taken directly from the company's own
  profile document (bilingual as provided).
