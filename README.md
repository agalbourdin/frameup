# FrameUp

FrameUp is a static, browser-only screenshot composer. It combines a screenshot
and a background into a 1200 × 630 PNG without uploading either image.

## Prerequisites

- Node.js `>=22.13.0`
- pnpm

## Quick start

```bash
pnpm install
pnpm dev
```

## Deployment

`pnpm build` produces a fully static site in `dist/`. Upload that directory's
contents to any static host. Asset URLs are relative, so the same build works at
the domain root or under a subdirectory.

## Commands

- `pnpm build`: produce `dist/`
- `pnpm preview`: serve the production build locally
- `pnpm check`: type-check the Astro project
- `pnpm test`: build and verify the generated static site
