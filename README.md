# Red Junk Removal - Coming Soon

Static coming-soon page for Red Junk Removal (redjunkremoval.com), serving Greater Victoria, BC.

## Overview

This is a simple, fast, accessible static site announcing the upcoming launch of Red Junk Removal. The page features:

- **No build step**: Plain HTML and CSS
- **Fast loading**: Optimized fonts with preconnect, display=swap
- **Mobile-friendly**: Responsive design tested at 375px, 768px, and 1280px
- **Accessible**: Semantic HTML5 landmarks, proper labels, visible focus styles, correct input modes

## Structure

- `index.html` - Main page with semantic HTML
- `styles.css` - All styles extracted from inline to classes
- `vercel.json` - Clean URLs configuration

## Design

The design maintains the original Claude Design aesthetic with:
- Archivo and Archivo Black fonts from Google Fonts
- Brand colors: Red (#CC2018), Cream (#F7F1E3), Black (#15120E)
- Bold, uppercase headings with high contrast
- Cards with solid borders and drop shadows

## Placeholders

The following placeholders are present and need to be replaced when launch details are finalized:
- `[month]` - Launch month
- `[email]` - Contact email address
- `[phone]` - Contact phone number

The signup form button is currently non-functional (no backend connected).

## Deployment

The site is deployed via Vercel (project: red-junk-removal-site). Any push to a branch creates a preview deployment.

## Local Development

No build step required. Simply open `index.html` in a browser or use a local server:

```bash
npx serve
```

## License

© Red Junk Removal - All rights reserved
