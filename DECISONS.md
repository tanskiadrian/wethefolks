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

todo