const ad = document.getElementById('ad');
const gesture = document.getElementById('gesture');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const debug = location.search.includes('debug');

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

const level = [
  ['txt1', 1000, 952],
  ['bac5', 1230, 560],
  ['txt2', 1450, 470],
  ['bac2', 1680, 900],
  ['txt3', 1880, 640],
  ['bac1', 2100, 950],
  ['txt4', 2300, 470],
  ['bac3', 2520, 760],
  ['txt5', 2740, 778],
  ['bac4', 2960, 490],
  ['txt6', 3180, 470],
  ['bac6', 3400, 1000],
  ['txt7', 3600, 720],
  ['txt8', 3820, 834],
  ['txt9', 4040, 470],
].map(([name, x, y]) => ({ img: load(`game/${name}.png`), x, y }));

const PLAYER_X = 111;
const R = 34;
const TOP = 400;
const BOTTOM = 1190;
const GRAVITY = 2600;
const JUMP = -760;
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

  const speed = 240 + 80 * gutX / GUT_END;
  gutX = Math.min(gutX + speed * dt, GUT_END);
  vy += GRAVITY * dt;
  y += vy * dt;

  if (y + 41 - R < TOP || y + 41 + R > BOTTOM || level.some(hits)) return end('fail');
  if (gutX === GUT_END) return end('win');

  draw();
  requestAnimationFrame(loop);
}

function box(o) {
  const pad = Math.min(o.img.width, o.img.height) * 0.18;
  return {
    x: o.x - gutX + pad,
    y: o.y + pad,
    w: o.img.width - pad * 2,
    h: o.img.height - pad * 2,
  };
}

function hits(o) {
  const b = box(o);
  const cx = PLAYER_X + 42;
  const cy = y + 41;
  const nx = Math.max(b.x, Math.min(cx, b.x + b.w));
  const ny = Math.max(b.y, Math.min(cy, b.y + b.h));
  return (cx - nx) ** 2 + (cy - ny) ** 2 < R * R;
}

function end(result) {
  state = result;
  draw();
  console.log(result);
}

function draw() {
  ctx.clearRect(0, 0, 720, 1280);
  ctx.drawImage(gut, -gutX, 0);

  for (const o of level) {
    const x = o.x - gutX;
    if (x > -400 && x < 720) ctx.drawImage(o.img, x, o.y);
  }

  ctx.save();
  ctx.translate(PLAYER_X + 42, y + 41);
  ctx.rotate(Math.max(-0.4, Math.min(vy / 2000, 0.6)));
  ctx.drawImage(player, -42, -41);
  ctx.restore();

  if (debug) {
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(PLAYER_X + 42, y + 41, R, 0, Math.PI * 2);
    ctx.stroke();
    for (const o of level) {
      const b = box(o);
      ctx.strokeRect(b.x, b.y, b.w, b.h);
    }
    ctx.strokeRect(0, TOP, 720, BOTTOM - TOP);
  }
}

reset();
Promise.all([gut, player, ...level.map(o => o.img)].map(img => img.decode())).then(draw);
ad.addEventListener('pointerdown', tap);
