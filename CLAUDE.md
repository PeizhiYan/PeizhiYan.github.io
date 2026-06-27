# Project Context

## Progressive Image Loading (blur-up)

**Added:** 2026-06-27

### Overview

Photos on `events.html`, `gallery.html`, and `album.html` use a progressive loading technique: a small blurry thumbnail is shown immediately, then the full-resolution image fades in once loaded. Off-screen images are lazy-loaded via `IntersectionObserver`.

### How it works

Each `<img>` is replaced with a `.progressive-img` wrapper containing two images:

```html
<div class="progressive-img">
  <img class="thumb" src="gallery/thumbs/photo.jpeg" alt="..." />
  <img class="full" data-src="gallery/photo.jpeg" alt="..." />
</div>
```

- **`.thumb`** — 300px-wide JPEG at 60% quality (~15-25 KB). Rendered with `filter: blur(10px)` and slight scale-up to hide pixelation.
- **`.full`** — original full-res image. `data-src` is copied to `src` only when the wrapper scrolls within 200px of the viewport. On load, the `.loaded` class is added, fading it in over the thumbnail.

### Files

| File | Role |
|------|------|
| `assets/js/progressive-img.js` | IntersectionObserver script that triggers full-res loading |
| `assets/css/pages.css` | `.progressive-img`, `.thumb`, `.full`, `.full.loaded` styles (at the bottom) |
| `events/thumbs/` | Thumbnail directory for event photos |
| `gallery/thumbs/` | Thumbnail directory for gallery photos |
| `album/thumbs/` | Thumbnail directory for album photos |

### Adding new photos

When adding a new photo to any of the three pages:

1. **Generate a thumbnail** (macOS):
   ```bash
   sips -Z 300 <dir>/<photo>.jpeg --out <dir>/thumbs/<photo>.jpeg -s formatOptions 60
   ```
2. **Use the progressive wrapper** in HTML instead of a bare `<img>`:
   ```html
   <div class="progressive-img">
     <img class="thumb" src="<dir>/thumbs/<photo>.jpeg" alt="..." />
     <img class="full" data-src="<dir>/<photo>.jpeg" alt="..." />
   </div>
   ```

### Site structure notes

- Shared header/footer are injected by `assets/js/site.js` into `#site-header` and `#site-footer` divs.
- Shared styles: `assets/css/site.css` (layout, header, footer) and `assets/css/pages.css` (cards, grids, progressive images).
- `data-base` attribute on `<body>` sets the path prefix for subpages in subdirectories.

## Image Protection & No-Link Policy

**Added:** 2026-06-27

Photos on `events.html`, `gallery.html`, and `album.html` are **not wrapped in links** (no `<a>` tags) and are protected against casual copying/downloading:

- **CSS transparent overlay** (`::after` pseudo-element on `.progressive-img`) blocks direct interaction with the `<img>` elements.
- **`pointer-events: none`** on the images themselves prevents drag-and-drop.
- **`-webkit-user-drag: none`** and **`user-select: none`** prevent drag-to-desktop and text-selection-based saving.
- **`-webkit-touch-callout: none`** prevents the iOS long-press "Save Image" callout.
- **Right-click disabled** via `contextmenu` event prevention in `progressive-img.js`.

> Note: This deters casual users but cannot prevent determined users (e.g., DevTools, view-source). That is a fundamental browser limitation.

## PhD Thesis Flipbook — Lazy Loading

**Added:** 2026-06-27

### Overview

The PhD thesis flipbook (`docs/ubc_2026_november_yan_peizhi-flipbook.html`) was originally a **46 MB** self-contained HTML file with all 236 page images embedded as base64 data URIs. The browser had to parse all 46 MB before rendering.

It was refactored to:
- Extract 236 page images → `docs/thesis_pages/page_001.jpg` through `page_236.jpg` (~33 MB total)
- Replace the `pages[]` array with file paths instead of inline base64
- Add a `preloadImg()` cache that loads nearby pages (±2 ahead, +4 look-ahead)
- Set thumbnail panel images to `loading="lazy"`

**Result:** HTML reduced from 46 MB → 31 KB. Only the current and nearby pages load.

### Files

| File | Role |
|------|------|
| `docs/ubc_2026_november_yan_peizhi-flipbook.html` | Flipbook viewer (31 KB) |
| `docs/thesis_pages/page_NNN.jpg` | 236 individual page images |

### How lazy loading works

The `setImg()` function sets a page's background image and preloads nearby pages:
- Current page(s) load immediately via `setImg()`
- `preloadImg()` creates `new Image()` objects for pages idx-2 through idx+4 to warm the browser cache
- Thumbnail panel images use native `loading="lazy"` so they only load when scrolled into view
