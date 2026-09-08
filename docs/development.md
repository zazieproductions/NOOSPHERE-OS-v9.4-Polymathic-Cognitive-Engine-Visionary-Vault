# Development Guide

## Quick Start

```bash
git clone https://github.com/zazieproductions/NOOSPHERE-OS-v9.4-Polymathic-Cognitive-Engine-Visionary-Vault.git
cd NOOSPHERE-OS-v9.4-Polymathic-Cognitive-Engine-Visionary-Vault
npm install
npm run dev
# open http://localhost:5173
```

## Scripts

| Script | Purpose |
|--------|---------|
| `dev` | Vite dev server, host 0.0.0.0:5173, HMR |
| `build` | tsc + vite build → dist/ |
| `preview` | Preview production build on 4173 |
| `lint` | ESLint (warnings allowed) |
| `lint:strict` | ESLint with max-warnings 0 |
| `lint:fix` | Auto-fix |
| `format` | Prettier write |
| `format:check` | Prettier check |
| `typecheck` | tsc --noEmit |
| `test` | Vitest run |
| `test:watch` | Vitest watch |
| `test:coverage` | Vitest coverage |
| `validate` | typecheck + lint + test + build |

## Project Conventions

### TypeScript

- Strict mode, no implicit any
- `src/types/index.ts` is source of truth for domain
- Use `type` for unions, `interface` for objects
- Prefer `unknown` over `any`, but `any` allowed with warning in creative code

### Components

- `src/components/os/` — OS chrome, no business logic
- `src/components/views/` — One per window, owns its domain logic
- `src/components/ui/` — Dumb primitives, reusable
- Props interfaces co-located, named `*ViewProps` or `*Props`
- Use `React.FC` with explicit return type `React.JSX.Element` where helpful

### Styling

- Tailwind CSS v4 (`@import "tailwindcss"`)
- Custom tokens in `src/styles/globals.css`: `.glass-panel`, `.glass-glow-*`, `.font-mono-code`, etc.
- Prefer utility classes, use `cn()` for conditional merging
- No CSS modules — global + utility

### State

- Cross-window state lives in `DesktopOS` (or extracted `useWindowManager`)
- Local UI state via `useState`
- No Redux/Zustand — overkill for this SPA
- Future: consider `useLocalStorage` for persistence

### Data

- Static datasets in `src/data/`, exported as const
- Never mutate exported arrays — clone first
- Add new nodes in `graphNodes.ts` with unique id, category, connections

### Services

- Side effects in `src/services/`
- `audioEngine` singleton, lazy init, never throws to UI
- `synthesisEngine` pure functions + controlled randomness

### Testing

- Vitest + jsdom + @testing-library/react
- `tests/setup.ts` mocks canvas, AudioContext, confetti
- Unit tests for services and constants
- For canvas/WebAudio, mock aggressively — don't test browser APIs

## Adding a New View

1. Create `src/components/views/MyView.tsx`
2. Add `WindowId` variant in `src/types/index.ts`
3. Register in `DesktopOS.initialWindows` with position/size
4. Add icon mapping in `DockBar.tsx` (lucide-react)
5. Add case in `TopStatusBar` or `OmniSearchModal` if needed
6. Document in `docs/architecture.md`

Example:

```ts
// src/types/index.ts
export type WindowId = ... | 'myView';

// src/components/os/DesktopOS.tsx
myView: {
  id: 'myView',
  title: 'My View // Description',
  icon: 'Sparkles',
  isOpen: false,
  ...
}
```

## Environment Variables

Centralized in `src/lib/config.ts`:

- `VITE_AUDIO_ENABLED` — default true
- `VITE_CONFETTI_ENABLED` — default true
- `VITE_BINAURAL_DEFAULT` — default false
- `VITE_WALLPAPER_MODE` — default neural
- `VITE_WALLPAPER_PARALLAX` — default true

Add `.env.local` (gitignored) for local overrides.

## CI

`.github/workflows/ci.yml`:

- Runs on push to main and arena/*, and PRs to main
- Matrix Node 18, 20
- Steps: install, typecheck, lint, test, build, upload artifact
- Separate job for format check

## Troubleshooting

| Issue | Fix |
|-------|-----|
| AudioContext suspended | User gesture required — click triggers `initContext().resume()` |
| Canvas blank | Check `WallpaperCanvas` mode, ensure `width/height` >0, check console for errors |
| Window off-screen | Resize viewport, or reset via preset (TopStatusBar → Presets) |
| Build fails chunk size | Increase `chunkSizeWarningLimit` in vite.config.ts or code-split views |
| Tests fail AudioContext | Ensure `tests/setup.ts` mocks AudioContext, check vitest config |

## Editor Setup

- VSCode extensions: ESLint, Prettier, Tailwind CSS IntelliSense
- `.vscode/settings.json` not committed, but recommended:
  ```json
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
  ```
- `.editorconfig` enforces lf, utf-8, 2 spaces
