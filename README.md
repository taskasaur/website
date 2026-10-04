# Taskasaur website

The public homepage for [Taskasaur](https://taskasaur.net): an offline workspace with independent devices, approved peer synchronization, portable `.taskasaur` files, and installable plugins.

This is a dependency-free static site. `index.html` contains the content, `styles.css` the responsive layout, `script.js` the existing product animations and dinosaur game, and `releases.js` the download discovery. Images are local assets.

## Preview

Serve the repository with any static HTTP server, for example `python3 -m http.server 8081`, then open `http://localhost:8081`.

## Releases

The main app's existing command `make release version=dev` creates an immutable dated SemVer prerelease. This site's Downloads section reads the public GitHub Releases API and links to the latest completed dev release's actual assets. It does not guess download URLs or need a token. Results are cached in session storage for five minutes. API failure and JavaScript-disabled browsers retain links to the GitHub releases list.

The platform list covers macOS Apple Silicon/Intel, Windows x64, Linux x64/ARM64, Android, unsigned iOS and Apple Silicon simulator builds, a static web bundle, a pinned Docker Compose file, and checksums. The app repository documents signing and platform limitations in [docs/releases.md](https://github.com/taskasaur/taskasaur/blob/main/docs/releases.md).

## Deployment

The production domain is `taskasaur.net`, served through Cloudflare. The `main` branch holds the static site. GitHub Pages is not enabled on this repository; `CNAME` records the public domain but does not by itself configure hosting. Verify the production site after pushing changes to the connected deployment branch.
