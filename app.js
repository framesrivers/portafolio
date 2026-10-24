'use strict';

const mobileMenu = document.querySelector('#mobile-menu');
const menuButton = document.querySelector('.mobile-menu-button');

menuButton.addEventListener('click', () => {
  mobileMenu.showModal(); document.body.classList.add('dialog-open'); menuButton.setAttribute('aria-expanded', 'true');
  if (motionEnabled && window.gsap) gsap.fromTo(mobileMenu.querySelectorAll('nav a'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .07, ease: 'power3.out' });
});
document.querySelector('.menu-close').addEventListener('click', () => mobileMenu.close());
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => mobileMenu.close()));
mobileMenu.addEventListener('close', () => { document.body.classList.remove('dialog-open'); menuButton.setAttribute('aria-expanded', 'false'); });

const notes = [
  { title: 'Start with a person.<br>Then open Figma.', description: 'Interviews, market research, and usability testing bring the real problem into focus before the interface takes shape.' },
  { title: 'Make it.<br>Watch. Make it better.', description: 'Prototypes turn assumptions into something people can actually use. Watching where they pause tells me what needs another pass.' },
  { title: 'The handoff isn’t<br>the finish line.', description: 'Good collaboration continues through specifications, implementation review, and the details that make a design work in the real product.' }
];
let noteIndex = 0;
let noteAnimating = false;
function changeNote(direction) {
  if (noteAnimating) return;
  noteIndex = (noteIndex + direction + notes.length) % notes.length;
  const update = () => { document.querySelector('#note-title').innerHTML = notes[noteIndex].title; document.querySelector('#note-description').textContent = notes[noteIndex].description; document.querySelector('.note-count').textContent = `0${noteIndex + 1} / 03`; };
  const target = document.querySelector('.note-content');
  if (motionEnabled && window.gsap) {
    noteAnimating = true;
    gsap.to(target, { opacity: 0, y: -10, duration: .2, onComplete: () => { update(); gsap.fromTo(target, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out', onComplete: () => { noteAnimating = false; } }); } });
  } else update();
}
document.querySelector('#prev-note').addEventListener('click', () => changeNote(-1));
document.querySelector('#next-note').addEventListener('click', () => changeNote(1));

const email = 'hola@marcosrios.com';
const copyButton = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');
copyButton.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(email); copyStatus.textContent = 'Email copied.'; }
  catch { copyStatus.textContent = email; }
});
document.querySelector('#year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPreference = null;
try { motionPreference = localStorage.getItem('marcos-motion'); } catch {}
let motionEnabled = motionPreference ? motionPreference === 'on' : !reducedMotion.matches;
const motionToggle = document.querySelector('#motion-toggle');
let motionContext;
let motionMedia;
let marqueeTween;

function updateMotionLabel() {
  document.documentElement.classList.toggle('motion-off', !motionEnabled);
  motionToggle.setAttribute('aria-pressed', String(!motionEnabled));
  motionToggle.setAttribute('aria-label', motionEnabled ? 'Reduce motion' : 'Enable motion');
  document.querySelector('#motion-state').textContent = motionEnabled ? 'on' : 'off';
}
function clearMotion() {
  if (motionMedia) { motionMedia.revert(); motionMedia = null; }
  if (motionContext) { motionContext.revert(); motionContext = null; }
  marqueeTween = null;
}
function reveal(target, trigger, vars = {}) {
  gsap.from(target, { y: 45, opacity: 0, duration: 1.1, ease: 'power3.out', ...vars, scrollTrigger: { trigger: trigger || target, start: 'top 92%', once: true } });
}
function initMotion(animateIntro = true) {
  clearMotion(); updateMotionLabel();
  if (!motionEnabled || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  motionContext = gsap.context(() => {
    if (animateIntro) {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro.from('.hero-kicker', { y: 15, opacity: 0, duration: .8 })
        .from('.line > span', { yPercent: 110, opacity: 0, duration: 1.15, stagger: .12 }, .12)
        .from('.hero-intro', { y: 24, opacity: 0, duration: .9 }, .5);
    }
    gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .4 } });
    marqueeTween = gsap.to('.marquee-track', { xPercent: -33.333333, duration: 32, ease: 'none', repeat: -1 });
    document.querySelectorAll('.project-visual').forEach(visual => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: visual, start: 'top 98%', end: 'bottom -30%', scrub: .7 } });
      timeline.fromTo(visual, { scale: .86, opacity: .7 }, { scale: 1, opacity: 1, duration: .35, ease: 'power1.out' })
        .to(visual, { scale: 1, opacity: 1, duration: .4 })
        .to(visual, { scale: .98, opacity: .25, duration: .25, ease: 'none' });
    });
    reveal('.context-shell', '.context-grid', { stagger: .1 });
    reveal('.frontera-copy');
    reveal('.frontera-photo', null, { rotation: -4, duration: 1.2 });
    reveal('.about-copy');
    reveal('.map-shell', null, { rotation: -3, duration: 1.2 });
    gsap.from('.contact-main h2', { y: 50, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.contact-section', start: 'top 80%', once: true } });
  });
  motionMedia = gsap.matchMedia();
  motionMedia.add('(min-width: 851px)', () => {
    const sidebar = document.querySelector('.work-sidebar');
    ScrollTrigger.create({ trigger: sidebar, start: 'top 130px', end: () => '+=' + Math.max(0, document.querySelector('.project-gallery').offsetHeight - sidebar.offsetHeight), pin: sidebar, pinSpacing: false, invalidateOnRefresh: true });
    gsap.to('.hero-copy', { y: 70, opacity: .35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
    gsap.fromTo('.frontera-photo', { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.frontera-section', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  });
  ScrollTrigger.refresh();
}

motionToggle.addEventListener('click', () => { motionEnabled = !motionEnabled; motionPreference = motionEnabled ? 'on' : 'off'; try { localStorage.setItem('marcos-motion', motionEnabled ? 'on' : 'off'); } catch {} initMotion(false); });
reducedMotion.addEventListener('change', event => { if (motionPreference === null) { motionEnabled = !event.matches; initMotion(false); } });
const projectObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { document.querySelectorAll('[data-index]').forEach(link => link.classList.toggle('is-active', link.dataset.index === entry.target.dataset.project)); } });
}, { rootMargin: '-25% 0px -40% 0px', threshold: 0 });
document.querySelectorAll('.project').forEach(project => projectObserver.observe(project));

const marquee = document.querySelector('.experience-strip');
marquee.addEventListener('pointerenter', () => marqueeTween?.pause());
marquee.addEventListener('pointerleave', () => marqueeTween?.resume());
document.addEventListener('visibilitychange', () => { if (document.hidden) marqueeTween?.pause(); else if (motionEnabled) marqueeTween?.resume(); });
initMotion();
window.addEventListener('load', () => { if (window.ScrollTrigger && motionEnabled) ScrollTrigger.refresh(); }, { once: true });
document.fonts.ready.then(() => { if (window.ScrollTrigger && motionEnabled) ScrollTrigger.refresh(); });
