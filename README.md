# HAI website (www.haitech.ltd)

This repository is the live website. Every change saved here (a "commit") is
published automatically by GitHub Pages within 1-2 minutes.

## Change the website settings

All the settings are in **`content/site.json`**:

1. Open `content/site.json` and click the pencil icon (Edit).
2. Change what you need (see below).
3. Click **Commit changes...**, then **Commit changes** again.
4. Wait 1-2 minutes and refresh www.haitech.ltd (Ctrl+F5 on a computer).

| Setting | What it does |
|---|---|
| `whatsapp_number` | Number used by the "Chat with us" button (with country code). Empty = button hidden. |
| `whatsapp_message` | Text already typed when someone opens the chat. |
| `web3forms_key` | Key that sends the "Request a demo" form to info@haitech.ltd. |
| `show_clients` | `true` shows the "Trusted by businesses" section, `false` hides it. |
| `clients` | The client logos (see below). |
| `show_testimonials` | `true` shows the testimonials section, `false` hides it. |
| `testimonials` | The testimonials, text or video (see below). |

Keep the quotes `"` and commas `,` exactly as in the examples. Text values are in
quotes, `true`/`false` are not.

## Add a client logo

1. Go to the `assets` folder > **Add file** > **Upload files**, upload the logo
   (PNG with transparent background, about 300 px wide), commit.
2. In `content/site.json`, add it to `clients`, and set `show_clients` to `true`:

```json
"show_clients": true,
"clients": [
  { "name": "Company name", "logo": "assets/company-logo.png", "url": "https://company-website.com" }
],
```

Several logos: separate them with a comma: `[ {...}, {...} ]`.

## Add a testimonial

Text:

```json
"show_testimonials": true,
"testimonials": [
  { "quote": "What the client says, in their own words.", "name": "Client name", "role": "Role", "company": "Company" }
],
```

Video: upload the `.mp4` (and a `.jpg` cover image) to `assets`, then:

```json
{ "video": "assets/client-video.mp4", "poster": "assets/client-video.jpg", "name": "Client name", "role": "Role", "company": "Company" }
```

Only publish testimonials and logos that the client agreed to share.

## Do not change

- `CNAME`: connects this site to www.haitech.ltd.
- `.nojekyll`, `robots.txt`, `sitemap.xml`, `404.html`.
