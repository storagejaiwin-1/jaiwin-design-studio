# Jaiwin Design Studio Website

Premium static portfolio website for Jaiwin Design Studio with a free Decap CMS admin dashboard, Netlify Identity login, Netlify Git Gateway editing, Netlify Forms contact form, and no build step.

This project was custom-built for Jaiwin Design Studio. The linked reference repository was used only for broad inspiration around premium 3D portfolio pacing, GSAP-style motion, and cinematic section rhythm. The code and assets in this folder are original static HTML, CSS, JavaScript, JSON, and SVG files.

## Folder Structure

```text
project-root/
  index.html
  style.css
  main.js
  _headers
  netlify.toml
  README.md
  admin/
    index.html
    config.yml
    preview.css
    preview.js
  content/
    site-settings.json
    landing.json
    services.json
    portfolio.json
    about.json
    contact.json
    process.json
    homepage-sections.json
  assets/
    uploads/
      .gitkeep
    images/
      placeholder-portfolio-1.svg
      placeholder-portfolio-2.svg
      placeholder-portfolio-3.svg
      hero-fallback.svg
    icons/
      .gitkeep
```

## What Is Editable From Admin

- Business name and logo text
- Logo mark text, loader text, navigation links, navigation button label, and footer credit text
- Phone, WhatsApp, email, Instagram, location, and full address
- SEO title and SEO description
- Background, surface, text, muted text, primary, secondary, and highlight colors
- Homepage hero headline, subheadline, button labels, and fallback image
- Hero fallback image alt text and the floating hero information card
- About section visibility, section label, text, image, image alt text, and stats
- Services section visibility, section label, badge label, and service cards
- Portfolio section visibility, section label, CTA, badge label, video label, image upload, optional video upload, optional external video URL, category, featured toggle, and alt text
- Regular work posts with optional posted date, newest-first adding, image upload, category, featured toggle, and live preview styling
- Why choose us section visibility, section label, and cards
- Process section visibility, section label, and steps
- Contact section visibility, section label, CTA labels, map link, hours, full form labels/options/placeholders, submit label, and form message

## Free-Cost Stack

- GitHub repository for source code and JSON content
- Netlify free hosting
- Netlify automatic HTTPS/SSL
- Free Netlify subdomain
- Netlify Forms for contact messages
- Netlify Identity for admin login
- Netlify Git Gateway for CMS edits
- Decap CMS for the visual admin dashboard
- Local live edit mode for editing directly on the website preview
- No paid CMS
- No paid hosting
- No paid database
- No paid API keys
- No backend server
- No Node.js, npm, or build step required

## Deploy To GitHub

1. Create a new GitHub repository.
2. Add every file and folder from this project root into the repository.
3. Commit the files.
4. Push the repository to the `main` branch.

## Deploy To Netlify

1. Create or sign in to a Netlify account.
2. Choose "Add new site" and then "Import an existing project".
3. Connect your GitHub account.
4. Select the GitHub repository for this website.
5. Netlify will read `netlify.toml`; the build command is blank and the publish directory is the repository root.
6. If Netlify asks for a publish directory manually, enter `.`.
7. Deploy the site.
8. Netlify will provide a free subdomain such as `your-site-name.netlify.app`.
9. HTTPS/SSL is enabled automatically by Netlify.

## Enable The Admin Dashboard

1. In Netlify, open the deployed site settings.
2. Go to Identity and enable Netlify Identity.
3. Set registration to "Invite only". This keeps the admin private.
4. Go to Identity settings and enable Git Gateway.
5. Invite the client/admin email address.
6. The invited user accepts the email invitation and sets a password.
7. Visit `/admin` on the live site.
8. Log in with the invited Netlify Identity account.
9. Edit content in Decap CMS.
10. Press Publish.
11. Decap CMS commits the JSON or uploaded media changes to GitHub through Git Gateway.
12. Netlify automatically redeploys the site after the CMS change is committed.

## Post New Work Regularly

1. Visit `/admin` on the live Netlify site.
2. Open "Post Work / Portfolio".
3. Open "Work Posts".
4. Click "Add Item".
5. Add the title, short description, category, optional posted date, image, featured setting, and alt text.
6. Check the live-looking preview panel.
7. Press Publish.

New items are configured to be added at the top so recent work stays visible first.

## Edit Common Content

### Update phone, WhatsApp, Instagram, email, or address

1. Go to `/admin`.
2. Open "Site Settings".
3. Edit the phone, WhatsApp number, email, Instagram handle, Instagram URL, location, or full address.
4. Publish.

### Edit homepage text

1. Go to `/admin`.
2. Open "Landing Page".
3. Edit the hero eyebrow, headline, highlighted word, subheadline, and CTA labels.
4. Publish.

### Add a new service

1. Go to `/admin`.
2. Open "Services".
3. Add an item in the services list.
4. Enter the service name, short description, icon name, and featured setting.
5. Drag to reorder if needed.
6. Publish.

### Add a portfolio image

