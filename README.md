# TalentisOS Landing Website

TalentisOS is a local-first leadership workspace concept built as a plain HTML, CSS, and vanilla JavaScript progressive web app foundation.

Tagline: `Your Daily Leadership Playbook`

## Project overview

This project is a static, framework-free landing website and starter PWA shell for TalentisOS. It is designed to open locally, stay compatible with GitHub Pages, and provide a clean foundation for later build phases without introducing a backend, package manager, or external frameworks.

## Current files

- `index.html`
- `styles.css`
- `app.js`
- `manifest.json`
- `service-worker.js`
- `QA_CHECKLIST.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/DATA_MODEL.md`
- `docs/BUILD_PHASES.md`
- `docs/TESTING_PLAN.md`

## How to run locally

1. Open `index.html` directly in your browser.
2. No build tools, package manager, or backend are required.
3. Optionally use a simple local server for PWA or service worker testing:

```bash
python3 -m http.server 8123
```

4. If using the optional server, open `http://127.0.0.1:8123`.

## How to push to GitHub

1. Create a new repository on GitHub.
2. In this folder, run `git init` if the repo has not been initialized yet.
3. Add files with `git add .`.
4. Create a commit with `git commit -m "Add TalentisOS Phase 0 foundation"`.
5. Add your remote with `git remote add origin https://github.com/USERNAME/REPOSITORY_NAME.git`.
6. Push with `git push -u origin main`.

## How to enable GitHub Pages

1. Open the repository on GitHub.
2. Go to `Settings`.
3. Open the `Pages` section.
4. Choose `Deploy from a branch`.
5. Select the branch that contains `index.html`, usually `main`.
6. Select the root folder `/`.
7. Save and wait for deployment to finish.

## Notes

- All asset links use relative paths.
- The app is ready for later phases without rebuilding the current landing page.
- The service worker registers only in supported secure contexts so direct local file opens do not throw console errors.
