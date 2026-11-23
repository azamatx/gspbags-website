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

The current artwork in assets/images/mesh-bag.svg is an intentional placeholder. Place final optimized product images in assets/images/, update the corresponding image elements in all language pages, and retain explicit dimensions and useful translated alternative text.

## Deployment

GitHub Pages serves the main branch at https://gspbags.uz/. The root CNAME file preserves the custom domain. No separate build or deployment command is required.
