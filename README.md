# lucas-baraldi.github.io

Personal portfolio of Lucas Baraldi, AI Developer. English at `/`, Portuguese at `/pt/`.

Plain HTML, CSS and JavaScript. No framework and no build step: GitHub Pages serves this branch as it is.

## Layout

- `index.html`, `pt/index.html`: the two pages.
- `css/site.css`: tokens, layout and CSS-only motion.
- `js/site.js`: theme, language, scroll motion (GSAP, ScrollTrigger, Lenis).
- `js/anim.js`: mounts the case animations and runs them only while they are on screen.
- `anim/*.js`: one module per case. Each exports `renderAt(ctx, w, h, t)`, a pure function of time with an 8 s loop.
- `vendor/`, `fonts/`: third-party files, pinned and self-hosted. See `vendor/LICENSES.md`.

## Run locally

Any static file server works, for example:

```
npx serve .
```

## Credits

- Motion timings for some page effects follow the specs in [Motion Prompt](https://github.com/showheyohtaki/motion-prompt) by Shohei Ohtaki (MIT). The effect numbers are noted next to the code that uses them.
- Typeface: Geist and Geist Mono by Vercel (SIL Open Font License 1.1).
