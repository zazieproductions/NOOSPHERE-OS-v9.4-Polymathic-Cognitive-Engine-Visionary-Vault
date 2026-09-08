# Wallpaper System — Canvas Rendering

File: `src/components/os/WallpaperCanvas.tsx`

## Modes

| Mode | Visual | Technique |
|------|--------|-----------|
| `neural` | Synaptic node field with emergent connections | 60 particles, velocity, line connections within threshold, mouse parallax |
| `matrixRain` | Phosphor green cascading glyphs | Column-based char rain, random katakana + binary, 14px monospace |
| `cyberGrid` | Isometric perspective grid with parallax | Vanishing point grid, perspective lines, mouse offset |
| `topological` | Morphing iso-contours & strange attractors | Concentric sin-modulated contours, organic blobs |
| `deepVoid` | Minimal stardust & void meditation | Solid #040507 + 40 subtle drifting dots |

## Implementation

- Single `<canvas>` fixed inset-0, pointer-events-none, z-0
- `useEffect` with `mode` dep: sets up canvas, resize listener, mousemove listener, animation loop
- `requestAnimationFrame` loop, cancels on cleanup
- `canvasRef` + `width/height` from `window.innerWidth/Height` and `getBoundingClientRect`
- Mouse parallax: `mouseRef` stores 0-1 normalized, influences particle positions / grid offset
- Config via `src/lib/config.ts`: `enableMouseParallax` flag

### Neural Mode Detail

```ts
particles = Array(60).fill().map(() => ({
  x: random*width, y: random*height,
  vx: (random-0.5)*0.5, vy: (random-0.5)*0.5,
  radius: random*2+0.5
}));

each frame:
  update x+=vx, y+=vy, bounce on edges
  draw particle (emerald #10b981)
  for each other particle within 120px:
    draw line with opacity = 1 - dist/120, stroke rgba(16,185,129,0.15)
  mouse influence: particles within 150px get pushed slightly
```

### Matrix Rain

- Columns = floor(width/14)
- Drops array = column count, each is y position
- Each frame: draw semi-transparent black overlay (0.05) for trail, then draw random char at drop position
- Char set: katakana + "01" + "NOOSPHERE"
- When drop exceeds height and random >0.975, reset to 0

### Performance

- No React state updates per frame — pure canvas
- Resize handler debounced via direct assignment, not React
- Cleanup removes listeners and cancels RAF
- 60fps target, but degrades gracefully

## Config

```ts
// src/lib/config.ts
wallpaper: {
  defaultMode: 'neural',
  enableMouseParallax: true,
}
```

## Future

- Add `audioReactive` mode using AnalyserNode
- Add `shader` mode with WebGL fragment shaders
- Persist mode to localStorage
- Add FPS counter for debug
