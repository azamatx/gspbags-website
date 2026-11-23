# GSP Bags website

Static multilingual manufacturer website for Great Soatobod Production LLC and its GSP Bags product brand.

## Technology

- Semantic HTML5
- CSS3
- Vanilla JavaScript
- Local SVG assets
- GitHub Pages

No package manager, build process, framework or remote runtime dependency is required.

## Structure

    /
    ├── index.html                 # Uzbek (default)
    ├── ru/index.html              # Russian
    ├── en/index.html              # English
    ├── assets/
    │   ├── css/style.css
    │   ├── js/main.js
    │   ├── js/translations.js
    │   ├── images/
    │   └── icons/
    ├── CNAME
    ├── robots.txt
    ├── sitemap.xml
    └── site.webmanifest

## Languages

Every language has a complete, crawlable HTML document that works without JavaScript:

- Uzbek: /
- Russian: /ru/
- English: /en/

Client-side language switching uses assets/js/translations.js, updates metadata and the URL with the History API, and stores the selected language locally when available. Keep the visible copy in all three HTML files synchronized with the translation dictionary.

## Local development

From the repository root, run:

    python3 -m http.server 8000

Open http://localhost:8000/. Use a local server rather than opening the HTML file directly so root-relative asset paths work correctly.

## Content and images

Product copy and specifications are maintained in each language page and in assets/js/translations.js. Only publish confirmed product information.

Original product photography is stored as optimized WebP files in assets/images/. Responsive variants use a numeric width suffix, such as hero-onion-bags-800.webp and application-onions-480.webp.

When replacing photography, preserve the established aspect ratios, responsive sources, explicit dimensions and translated alternative text. Rebuild og-gspbags.webp at exactly 1200 × 630 pixels when the social preview changes.

## Deployment

GitHub Pages serves the main branch at https://gspbags.uz/. The root CNAME file preserves the custom domain. No separate build or deployment command is required.
