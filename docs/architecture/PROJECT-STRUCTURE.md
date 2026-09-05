# Project Structure

**Status:** PROPOSED
**Authority:** Engineering implementation owner

| Location | Responsibility |
| --- | --- |
| `src/main.js` | Browser startup and service-worker registration |
| `src/state/` | IndexedDB repository boundary, schema/migrations, and versioned data transfer |
| `src/ui/` | Safe DOM rendering and static-host hash route constants |
| `public/` | Manifest, icons, and service worker for static deployment |
| `docs/` | Canonical controlled documentation |
| `tests/` | Node-native baseline tests |

As authorised phases need them, introduce the smallest coherent folders for `app/`, `components/`, `data/migrations/`, `data/repositories/`, `data/schemas/`, `modules/`, `services/`, `styles/`, and `utils/`. Do not create empty abstractions merely to match a diagram.
