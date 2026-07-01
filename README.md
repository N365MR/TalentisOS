# TalentisOS Landing Website

Static landing page for TalentisOS using plain HTML, CSS, and vanilla JavaScript.

## Summary of files

- `index.html` contains the full semantic page structure, content sections, navigation, FAQ, and footer.
- `styles.css` contains the global design system, responsive layout rules, interaction states, and animation utilities.
- `app.js` contains the sticky header behavior, mobile navigation logic, FAQ accordion logic, current year injection, and scroll reveal setup with `IntersectionObserver`.

## How to run locally

1. Open `index.html` directly in a browser.
2. No build step, package install, or local server is required for the site to work.
3. Optionally use a simple static server for easier mobile and QA testing, for example:

```bash
python3 -m http.server 8123
```

4. Visit `http://127.0.0.1:8123` in your browser only if you choose the optional QA server.

## How to deploy with GitHub Pages

1. Push this project to a GitHub repository.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Build and deployment`, choose `Deploy from a branch`.
4. Select the branch that contains `index.html`, usually `main`.
5. Select the root folder `/`.
6. Save the settings and wait for GitHub Pages to publish.

## How to push to GitHub

1. Create a new repository on GitHub.
2. In the project folder, initialize git if needed with `git init`.
3. Add the files with `git add .`.
4. Create a commit with `git commit -m "Initial TalentisOS landing page"`.
5. Add your GitHub repository as the remote with `git remote add origin https://github.com/USERNAME/REPOSITORY_NAME.git`.
6. Push the branch with `git push -u origin main`.

This site is GitHub Pages compatible because it uses only relative asset paths and has no build tools or external dependencies.

## Manual QA checklist

- `index.html` opens correctly in a browser.
- `styles.css` loads and the page renders with the dark premium design system.
- `app.js` loads with no JavaScript console errors.
- Sticky header remains stable while scrolling.
- Desktop navigation is visible above `1024px`.
- Hamburger navigation works at `1024px` and below.
- Mobile menu opens, closes, and prevents background scroll while open.
- Mobile menu links close the menu after selection.
- Internal anchor links scroll to the correct sections without content hiding behind the sticky header.
- FAQ accordion opens and closes smoothly.
- Keyboard navigation works across links, buttons, menu toggle, and FAQ items.
- Focus states are visible.
- CTA buttons, cards, pricing cards, and testimonials animate smoothly without feeling heavy.
- Scroll reveal animations trigger cleanly and respect reduced motion.
- No horizontal scrolling appears at `390px`, `430px`, `768px`, `1024px`, `1280px`, or `1440px`.
- Text remains readable with no clipping on mobile, tablet, or desktop.
- No banned ecommerce wording appears in page copy or CTAs.

## Known limitations

- `Privacy` and `Terms` currently point to in-page placeholder anchors rather than dedicated legal pages.
- `Blog` currently routes to an on-page anchor until a separate blog experience is added.
- The dashboard and product panels are static mockups and do not represent connected application data yet.

## Suggested next improvements

- Replace placeholder legal and blog anchors with dedicated pages.
- Add form-based early access capture and submission handling.
- Expand the product mockups into deeper interactive walkthrough sections.
- Add analytics and conversion tracking after deployment requirements are defined.
- Introduce lightweight asset optimization if custom media or illustrations are added later.
