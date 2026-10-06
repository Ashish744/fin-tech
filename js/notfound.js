(function () {
  const h = document.getElementById('n');
  if (!h) return;
  h.setAttribute('aria-label', '404');
  h.innerHTML = [...'404'].map(c => '<span class="d" aria-hidden="true">' + c + '</span>').join('');
  if (!window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Each digit: big scale + blur-to-sharp + 3D flip, one after another
  gsap.from('.nf .d', { scale: 2.4, opacity: 0, filter: 'blur(18px)', rotationY: 90, yPercent: -30, duration: 1.1, stagger: .18, ease: 'power4.out', clearProps: 'filter' });
  gsap.from('.nf .lead', { y: 20, opacity: 0, filter: 'blur(10px)', duration: .9, delay: .9, clearProps: 'filter' });
  gsap.from('.nf .btn', { y: 24, opacity: 0, duration: .7, stagger: .12, delay: 1.1 });

  // Brief glitch every few seconds
  setInterval(() => { h.classList.add('glitch'); setTimeout(() => h.classList.remove('glitch'), 260); }, 3200);

  // Floating background orbs
  gsap.utils.toArray('.orb').forEach((o, i) => gsap.to(o, { x: gsap.utils.random(-50, 50), y: gsap.utils.random(-60, 60), duration: 3 + i, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
})();
