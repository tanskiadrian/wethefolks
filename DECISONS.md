# Decisions

## Game

- one html css js file, small enough that more structure only gets in the way
- static layers as img, only moving stuff on canvas
- canvas in asset pixels 720x1280 so numbers match the pngs and its sharp on retina
- no phaser, too heavy for one sprite and a scrolling image
- layout always 360x640 scaled with transform, extra height on tall phones goes into the navy headline band so the playfield never changes
- level placed by hand not random so every obstacle shows up once
- first 3 seconds empty to get the feel of the jump
- speed goes from 240 to 320
- player hitbox is a circle, obstacles are rects shrunk 18 percent
- playfield ends a bit inside the pink borders so brushing them is ok
- debug=1 draws hitboxes
- one raf loop that only runs while playing so replay cant double it
- delta time capped at 50ms
- web audio with one gain node, mute is gain 0, pause is suspend
- all playing sounds tracked so replay stops them
- hidden tab pauses game sound and gsap, coming back waits for a tap
- sfx to 64k mono with ffmpeg, pngs left as they are, already under budget
- applause kept full length, faded out in code
- whole game around 1.6 MB
- gsap local not cdn
- obstacles from the design start screen left out, they sit right in front of the player

## Fireplace

## Fireplace

- three html files sharing one style.css and one fireplace.js, the part is picked by body id
- background is bg-big.jpg in all three parts, shifted by the part position (left 0, top -324, right -1360)
- the pre cut bg.jpg files dont line up at the seams (rock in top ends next to moss in right), bg-big does
- 4px gap between parts because bg-big is 1680 wide and the parts are 1672
- zoom origin is the center of the whole fireplace (840 487.5) in every part so seams stay together while zooming
- per part bg.jpg not shipped, only bg-big
- hl.png and box.png have black instead of alpha, hl uses mix-blend-mode screen, box is clip-path to the blue rect and 85% opacity
- no edits to the png files themselves
- top headline is one png shown three times with clip-path per line so it builds line by line
- top asset has no NATÜRLICH like in layout.png, used the asset as is
- product is baked into the background so it zooms with it, no separate slide in
- cta position measured from layout.png (screenshot at about 0.973 scale), centered, top 837
- intro about 3.7s, then bg breathes and cta pulses for about 30s and stops
- preview.html waits for all iframes to load and sends start with postMessage, each part also starts by itself after 3s or on load when opened alone
- prefers-reduced-motion shows the final state, no tweens
- debug=1 puts layout.jpg at 50% over each part, works on preview too
- click anywhere on a part opens clickTag
- whole fireplace around 2.6 MB with gsap and the debug layout
- ad assets not compressed, only layout.png saved as jpg for the debug overlay (1.7 MB to 280 KB)