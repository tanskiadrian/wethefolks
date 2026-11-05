const clickTag = window.clickTag || 'https://example.com/landing';

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

function start() {
  ad.style.visibility = 'visible';

  const tl = gsap.timeline();

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

window.addEventListener('load', start);
