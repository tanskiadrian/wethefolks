const clickTag = window.clickTag || 'https://example.com/landing';
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const ad = document.getElementById('ad');
const bg = document.getElementById('bg');
const logo = document.getElementById('logo');
const box = document.getElementById('box');
const hl = document.getElementById('hl');
const cta = document.getElementById('cta');
const lines = document.querySelectorAll('#l1, #l2, #l3');

document.body.addEventListener('click', () => {
  window.open(clickTag, '_blank');
});

if (location.search.includes('debug')) {
  const frames = {
    left: [28, 50, 311, 949],
    top: [345, 49, 1002, 246],
    right: [1353, 50, 310, 949],
  };
  const [x, y, w, h] = frames[document.body.id];
  const sx = ad.offsetWidth / w;
  const sy = ad.offsetHeight / h;
  const img = document.createElement('img');
  img.id = 'debug';
  img.src = 'design/layout.jpg';
  img.style.left = -x * sx + 'px';
  img.style.top = -y * sy + 'px';
  img.style.width = 1684 * sx + 'px';
  img.style.height = 1018 * sy + 'px';
  ad.appendChild(img);
}

let started = false;

function start() {
  if (started) return;
  started = true;
  ad.style.visibility = 'visible';

  if (calm) return;

  const tl = gsap.timeline({ onComplete: idle });

  tl.from(bg, { scale: 1.15, duration: 5, ease: 'power2.out' }, 0);

  if (logo) {
    tl.from(logo, { autoAlpha: 0, scale: 0.6, transformOrigin: '160px 125px', duration: 0.9, ease: 'back.out(1.7)' }, 0.5);
  }

  lines.forEach((line, i) => {
    tl.from(line, { autoAlpha: 0, y: 25, duration: 0.8, ease: 'power3.out' }, 0.6 + i * 0.45);
  });

  if (box) {
    tl.from(box, { scaleY: 0, transformOrigin: '50% 914px', duration: 0.7, ease: 'power3.out' }, 1.8);
    tl.from(hl, { autoAlpha: 0, y: 15, duration: 0.6, ease: 'power2.out' }, 2.3);
    tl.from(cta, { autoAlpha: 0, scale: 0.3, duration: 0.7, ease: 'back.out(2)' }, 3);
  }
}

function idle() {
  gsap.to(bg, { scale: 1.04, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: 5 });

  if (cta) {
    const pulse = gsap.timeline({ repeat: 9, repeatDelay: 2.2 });
    pulse.to(cta, { scale: 1.07, duration: 0.4, ease: 'sine.inOut', yoyo: true, repeat: 1 });
  }
}

if (window.parent !== window) {
  window.addEventListener('message', (e) => {
    if (e.data === 'start') start();
  });
  setTimeout(start, 3000);
} else {
  window.addEventListener('load', start);
}
