(function () {
  const U = n => 'assets/images/home' + n + '.webp';
  const IMG = {
    pay: 5, chart: 2, calc: 1,
    dash: 2, lap: 7, team: 6,
    coin: 4, cash: 8, card: 1
  };
  // Pick a relevant photo from the card title
  const MAP = [
    [/secur|fraud|privacy|monitor/i, 'card'], [/pay|transfer|speed/i, 'pay'], [/invest|wealth|grow|portfolio/i, 'chart'],
    [/budget|expense|categor|clarity/i, 'calc'], [/analytic|report|insight|plan|connect/i, 'dash'],
    [/goal|saving|fair/i, 'coin'], [/starter|business/i, 'cash'], [/./, 'team']
  ];
  const pick = t => IMG[(MAP.find(m => m[0].test(t)) || MAP[MAP.length - 1])[1]];
  const title = n => (n.querySelector('h3') || n).textContent.trim();

  // Image area on text-only cards: horizontal-scroll, expandable and timeline cards
  document.querySelectorAll('.hc, .xc, .st').forEach(c => {
    const ci = document.createElement('div');
    ci.className = 'ci';
    ci.innerHTML = '<img src="' + U(pick(title(c))) + '" alt="" loading="lazy">';
    const tx = document.createElement('div');
    tx.className = 'tx';
    tx.append(...c.childNodes);
    c.append(ci, tx);
    c.classList.add('ic');
  });

  // Flip-card fronts: full-bleed photo behind the title
  document.querySelectorAll('.fr').forEach(f => {
    const t = f.textContent.trim();
    f.innerHTML = '<img class="bgi" src="' + U(pick(t)) + '" alt="" loading="lazy"><span class="ft">' + t + '</span>';
  });

  // Dashboard cards: banner image on the balance and investment cards
  document.querySelectorAll('.dmain .xd, .dmain .hero-b').forEach(card => {
    const ci = document.createElement('div');
    ci.className = 'ci';
    ci.innerHTML = '<img src="' + U(card.matches('.hero-b') ? 1 : 2) + '" alt="">';
    card.prepend(ci);
  });

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ST = window.ScrollTrigger;
  if (calm || !window.gsap || !ST) return;
  gsap.registerPlugin(ST);
  const D = matchMedia('(max-width: 700px)').matches ? 0.5 : 1;

  // Different entrance per card group
  const B = (sel, from, to) => {
    const els = [...document.querySelectorAll(sel)];
    if (!els.length) return;
    gsap.set(els, from);
    ST.batch(els, { start: 'top 90%', once: true, onEnter: b => gsap.to(b, to) });
  };
  B('.post', { y: 50 * D, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .1, ease: 'power2.out' });              // fade + slide up
  B('.flip', { scale: .85, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, stagger: .1, ease: 'back.out(1.3)' });       // scale in
  B('.rc', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .9, stagger: .12, ease: 'power3.inOut', clearProps: 'clipPath' }); // clip reveal
  B('.xc', { x: -40 * D, opacity: 0 }, { x: 0, opacity: 1, duration: .7, stagger: .12, ease: 'power2.out' });               // left to right

  // 3D tilt on hover for blog and timeline cards (desktop only)
  if (matchMedia('(hover: hover)').matches && D === 1) {
    document.querySelectorAll('.post, .st').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        gsap.to(c, { rotationY: x * 8, rotationX: -y * 8, transformPerspective: 800, duration: .4, overwrite: 'auto' });
      });
      c.addEventListener('pointerleave', () => gsap.to(c, { rotationX: 0, rotationY: 0, duration: .6 }));
    });
  }
})();
