# Taskasaur Website

The public homepage for [Taskasaur](https://taskasaur.net), a local-first app for bringing tasks, time tracking, and focus into one CSDB-backed workspace.

The site is a dependency-free static homepage:

- `index.html` contains the page structure and content.
- `styles.css` contains the responsive visual design and animations.
- `script.js` contains the interactive product graphics and dinosaur game.
- Image assets live alongside the page files.

## Local preview

From the repository root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

GitHub Pages serves the `main` branch from the repository root. The committed `CNAME` file connects the site to `taskasaur.net`.
