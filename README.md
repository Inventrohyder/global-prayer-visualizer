# Global Prayer Visualizer

Interactive prayer-time visualization app with a shared 3D globe and 2D map experience.

## Local development

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages previews

Yes — this repo supports both:

- **Main deployment** (after merge to `main`) via `.github/workflows/deploy-pages.yml`
- **Per-PR preview deployment** via `.github/workflows/pr-preview.yml`

### One-time setup

1. Push this repo to GitHub.
2. In **Settings → Pages**, set **Source** to deploy from **`gh-pages` branch** (root).
3. Ensure GitHub Actions are enabled for the repository.

### How PR previews work

- On every PR update, Actions builds and deploys to:
  - `gh-pages/previews/pr-<PR_NUMBER>/`
- The workflow posts a sticky PR comment with URL:
  - `https://<username>.github.io/<repo-name>/previews/pr-<PR_NUMBER>/`

### Main deployment URL

- `https://<username>.github.io/<repo-name>/`

Vite base path is injected in CI via `VITE_BASE_PATH` for PR previews and auto-falls back for main builds.
