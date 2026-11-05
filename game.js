const ad = document.getElementById('ad');
const gesture = document.getElementById('gesture');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function fit() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const s = Math.min(w / 360, h / 640);
  const extra = Math.max(0, h / s - 640);
  ad.style.setProperty('--s', s);
  ad.style.setProperty('--extra', extra + 'px');
}
window.addEventListener('resize', fit);
fit();

function load(src) {
  const img = new Image();
  img.src = 'assets/' + src;
  return img;
}

const gut = load('game/gameplay.png');
const player = load('game/player.png');

const PLAYER_X = 111;
const TOP = 400;
const BOTTOM = 1190;
const GRAVITY = 2600;
const JUMP = -760;
const SPEED = 260;
const GUT_END = 5056 - 720;

let state = 'start';
let gutX, y, vy, last;

function reset() {
  gutX = 0;
  y = 517;
  vy = 0;
}

function tap() {
  if (state === 'start') {
    state = 'play';
    gesture.hidden = true;
    last = performance.now();
    requestAnimationFrame(loop);
  } else if (state === 'play') {
    vy = JUMP;
  }
}

function loop(now) {
  if (state !== 'play') return;

  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  vy += GRAVITY * dt;
  y += vy * dt;
  gutX = Math.min(gutX + SPEED * dt, GUT_END);

  if (y < TOP || y + 82 > BOTTOM) return end('fail');
  if (gutX === GUT_END) return end('win');

  draw();
  requestAnimationFrame(loop);
}

function end(result) {
  state = result;
  draw();
  console.log(result);
}

function draw() {
  ctx.clearRect(0, 0, 720, 1280);
  ctx.drawImage(gut, -gutX, 0);

  ctx.save();
  ctx.translate(PLAYER_X + 42, y + 41);
  ctx.rotate(Math.max(-0.4, Math.min(vy / 2000, 0.6)));
  ctx.drawImage(player, -42, -41);
  ctx.restore();
}

reset();
Promise.all([gut, player].map(img => img.decode())).then(draw);
ad.addEventListener('pointerdown', tap);
