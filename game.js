const ad = document.getElementById('ad');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 360px always fills the width. On short/wide screens height wins instead,
// on tall ones the leftover height goes to the headline band (see style.css)
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

let gutX = 0;
let playerY = 517;

// canvas works in asset pixels (720x1280), CSS shows it at 360x640
function draw() {
  ctx.clearRect(0, 0, 720, 1280);
  ctx.drawImage(gut, -gutX, 0);
  ctx.drawImage(player, 111, playerY);
}

Promise.all([gut, player].map(img => img.decode())).then(draw);

ad.addEventListener('pointerdown', () => {
  console.log('tap');
});
