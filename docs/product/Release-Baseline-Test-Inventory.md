# TalentisOS Release-Baseline Test Inventory

Baseline commit inspected: `625b19015b15319546e9c56e8cbcde02c0339862` on 2026-09-19.

| Validation area | Command / method | Result | Evidence and limitation |
| --- | --- | --- | --- |
| Automated tests | No test command available | Not available | `package.json` defines no `test` script and no test files/framework are tracked. |
| Source checks | No lint/type-check command available | Not available | `package.json` defines no `lint`, `check` or type-check script. |
| Production build | `npm run build` | Pass | Vite 8.3.0 transformed 9 modules and produced `dist/` successfully in 62 ms. |
| Manual visible-route inspection | Read `index.html`, `src/main.js`, `src/counter.js`, `src/style.css` | Completed | One Vite starter landing surface with Vite/JavaScript documentation/community links and a counter; no TalentisOS routes or modules. |
| Data-model inspection | File inventory and source inspection | Completed | No data-model document, persistence code, migration, import/export or relationship tests found. |
| Deployment/PWA inspection | File inventory including config patterns | Completed | No tracked GitHub Pages, CI, hosting config, manifest or service-worker files found. |
| Product workflow, responsive and accessibility checks | Not applicable at baseline | Not available | No TalentisOS workflow exists to validate at 390 px, 768 px or 1440 px. Required once Phase 01 begins. |

## Build execution record

Executed `npm run build` on 2026-09-19. Result: pass. Vite emitted `dist/index.html` and bundled CSS, JavaScript and starter image assets. This establishes build-tooling health only; it is not product acceptance evidence.
