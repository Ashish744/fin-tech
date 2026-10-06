(function () {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = matchMedia('(max-width: 700px)').matches ? 0.5 : 1; // shorter distances on mobile
  const hasLoader = !!document.getElementById('loader');
  if (calm || !window.gsap) return;
  const ST = window.ScrollTrigger;
  if (ST) gsap.registerPlugin(ST);
  const $$ = s => [...document.querySelectorAll(s)];
  const queue = [];

  // Play when scrolled into view (once). Hero items wait for the loader.
  const when = (el, fn) => {
    if (el.closest('.hero2')) queue.push(fn);
    else if (ST) ST.create({ trigger: el, start: 'top 88%', once: true, onEnter: fn });
    else fn();
  };
  const A = (el, parts, from, to) => { gsap.set(parts, from); when(el, () => gsap.to(parts, to)); };

  function split(el, chars) {
    const out = [];
    el.setAttribute('aria-label', el.textContent.trim());
    (function walk(n) {
      [...n.childNodes].forEach(c => {
        if (c.nodeType === 3) {
          const f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(t => {
            if (!t.trim()) { f.append(t); return; }
            const w = document.createElement('span');
            w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            if (chars) [...t].forEach(ch => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; w.append(s); out.push(s); });
            else { const s = document.createElement('span'); s.className = 'wi'; s.textContent = t; w.append(s); out.push(s); }
            f.append(w);
          });
          c.replaceWith(f);
        } else if (c.nodeType === 1 && c.id !== 'tw') walk(c);
      });
    })(el);
    return out;
  }

  // ---- Ten different heading animations, cycled per section ----
  const V = [
    h => { const p = split(h, 0); A(h, p, { yPercent: 110 }, { yPercent: 0, duration: .8, stagger: .07, ease: 'power3.out' }); },              // words rise from below
    h => A(h, h, { x: -90 * D, opacity: 0 }, { x: 0, opacity: 1, duration: .9, ease: 'power3.out' }),                                           // slides in horizontally
    h => A(h, h, { filter: 'blur(14px)', opacity: 0 }, { filter: 'blur(0px)', opacity: 1, duration: 1, clearProps: 'filter' }),                // blur to sharp
    h => { const p = split(h, 1); A(h, p, { opacity: 0, y: 14 * D }, { opacity: 1, y: 0, duration: .4, stagger: .03 }); },                     // characters one by one
    h => A(h, h, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.inOut', clearProps: 'clipPath' }), // mask reveal
    h => A(h, h, { scale: .8, opacity: 0, transformOrigin: '0 50%' }, { scale: 1, opacity: 1, duration: .9, ease: 'back.out(1.4)' }),           // scale 0.8 to 1
    h => A(h, h, { rotation: 4, y: 30 * D, opacity: 0, transformOrigin: '0 100%' }, { rotation: 0, y: 0, opacity: 1, duration: .9, ease: 'power3.out' }), // rotates into place
    h => { h.classList.add('gt'); A(h, h, { opacity: 0, y: 20 * D }, { opacity: 1, y: 0, duration: .8 }); },                                    // moving gradient text
    h => { const p = split(h, 0); A(h, p, { x: i => (i % 2 ? 40 : -40) * D, opacity: 0 }, { x: 0, opacity: 1, duration: .7, stagger: .08, ease: 'power2.out' }); }, // staggered words from both sides
    h => A(h, h, { y: 40 * D, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power2.out' })                                             // fade + upward
  ];
  [].filter(h => !h.closest('.cta,.hs')).forEach((h, i) => V[i % V.length](h));

  // ---- Paragraphs: three subtle styles ----
  [].filter(l => !l.closest('details,.xc,.more,.flip')).forEach((l, i) => {
    const k = i % 3, hero = l.closest('.hero2');
    if (k === 1) { A(l, l, { y: 20 * D, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power2.out' }); return; }
    l.classList.add('bl');
    const p = split(l, 0);
    if (k === 0) A(l, p, { opacity: 0, y: 10, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6, stagger: .018, clearProps: 'filter', delay: hero ? .5 : 0 });
    else A(l, p, { opacity: 0, y: 16 * D }, { opacity: 1, y: 0, duration: .5, stagger: .02 });
  });

  // ---- Navbar entrance: logo, then links in turn, CTA last ----
  const navIn = () => {
    gsap.from('.logo', { x: -30, opacity: 0, duration: .8, ease: 'power3.out' });
  };
  queue.push(navIn);

  // ---- Button scale on hover (works with the magnetic effect) ----
  $$('.mag').forEach(b => {
    b.addEventListener('pointerenter', () => gsap.to(b, { scale: 1.06, duration: .3 }));
    b.addEventListener('pointerleave', () => gsap.to(b, { scale: 1, duration: .4 }));
  });

  // ---- Page transitions: CSS curtain (see motion.css). Slides over the page, then navigates. ----
  const root = document.documentElement;
  setTimeout(() => root.classList.remove('pt-in'), 1600);
  addEventListener('pageshow', e => { if (e.persisted) root.classList.remove('pt-out', 'pt-in'); });
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute('download')) return;
    const href = a.getAttribute('href') || '';
    if (!href || href[0] === '#') return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || !/\.html?$/.test(u.pathname)) return;
    e.preventDefault();
    try { sessionStorage.setItem('pt', '1'); } catch (err) { /* storage blocked: skip the enter curtain */ }
    root.classList.add('pt-out');
    setTimeout(() => { location.href = a.href; }, 600);
    setTimeout(() => root.classList.remove('pt-out'), 3000); // safety net if navigation is blocked
  });

  if (hasLoader) document.addEventListener('go', () => queue.forEach(fn => fn()), { once: true });
  else queue.forEach(fn => fn());
  if (ST) addEventListener('load', () => ST.refresh());
})();
