# Contributing to NOOSPHERE-OS

Thanks for your interest in contributing! This project is both a software system and a creative-technology artifact. Contributions that improve engineering quality **and** preserve creative weirdness are especially welcome.

## Getting Started

1. **Fork & clone**
   ```bash
   git clone https://github.com/zazieproductions/NOOSPHERE-OS-v9.4-Polymathic-Cognitive-Engine-Visionary-Vault.git
   cd NOOSPHERE-OS-v9.4-Polymathic-Cognitive-Engine-Visionary-Vault
   ```

2. **Install**
   ```bash
   npm install
   ```

3. **Run dev server**
   ```bash
   npm run dev
   ```

4. **Validate**
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```

## Project Conventions

- **TypeScript strict** — no `any` without justification.
- **Components**: `src/components/os` for shell, `src/components/views` for domain views, `src/components/ui` for primitives.
- **State**: Keep cross-window state in `DesktopOS` or extracted hooks in `src/hooks`.
- **Data**: Static datasets in `src/data`. No runtime mutation of exported constants; clone before editing.
- **Services**: Side-effectful engines (audio, synthesis) in `src/services` with explicit error boundaries.
- **Styling**: Tailwind CSS v4 + custom CSS in `src/styles`. Prefer utility classes; use `glass-panel` tokens for OS chrome.

## Commit Style

Use conventional commits where possible:

- `feat: add topological wallpaper turbulence`
- `fix: prevent window drag overflow on small viewports`
- `docs: clarify synthesis engine entropy model`
- `refactor: extract useWindowManager hook`

## Adding a New View

1. Create `src/components/views/MyNewView.tsx`
2. Add `WindowId` variant in `src/types/index.ts`
3. Register window in `DesktopOS.initialWindows`
4. Add icon mapping in `DockBar`
5. Document in `docs/architecture.md`

## Testing

- Unit tests live in `tests/` and `src/**/*.test.ts`
- Run `npm run test` for Vitest
- For canvas/WebAudio features, mock where necessary — see `tests/setup.ts`

## Questions?

Open an issue with label `question` or `idea`. For creative-technology discussions, include references and intent.
