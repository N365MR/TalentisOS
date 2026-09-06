import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this repository at /TalentisOS/; retain root-relative dev URLs.
  base: command === 'build' ? '/TalentisOS/' : '/',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: 'assets/[name].js'
      }
    }
  }
}));
