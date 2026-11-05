# We The Folks take-home

`game/` is the Gut Run game (variant A), `fireplace/` is the fireplace skin (variant B). No build step, GSAP is the only library.

    npx serve .

Then open localhost:3000/game/. Add `?debug=1` if you want to see the hitboxes.

Known issues: the music is still the full 58 s file, the game doesn't pause when the ad is scrolled out of view (only when the tab is hidden), and the hitboxes are just shrunk rectangles. I left out the obstacles from the design's start screen on purpose, because they sit right in front of the player. Tested in Chrome device emulation and on my phone *(model)*.

With more time I'd add an IntersectionObserver pause, round hitboxes for the bacteria, a short countdown before the first obstacle, and a Playwright test that plays through the game.

Why things are the way they are: see DECISIONS.md.

## AI

I used Claude for the code, one step at a time, and tested and committed every step myself. It did get some things wrong. The first tap made the poo jump straight into the top border, so every game ended right away. Replay used `clearProps: 'all'`, which also wiped the transform-origin on the endcard layers. And it cut the applause sound short, which counts as editing an asset, so I kept the full file and fade it out in code instead.