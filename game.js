const ad = document.getElementById('ad');
const gesture = document.getElementById('gesture');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const debug = location.search.includes('debug');
const clickTag = window.clickTag || 'https://example.com/landing';
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const audio = new AudioContext();
const out = audio.createGain();
out.connect(audio.destination);

const sounds = {};
for (const name of ['loop', 'crash', 'fail', 'cheer', 'applause']) {
  fetch(`assets/audio/${name}.mp3`)
    .then(res => res.arrayBuffer())
    .then(data => audio.decodeAudioData(data))
    .then(buffer => {
      sounds[name] = buffer;
      if (name === 'loop' && state === 'play') play('loop', true);
    });
}

const playing = new Set();

function play(name, loop = false) {
  if (!sounds[name]) return;
  const src = audio.createBufferSource();
  src.buffer = sounds[name];
  src.loop = loop;
  src.connect(out);
  src.onended = () => playing.delete(src);
  src.start();
  playing.add(src);
}

function stopAll() {
  for (const src of playing) src.stop();
  playing.clear();
}

const PLAYER_X = 111;
const R = 34;
const TOP = 400;
const BOTTOM = 1190;
const GRAVITY = 2600;
const JUMP = -760;
const GUT_END = 5056 - 720;

let state = 'start';
let gutX, y, vy, last, endTl;

function reset() {
  gutX = 0;
  y = 517;
  vy = 0;
}

function tap() {
  if (state === 'start' || state === 'paused') {
    if (state === 'start') play('loop', true);
    audio.resume();
    state = 'play';
    gsap.killTweensOf(gesture);
    gsap.to(gesture, { autoAlpha: 0, scale: 0.6, duration: 0.25 });
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
  stopAll();
  if (result === 'fail') play('crash');

  const card = document.getElementById(result);
  const q = gsap.utils.selector(card);
  card.hidden = false;

  endTl = gsap.timeline({ delay: result === 'fail' ? 0.5 : 0.2 })
    .call(() => result === 'fail' ? play('fail') : (play('cheer'), play('applause')))
    .from(card, { autoAlpha: 0, duration: 0.4 })
    .from(q('.layer')[0], { scale: 0.6, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.6)' }, '-=0.2');

  if (result === 'fail') {
    endTl
      .from(q('.poo'), { y: -60, autoAlpha: 0, duration: 0.8, ease: 'bounce.out' }, '-=0.3')
      .from(q('.bac'), { scale: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.08 }, '-=0.5');
  } else {
    endTl
      .from(q('.confetti'), { scale: 0.2, rotation: -20, autoAlpha: 0, duration: 0.9, ease: 'expo.out' }, '-=0.3')
      .from(q('.poo'), { y: 80, autoAlpha: 0, duration: 0.8, ease: 'back.out(2)' }, '-=0.7');
  }

  endTl
    .from(q('.hl'), { y: 20, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    .from(q('.btn'), { scale: 0.8, autoAlpha: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.12 }, '-=0.2')
    .to(q('.cta'), { scale: 1.05, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: 7 });

  if (calm) endTl.progress(1);
}

function replay() {
  endTl.kill();
  stopAll();
  for (const card of document.querySelectorAll('.endcard')) {
    card.hidden = true;
    gsap.set([card, ...card.querySelectorAll('img')], { clearProps: 'transform,opacity,visibility' });
  }
  reset();
  draw();
  state = 'start';
  intro();
}

function intro() {
  if (calm) return;
  gsap.fromTo(gesture, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.6 });
  gsap.to(gesture, { y: 8, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.1 });
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

window.addEventListener('load', () => {
  draw();
  ad.style.visibility = 'visible';
  if (!calm) gsap.from('#headline', { y: -30, autoAlpha: 0, duration: 0.7, ease: 'power3.out' });
  intro();
});

ad.addEventListener('pointerdown', tap);
for (const cta of document.querySelectorAll('.cta')) {
  cta.addEventListener('click', () => window.open(clickTag, '_blank'));
}
document.querySelector('.replay').addEventListener('click', replay);

const mute = document.getElementById('mute');
mute.addEventListener('pointerdown', e => e.stopPropagation());
mute.addEventListener('click', () => {
  const muted = mute.classList.toggle('muted');
  out.gain.value = muted ? 0 : 1;
  mute.setAttribute('aria-label', muted ? 'Ton an' : 'Ton aus');
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    audio.suspend();
    gsap.globalTimeline.pause();
    if (state === 'play') {
      state = 'paused';
      gsap.to(gesture, { autoAlpha: 1, scale: 1, duration: 0.3 });
    }
  } else {
    gsap.globalTimeline.resume();
    if (state !== 'paused') audio.resume();
  }
});
