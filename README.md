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

### One-time setup (required)

1. Push this repo to GitHub.
2. Ensure GitHub Actions are enabled for the repository.
3. In **Settings → Pages**, set source to **Deploy from a branch**.
4. Choose branch **`gh-pages`** and folder **`/(root)`**.

> This is required because setting Pages source via API needs admin-level token permissions not available to standard workflow tokens.

### PR preview URLs (no merge required)

- On each PR update, the PR workflow builds and deploys the PR HEAD commit to:
  - `gh-pages/previews/pr-<PR_NUMBER>/`
- URL pattern:
  - `https://<username>.github.io/<repo-name>/previews/pr-<PR_NUMBER>/`

> Security note: automatic preview deploy is restricted to PRs opened from the same repository (not forks).

### Manual backfill / repair for an existing PR preview

If a preview URL returns 404 (for example, old PRs before this workflow existed), run:

- **Actions → PR Preview → Run workflow**
- set:
  - `pr_number` (e.g., `1`)
  - `ref` (branch name or commit SHA to build)

This republishes `previews/pr-<PR_NUMBER>/` without merging.

### Main deployment URL

- `https://<username>.github.io/<repo-name>/`

Vite base path is injected in CI via `VITE_BASE_PATH` for PR previews and auto-falls back for main builds.
