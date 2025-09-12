# MONSTEREYE100 - Static Site for GitHub Pages

This repo contains a simple static site with a contact form that forwards messages to Discord via a Netlify Function (recommended for security).

## Contents
- `index.html` - Landing page linking to contact page.
- `contact.html` - Contact form page (posts to `/.netlify/functions/discord-webhook`).
- `netlify/functions/discord-webhook.js` - Netlify Function that forwards to Discord (keep webhook secret).
- `netlify.toml` - Netlify config to point to the functions folder.
- `CNAME` - (optional) add your custom domain here before deploying to GitHub Pages.

## Option A — GitHub Pages (static) + Netlify Function for form
1. Create a GitHub repo (e.g. `monstereye100-site`) and push these files to `main`.
2. In the repo root, create a `CNAME` file containing `monstereye100.com` if you plan to use the domain.
3. In the repository settings → Pages, enable `gh-pages` or `main` branch (root) as the Pages source.
4. GitHub Pages will host `index.html` and `contact.html` (static). However, Pages **cannot** run serverless functions — so you must deploy the Netlify Function separately (Option B) and point the form to the deployed function URL, or host the entire site on Netlify (Option C).

## Option B — Deploy Netlify Function and keep site on GitHub Pages
1. Deploy the same repo to Netlify (connect GitHub repo in Netlify dashboard).
2. In Netlify site settings → Environment, add `DISCORD_WEBHOOK_URL` = `https://discord.com/api/webhooks/xxx/yyy`.
3. Netlify will build and deploy functions from `netlify/functions`. The contact form (on GitHub Pages) can POST to the Netlify-provided function URL (`https://<your-netlify-site>.netlify.app/.netlify/functions/discord-webhook`).
4. Update `contact.html` fetch target if necessary.

## Option C — Host everything on Netlify (simplest for form)
1. Drag-and-drop the site folder into Netlify's deploy panel or connect GitHub repo to Netlify.
2. Add the env var `DISCORD_WEBHOOK_URL` in Netlify settings.
3. The form will POST to `/.netlify/functions/discord-webhook` and work securely.

## Direct webhook (not recommended)
You can modify `contact.html` to POST directly to a Discord webhook, but that exposes the webhook URL to anyone who inspects your site and can lead to abuse.

---

If you want, I can:
- Create the GitHub repository for you (I cannot access your GitHub account automatically — you'll need to create it or provide a token). I can provide the exact `git` commands to run.
- Deploy the Netlify Function for you (you'll need to connect Netlify to your GitHub account).

