/* The public release is the source of truth: never guess a platform asset URL. */
(async () => {
  const repository = "https://github.com/taskasaur/taskasaur";
  const endpoint = "https://api.github.com/repos/taskasaur/taskasaur/releases?per_page=100";
  const status = document.querySelector("#release-status");
  const releaseLink = document.querySelector("#release-link");
  if (!status || !releaseLink) return;
  const cacheKey = "taskasaur-website-dev-release-v1";
  let cached;
  try { cached = JSON.parse(sessionStorage.getItem(cacheKey)); } catch {}
  let release;
  try {
    if (cached?.savedAt > Date.now() - 300_000) release = cached.release;
    else {
      const response = await fetch(endpoint, { headers: { Accept: "application/vnd.github+json" }, signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw Error("Release listing unavailable");
      const releases = await response.json();
      release = releases.filter((item) => !item.draft && item.prerelease && /^v\d+\.\d+\.\d+-dev\./.test(item.tag_name) && item.assets?.length)
        .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))[0];
      if (release) try { sessionStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), release })); } catch {}
    }
    if (!release || !release.html_url?.startsWith(repository + "/releases/tag/")) {
      status.textContent = "The first dev release is being prepared. Check GitHub for published builds.";
      return;
    }
    const published = new Date(release.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    status.textContent = `${release.tag_name.replace(/^v/, "")} · Published ${published}`;
    releaseLink.href = release.html_url;
    releaseLink.textContent = "Release notes and all downloads →";
    const groups = {
      mac: [["-mac-arm64.dmg", "Apple Silicon DMG"], ["-mac-x64.dmg", "Intel DMG"]],
      windows: [["-win-x64.exe", "Windows x64 installer"]],
      linux: [["-linux-x64.AppImage", "x64 AppImage"], ["-linux-arm64.AppImage", "ARM64 AppImage"], ["-linux-x64.deb", "x64 DEB"], ["-linux-arm64.deb", "ARM64 DEB"]],
      android: [["-android.apk", "Download Android APK"]],
      ios: [["-ios-unsigned.zip", "Unsigned device app"], ["-ios-simulator-arm64.zip", "Apple Silicon simulator"]],
      web: [["-web.zip", "Download web bundle"]],
      server: [["-server.compose.yaml", "Download Compose file"]],
      checksums: [["SHA256SUMS.txt", "Download checksums"]],
    };
    for (const [platform, patterns] of Object.entries(groups)) {
      const container = document.querySelector(`[data-platform="${platform}"]`);
      const links = [];
      for (const [suffix, label] of patterns) {
        const asset = release.assets.find((item) => item.name.endsWith(suffix) && item.browser_download_url.startsWith(repository + "/releases/download/"));
        if (!asset) continue;
        const link = document.createElement("a");
        link.href = asset.browser_download_url;
        link.textContent = label + " ↓";
        links.push(link);
      }
      if (links.length) container.replaceChildren(...links);
      else {
        const link = container.querySelector("a");
        link.href = release.html_url;
        link.textContent = "Check release availability →";
      }
    }
  } catch {
    status.textContent = "The release list is temporarily unavailable. Use GitHub to see the latest dev downloads.";
  }
})();
