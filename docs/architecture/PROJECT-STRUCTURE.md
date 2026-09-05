# Project Structure

**Status:** PROPOSED
**Authority:** Engineering implementation owner

| Location | Responsibility |
| --- | --- |
| `src/main.js` | Browser startup and service-worker registration |
| `src/state/` | Current metadata-only IndexedDB boundary; to evolve into data boundary |
| `src/ui/` | Rendering and route constants |
| `public/` | Manifest, icons, and service worker for static deployment |
| `docs/` | Canonical controlled documentation |
| `tests/` | Node-native baseline tests |

As authorised phases need them, introduce the smallest coherent folders for `app/`, `components/`, `data/migrations/`, `data/repositories/`, `data/schemas/`, `modules/`, `services/`, `styles/`, and `utils/`. Do not create empty abstractions merely to match a diagram.
