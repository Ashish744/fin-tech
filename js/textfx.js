/* Text + card animation engine. Elements are tagged with data-animation, then animated by type. */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const ST = window.ScrollTrigger;
  if (ST) gsap.registerPlugin(ST);
  const D = matchMedia('(max-width: 700px)').matches ? 0.5 : 1; // shorter movement on mobile
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const queue = [];

  // Run when scrolled into view (once). Hero items wait for the loader's "go" event.
  function when(el, fn, start) {
    try {
      if (el.closest('.hero2')) queue.push(fn);
      else if (ST) ST.create({ trigger: el, start: start || 'top 88%', once: true, onEnter: fn });
      else fn();
    } catch (e) { fn(); }
  }
  const A = (el, parts, from, to, start) => { gsap.set(parts, from); when(el, () => gsap.to(parts, to), start); };

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

  // ---------- Animation types (use with data-animation="...") ----------
  const H = {
    'char-reveal': el => A(el, split(el, 1), { opacity: 0, y: 30 * D, rotation: 6 }, { opacity: 1, y: 0, rotation: 0, duration: .7, stagger: .03, ease: 'power3.out' }),
    'word-reveal': el => A(el, split(el), { yPercent: 110 }, { yPercent: 0, duration: .8, stagger: .07, ease: 'power3.out' }),
    'clip-reveal': el => A(el, el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.inOut', clearProps: 'clipPath' }),
    'blur-reveal': el => A(el, el, { opacity: 0, filter: 'blur(12px)', y: 20 * D }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, ease: 'power2.out', clearProps: 'filter', delay: el.closest('.hero2') ? .6 : 0 }),
    'scale-reveal': el => A(el, el, { scale: .8, opacity: 0 }, { scale: 1, opacity: 1, duration: .8, ease: 'back.out(1.4)', clearProps: 'transform' }),
    'letter-reveal': el => A(el, split(el, 1), { opacity: 0, scale: .6, yPercent: 40 }, { opacity: 1, scale: 1, yPercent: 0, duration: .5, stagger: .04, ease: 'back.out(2)' }),
    'slide-right': el => A(el, el, { x: -80 * D, opacity: 0 }, { x: 0, opacity: 1, duration: .9, ease: 'power3.out', clearProps: 'transform' }),
    'slide-left': el => A(el, el, { x: 60 * D, opacity: 0 }, { x: 0, opacity: 1, duration: .8, ease: 'power3.out', delay: +el.dataset.d || 0, clearProps: 'transform' }),
    'rotate-reveal': el => A(el, el, { rotationX: -80 * D, opacity: 0, transformOrigin: '50% 100%', transformPerspective: 600 }, { rotationX: 0, opacity: 1, duration: 1, ease: 'power3.out', clearProps: 'transform' }),
    'mask-reveal': el => A(el, el, { clipPath: 'inset(100% 0 0 0)', y: 20 }, { clipPath: 'inset(0% 0 0 0)', y: 0, duration: .9, ease: 'power3.out', clearProps: 'clipPath,transform' }),
    'line-reveal': el => {
      const p = split(el), tops = [...new Set(p.map(s => Math.round(s.parentNode.offsetTop)))];
      A(el, p, { yPercent: 110 }, { yPercent: 0, duration: .8, ease: 'power3.out', delay: i => tops.indexOf(Math.round(p[i].parentNode.offsetTop)) * .14 });
    },
    'word-stagger': el => { el.classList.add('bl'); A(el, split(el), { opacity: 0, y: 14 * D }, { opacity: 1, y: 0, duration: .5, stagger: .025 }); },
    'fade-up': el => A(el, el, { y: 24 * D, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power2.out', clearProps: 'transform' }),
    'x-fade': el => A(el, el, { x: -30 * D, opacity: 0 }, { x: 0, opacity: 1, duration: .8, ease: 'power2.out', clearProps: 'transform' }),
    'char-light': el => { el.classList.add('bl'); A(el, split(el, 1), { opacity: 0 }, { opacity: 1, duration: .3, stagger: .012 }); },
    'letter-space': el => A(el, el, { letterSpacing: '.3em', opacity: 0 }, { letterSpacing: '-.03em', opacity: 1, duration: 1.2, ease: 'power3.out' })
  };

  // ---------- Tag the page (no HTML edits needed) ----------
  const tag = (els, name) => els.forEach(e => { if (!e.dataset.animation) e.dataset.animation = name; });
  const CARDS = '.post,.rc,.xc,.st,.hc,.cd,.flip,.fc,.step,.bn';
  const HEAD = ['char-reveal', 'word-reveal', 'clip-reveal', 'blur-reveal', 'scale-reveal', 'letter-reveal', 'slide-right', 'rotate-reveal', 'mask-reveal', 'line-reveal'];
  $$('h2').filter(h => !h.closest('.cta,.hs,' + CARDS)).forEach((h, i) => tag([h], HEAD[i % 10]));
  tag($$('.cta h2'), 'letter-space');
  tag($$('.hero2 .lead'), 'blur-reveal');
  const PARA = ['line-reveal', 'word-stagger', 'fade-up', 'blur-reveal', 'clip-reveal', 'x-fade', 'fade-up', 'char-light'];
  $$('main p, .auth p').filter(p => p.textContent.trim() && !p.closest(CARDS + ',details,.hero2,.cta') && !p.matches('.chip,.err,.success')).forEach((p, i) => {
    let k = PARA[i % 8];
    if (k === 'char-light' && p.textContent.length > 90) k = 'fade-up';
    tag([p], k);
  });
  tag($$('footer h4'), 'word-reveal');
  tag($$('footer .fg p'), 'line-reveal');
  tag($$('label'), 'slide-right');
  tag($$('th'), 'blur-reveal');
  tag($$('.chip, .hstats small, .hstats b'), 'fade-up');
  tag($$('.v, .stat'), 'scale-reveal');
  tag($$('.pf'), 'slide-left');
  $$('.ds a').forEach((a, i) => { a.dataset.d = i * .06; tag([a], 'slide-left'); });
  $$('[data-animation]').forEach(el => { try { H[el.dataset.animation](el); } catch (e) { console.warn('anim', e); } });

  // ---------- Buttons: label rises through a mask ----------
  $$('.btn').forEach(b => {
    if (b.children.length) return;
    b.innerHTML = '<span class="bt"><span class="bi">' + b.textContent.trim() + '</span></span>';
    A(b, b.querySelector('.bi'), { yPercent: 120 }, { yPercent: 0, duration: .7, ease: 'power3.out', clearProps: 'transform', delay: b.closest('.hero2') ? .9 : .1 });
  });

  // ---------- Cards: image, then title, description, button, each with its own motion ----------
  const TITLE = {
    up: [{ y: 30 * D, opacity: 0 }, { y: 0, opacity: 1 }],                                                   // services: slide up
    left: [{ x: -30 * D, opacity: 0 }, { x: 0, opacity: 1 }],                                               // blog: from the left
    scale: [{ scale: .9, opacity: 0 }, { scale: 1, opacity: 1 }],                                           // features: scale + fade
    blur: [{ filter: 'blur(10px)', opacity: 0 }, { filter: 'blur(0px)', opacity: 1, clearProps: 'filter' }] // dashboard: blur to sharp
  };
  $$('.rc,.post,.xc,.st,.hc,.flip,.dmain .cd,.step,.bn').forEach(c => {
    try {
      const img = c.querySelector('.ci img, .img img, .bn > img'), t = c.querySelector('h3, .ft, .cd > b, .cd > small'),
        lab = c.querySelector('.post small'), btn = c.querySelector('.btn'),
        ps = $$('p', c).filter(p => !p.closest('.more,.rc,.xc'));
      const v = c.matches('.rc') ? 'up' : c.matches('.post') ? 'left' : c.matches('.cd') ? 'blur' : 'scale', tf = TITLE[v];
      if (img) gsap.set(img, { scale: 1.25, clipPath: 'inset(0 0 100% 0)' });
      if (t) gsap.set(t, tf[0]);
      if (lab) gsap.set(lab, { x: -20 * D, opacity: 0 });
      if (ps.length) gsap.set(ps, { y: 16 * D, opacity: 0 });
      if (btn) gsap.set(btn, { y: 12, opacity: 0 });
      const play = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if (img) tl.to(img, { scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 1, clearProps: 'transform,clipPath' }, 0);
        if (lab) tl.to(lab, { x: 0, opacity: 1, duration: .5 }, .2);
        if (t) tl.to(t, Object.assign({ duration: .7 }, tf[1]), .25);
        if (ps.length) tl.to(ps, { y: 0, opacity: 1, duration: .6, stagger: .1 }, .4);
        if (btn) tl.to(btn, { y: 0, opacity: 1, duration: .5 }, .6);
      };
      const hs = c.matches('.hc') && document.getElementById('hs');
      when(hs || c, play, hs ? 'top 65%' : 'top 88%');
    } catch (e) { console.warn('card anim', e); }
  });

  if (loaderPresent()) document.addEventListener('go', () => queue.forEach(fn => fn()), { once: true });
  else queue.forEach(fn => fn());
  function loaderPresent() { return !!document.getElementById('loader'); }
  if (ST) addEventListener('load', () => ST.refresh());
})();