1. Go to `/admin`.
2. Open "Portfolio".
3. Add a new portfolio item.
4. Enter title, description, category, image, optional video, featured toggle, and alt text.
5. Publish.

### Replace placeholder images

1. Go to `/admin`.
2. Open "Portfolio" or "Landing Page".
3. Click the image field.
4. Upload a real design image.
5. Publish.

Uploaded media is saved in:

```text
assets/uploads/
```

Keep `assets/uploads/.gitkeep` in the repository. It makes sure Netlify and Git Gateway keep the upload folder available even before the first real image is uploaded.

## If Image Upload Shows An Error

Image uploads require all three pieces to be active on the live site:

- The site source must be in a GitHub repository on the `main` branch.
- Netlify must be connected to that GitHub repository.
- Netlify Identity and Git Gateway must both be enabled for the deployed site.

This project already includes the correct upload folder and CMS media paths:

```text
media_folder: assets/uploads
public_folder: /assets/uploads
```

If uploads still fail after deployment, open Netlify Identity settings and confirm Git Gateway is enabled for the same GitHub repository and branch.

## Contact Form

The form in `index.html` uses Netlify Forms:

- `data-netlify="true"`
- `netlify-honeypot="bot-field"`
- hidden `form-name` field

After deployment, contact messages appear in the Netlify dashboard under Forms. No paid API key is required.

## Google Maps

The site uses a normal Google Maps search link. It does not use the Google Maps JavaScript API and does not require a paid API key.

## Custom Domain Note

A real custom domain may not be free. To keep this website fully free of cost, use the free Netlify subdomain.

If the client already owns a domain or later buys one:

1. In Netlify, open Site settings.
2. Go to Domain management.
3. Add the custom domain.
4. Follow Netlify's DNS instructions.
5. Wait for DNS to update.
6. Netlify will provide HTTPS/SSL for the connected domain.

## Local Preview

Because the website fetches JSON files from the `content` folder, preview it through a small local server instead of opening `index.html` directly from the file system.

Use this project command:

```bash
npm run preview
```

Then open:

```text
http://127.0.0.1:8088
```

## Owner Live Editor

For direct editing on the website itself, open the owner editor:

```text
http://127.0.0.1:8088/admin/editor
```

The normal public website does not show edit buttons. Editing controls appear only inside `/admin/editor` after the owner login.

In the Owner Live Editor:

- Click visible website text and type directly on the page.
- Use "Add work" to add a new portfolio/work post at the top.
- Use "Upload category images" to choose Sports Banner, Invitation, Logo Design, Shop Banner, or another category and upload one or more images into that category.
- Click an image, then use "Upload image" to save a new image into `assets/uploads`.
- Use the red image buttons to delete an uploaded image or delete a whole work card.
- Use the color controls to change the website colors.
- Text and image changes save into the project folder.
- Click "Save + publish" to commit, push to GitHub, and trigger Netlify.

This mode is local-first. It edits your project files directly on your computer and does not ask the browser for folder permission.

For phone editing on the same Wi-Fi, start `npm run preview` on this computer and open:

```text
http://192.168.1.11:8088/admin/editor
```

If the Wi-Fi address changes, use the current IPv4 address of this computer.

### Owner Login For Live Edit Mode

The local editor is protected with an email and password. Keep the real values in `.env` on your computer:

```text
EDITOR_EMAIL=your-email@example.com
EDITOR_PASSWORD=your-password
```

The `.env` file is ignored by Git and must not be uploaded to GitHub. Use `.env.example` only as a safe template.

For phone editing on the same Wi-Fi, start `npm run preview` on this computer and open the computer's local network address with `/admin/editor` on your phone. The same owner login screen will appear before editing controls are shown.

## Local Admin Uploads

The `/admin` CMS also supports local saving because this project has `local_backend: true`.

Before using `/admin` locally, run the local CMS helper:

```bash
npm run cms
```

Keep the website preview server running separately. The CMS helper listens on port `8081`; the website preview in this project is currently running on port `8088`.

## Notes For Safe Editing

- Keep JSON files valid. Decap CMS handles this automatically.
- Do not rename the known JSON files unless `main.js` and `admin/config.yml` are updated too.
- Keep image paths starting with `/assets/uploads/` or `/assets/images/`.
- Use invite-only Identity registration for the admin dashboard.
- Do not add secret keys to this repository.

## QA Checklist

- JSON content files are valid.
- Decap CMS config uses `git-gateway` and `main`.
- Portfolio renders from `content/portfolio.json`.
- Services render from `content/services.json`.
- Landing text renders from `content/landing.json`.
- Contact details render from CMS content.
- Animations initialize after dynamic content is rendered.
- Mobile menu works.
- Contact form includes Netlify attributes and honeypot.
- WhatsApp links use Indian country code format: `919597551805`.
- Instagram link is valid.
- WebGL-style portfolio effects are disabled on mobile and low-power conditions.
- Custom cursor is disabled on touch devices.
- Reduced motion preferences are respected.
- The site still works if animation CDNs fail.
- The site is ready for direct deployment to Netlify.
