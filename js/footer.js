/* Footer behaviour and animation (markup is built in layout.js). */
(function () {
  const f = document.querySelector('footer.ft');
  if (!f) return;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = matchMedia('(max-width: 700px)').matches ? 0.5 : 1;

  // Rising particles (CSS-animated, transform + opacity only)
  const box = f.querySelector('.ft-dots');
  for (let i = 0; i < 18; i++) {
    const d = document.createElement('i'), s = 2 + Math.random() * 4;
    d.style.cssText = 'left:' + Math.random() * 100 + '%;width:' + s + 'px;height:' + s + 'px;animation-duration:' + (8 + Math.random() * 10) + 's;animation-delay:-' + Math.random() * 12 + 's';
    box.appendChild(d);
  }

  // Back to top
  f.querySelector('.ft-top').addEventListener('click', () => scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }));

  if (calm || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // 1. CTA panel rises and scales in
  const cta = f.querySelector('.ft-cta');
  gsap.set(cta, { y: 60 * D, opacity: 0, scale: .96 });
  ScrollTrigger.create({ trigger: cta, start: 'top 92%', once: true,
    onEnter: () => gsap.to(cta, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', clearProps: 'transform' }) });

  // 2. Link columns stagger up, then their links slide in, then the social icons pop
  const cols = f.querySelectorAll('.ft-brand, .ft-col');
  gsap.set(cols, { y: 40 * D, opacity: 0 });
  ScrollTrigger.create({ trigger: f.querySelector('.ft-main'), start: 'top 90%', once: true,
    onEnter: () => {
      gsap.to(cols, { y: 0, opacity: 1, duration: .8, stagger: .12, ease: 'power3.out', clearProps: 'transform' });
      gsap.from(f.querySelectorAll('.ft-col a'), { x: -14, opacity: 0, duration: .5, stagger: .04, delay: .3, clearProps: 'transform' });
      gsap.from(f.querySelector('.flogo'), { scale: .85, rotation: -4, opacity: 0, duration: .8, ease: 'back.out(1.8)', clearProps: 'transform' });
      gsap.from(f.querySelectorAll('.ft-soc a'), { scale: 0, duration: .6, stagger: .1, delay: .5, ease: 'back.out(2.5)', clearProps: 'transform' });
    } });

  // 3. Bottom bar fades in after the ticker
  const bar = f.querySelectorAll('.ft-bottom > *');
  gsap.set(bar, { opacity: 0, y: 14 });
  ScrollTrigger.create({ trigger: f.querySelector('.ft-bottom'), start: 'top 98%', once: true,
    onEnter: () => gsap.to(bar, { opacity: 1, y: 0, duration: .6, stagger: .15, clearProps: 'transform' }) });
})();
