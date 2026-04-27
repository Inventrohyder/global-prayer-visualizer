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
5. In **Settings → Actions → General**, set workflow permissions to **Read and write permissions**.

### Why this setup

PR previews now use [`rossjrw/pr-preview-action`](https://github.com/marketplace/actions/deploy-pr-preview), which is purpose-built for GitHub Pages PR previews and handles deploy/update/cleanup (`closed`) automatically.

### PR preview URLs

- Preview path format: `pr-preview/pr-<PR_NUMBER>/`
- URL: `https://<username>.github.io/<repo-name>/pr-preview/pr-<PR_NUMBER>/`

### Main deployment compatibility

Main deployment keeps PR previews intact using:

- `clean-exclude: pr-preview/`
- `force: false`

so PR preview content is not overwritten.

### Main deployment URL

- `https://<username>.github.io/<repo-name>/`

Vite base path is injected in CI via `VITE_BASE_PATH` for PR previews and auto-falls back for main builds.
