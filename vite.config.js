import { defineConfig } from 'vite'

// Relative asset paths keep the static shell valid at GitHub Pages' /TalentisOS/ path.
// The manifest lets the service worker discover hashed production entry assets.
export default defineConfig({
  base: './',
  build: { manifest: 'asset-manifest.json' },
})
