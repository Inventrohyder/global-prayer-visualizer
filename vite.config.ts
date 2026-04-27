import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const explicitBase = process.env.VITE_BASE_PATH;
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === 'true' && Boolean(repositoryName);

export default defineConfig({
  plugins: [react()],
  base: explicitBase ?? (isGithubPagesBuild && repositoryName ? `/${repositoryName}/` : '/'),
});
