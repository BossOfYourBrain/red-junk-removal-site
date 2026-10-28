# Red Junk Removal - Coming Soon

Static coming-soon page for Red Junk Removal (redremoval.com), serving Greater Victoria, BC.

## Overview

This is a simple, fast, accessible site announcing the upcoming launch of Red Junk Removal in November 2026. The page features:

- **No build step**: Plain HTML, CSS, and vanilla JavaScript
- **Fast loading**: Optimized fonts with preconnect, display=swap
- **Mobile-friendly**: Responsive design tested at 375px, 768px, and 1280px
- **Accessible**: Semantic HTML5 landmarks, proper labels, visible focus styles, ARIA live regions, correct input modes
- **Working form**: Feedback form with validation and serverless submission
- **Interactive elements**: Collapsible feature cards with smooth animations

## Structure

- `index.html` - Main page with semantic HTML and working form
- `styles.css` - All styles with responsive breakpoints
- `form.js` - Progressive enhancement for form submission (vanilla JS)
- `api/submit.js` - Vercel serverless function for form handling
- `vercel.json` - Clean URLs configuration

## Design

The design maintains Red Junk Removal's brand identity with:
- Archivo and Archivo Black fonts from Google Fonts
- Brand colors: Red (#CC2018), Cream (#F7F1E3), Black (#15120E)
- Bold, uppercase headings with high contrast
- Cards with solid borders and drop shadows
- Animated vehicles and text message thread
- Collapsible details cards

## Form Submission

The "Have your say" form collects customer feedback about previous junk removal experiences.

### Form Fields

- **gripes** (optional): Multiple checkboxes with values: `price_changed`, `landfill`, `waited`, `wouldnt_take`
- **story** (optional): Textarea, max 2000 characters
- **email** (optional): Valid email address
- **postal_code** (required): Valid Canadian postal code (e.g., V8T 2P9)
- **website** (honeypot): Hidden field for spam detection

### Environment Variables

The serverless function requires the following environment variables to be set in Vercel:

#### Required

- **`GROK_WEBHOOK_URL`** (required): The webhook endpoint URL where form submissions are forwarded. If not set, the API returns a 503 error.

#### Optional

- **`GROK_WEBHOOK_SECRET`** (optional): Bearer token sent as `Authorization: Bearer <secret>` header with webhook requests. If not set, no authorization header is sent.

### Webhook Payload

When a form is submitted, the following JSON payload is sent to `GROK_WEBHOOK_URL`:

```json
{
  "gripes": ["price_changed", "waited"],
  "story": "They quoted $200 on the phone and asked for $380 once the couch was on the truck.",
  "email": "customer@example.com",
  "postal_code": "V8T 2P9",
  "submitted_at": "2026-10-28T06:00:00.000Z",
  "page": "coming-soon",
  "user_agent": "Mozilla/5.0..."
}
```

**Payload Fields:**
- `gripes`: Array of selected gripe values (empty array if none selected)
- `story`: Customer's story in their own words (empty string if not provided)
- `email`: Customer's email (empty string if not provided)
- `postal_code`: Customer's postal code (always present, validated)
- `submitted_at`: ISO 8601 timestamp of submission
- `page`: Always `"coming-soon"` for this form
- `user_agent`: Browser user agent string

### Progressive Enhancement

- **With JavaScript**: Form submits via `fetch`, shows success/error messages inline, doesn't reload the page
- **Without JavaScript**: Form submits traditionally to `/api/submit`, redirects to `/?sent=1` on success

### Validation

- Postal code must match Canadian format (e.g., `V8T 2P9` or `V8T2P9`)
- Email must be valid format if provided
- Story limited to 2000 characters
- Gripes must be from the four allowed values
- Honeypot field drops spam submissions silently

## Deployment

The site is deployed via Vercel (project: red-junk-removal-site). Any push to a branch creates a preview deployment.

### Setting Environment Variables

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `GROK_WEBHOOK_URL` (required)
3. Add `GROK_WEBHOOK_SECRET` (optional)
4. Redeploy for changes to take effect

## Local Development

No build step required. Simply open `index.html` in a browser or use a local server:

```bash
npx serve
```

For local serverless function testing:
```bash
vercel dev
```

## Browser Support

Modern browsers with CSS Grid, Flexbox, and ES6+ support. Gracefully degrades for older browsers.

## License

© Red Junk Removal - All rights reserved
