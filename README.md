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

This repo supports both:

- **Main deployment** (after merge to `main`) via `.github/workflows/deploy-pages.yml`
- **Per-PR preview deployment** via `.github/workflows/pr-preview.yml`

### One-time setup

1. Push this repo to GitHub.
2. Ensure GitHub Actions are enabled for the repository.
3. Workflow will auto-configure Pages source to `gh-pages` branch.

### PR preview URLs

- On each PR update, Actions deploys to:
  - `gh-pages/previews/pr-<PR_NUMBER>/`
- URL pattern:
  - `https://<username>.github.io/<repo-name>/previews/pr-<PR_NUMBER>/`

> Security note: automatic preview deploy is restricted to PRs opened from the same repository (not forks).

### Manual backfill / repair for an existing PR preview

If a preview URL returns 404 (for example, old PRs before this workflow existed), run:

- **Actions → PR Preview → Run workflow**
- set `pr_number` (e.g., `1`)

This republishes `previews/pr-<PR_NUMBER>/` without merging.

### Main deployment URL

- `https://<username>.github.io/<repo-name>/`

Vite base path is injected in CI via `VITE_BASE_PATH` for PR previews and auto-falls back for main builds.
