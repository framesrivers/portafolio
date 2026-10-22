'use strict';

// Homepage scroll treatment for the case-study pages, which are rendered by the built React app.
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPreference = null;
  try { motionPreference = localStorage.getItem('marcos-motion'); } catch {}
  const motionEnabled = motionPreference ? motionPreference === 'on' : !reducedMotion.matches;
  document.documentElement.classList.toggle('motion-off', !motionEnabled);

  const progress = document.createElement('div');
  progress.className = 'case-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  function initMotion() {
    if (!motionEnabled || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .4 } });

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro.from('.linos-template-topline', { y: 10, opacity: 0, duration: .8 })
      .from('.linos-template-eyebrow', { y: 15, opacity: 0, duration: .8 }, .1)
      .from('.linos-template-hero h1', { yPercent: 30, opacity: 0, duration: 1.15 }, .15)
      .from('.linos-template-hero-side', { y: 24, opacity: 0, duration: .9 }, .45);

    gsap.utils.toArray('.linos-template-section-label, .linos-template-section > h2, .linos-template-lead, .linos-template-subsection, .linos-template-quotes').forEach(el => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    gsap.utils.toArray('.linos-template-image-block').forEach(el => {
      gsap.fromTo(el, { scale: .9, opacity: .7 }, { scale: 1, opacity: 1, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 55%', scrub: .7 } });
    });
    gsap.from('.linos-template-next-case a', { y: 50, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.linos-template-next-case', start: 'top 85%', once: true } });

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  // Wait for React to render the page before attaching motion.
  const root = document.getElementById('root');
  if (root.querySelector('.linos-template-hero')) { initMotion(); return; }
  const observer = new MutationObserver(() => {
    if (!root.querySelector('.linos-template-hero')) return;
    observer.disconnect();
    requestAnimationFrame(initMotion);
  });
  observer.observe(root, { childList: true, subtree: true });
})();
