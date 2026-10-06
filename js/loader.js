/* Bento preloader. Called from animations.js on index.html only. */
window.FTLoader = function (ld, cb) {
  const q = s => ld.querySelector(s), qa = s => [...ld.querySelectorAll(s)];
  const tiles = qa('.tile'), core = q('.core'), logo = q('.core img');
  const pct = q('#pct'), pbar = q('#pbar'), msg = q('#pmsg'), ring = q('.rg'), ringTxt = q('.ring b'), bal = q('#bal');
  const P = { v: 0 };
  const STEPS = [[0, 'Connecting your accounts'], [30, 'Syncing transactions'], [62, 'Securing your data'], [92, 'Ready to go']];
  let step = -1;

  // ---- Starting states ----
  gsap.set(tiles, { scale: .6, opacity: 0, y: 40, rotation: () => gsap.utils.random(-8, 8) });
  gsap.set(core, { scale: .85, opacity: 0, filter: 'blur(14px)' });
  gsap.set(logo, { y: 20, opacity: 0 });

  // ---- Looping mini animations inside the tiles ----
  gsap.fromTo(qa('.bars-m i'), { scaleY: .15 }, { scaleY: 1, duration: .9, stagger: .1, ease: 'back.out(1.6)', repeat: -1, repeatDelay: .6, yoyo: true });
  const path = q('.spark path'), L = path.getTotalLength();
  gsap.set(path, { strokeDasharray: L, strokeDashoffset: L });
  gsap.to(path, { strokeDashoffset: 0, duration: 1.4, repeat: -1, repeatDelay: .6, ease: 'power2.inOut' });
  gsap.to(q('.cc'), { y: -8, rotation: 3, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to(q('.coin'), { rotationY: 360, duration: 2.2, repeat: -1, ease: 'none', transformPerspective: 400 });
  gsap.to(qa('.dots i'), { scale: .35, opacity: .5, duration: .6, stagger: { each: .08, from: 'center', grid: [4, 3] }, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.fromTo(qa('.rows i'), { scaleX: .2 }, { scaleX: 1, duration: 1, stagger: .2, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  // ---- Progress: counter, bar, ring, balance and status text all follow one value ----
  function swap(text) {
    gsap.timeline()
      .to(msg, { yPercent: -100, opacity: 0, duration: .18, onComplete: () => { msg.textContent = text; } })
      .fromTo(msg, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .28, ease: 'power2.out' });
  }
  function update() {
    const v = P.v;
    pct.textContent = Math.round(v);
    pbar.style.transform = 'scaleX(' + v / 100 + ')';
    ring.style.strokeDashoffset = 264 * (1 - v / 100);
    ringTxt.textContent = Math.round(v) + '%';
    bal.textContent = '$' + Math.round(84250 * v / 100).toLocaleString();
    let k = 0;
    STEPS.forEach((s, i) => { if (v >= s[0]) k = i; });
    if (k !== step) { step = k; swap(STEPS[k][1]); }
  }

  // Direction each tile flies when the loader exits (away from the centre tile)
  const away = el => {
    const c = core.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: (r.left + r.width / 2 - c.left - c.width / 2) * 1.2, y: (r.top + r.height / 2 - c.top - c.height / 2) * 1.2 };
  };

  // ---- Timeline: build in, count up, burst out, lift away ----
  gsap.timeline()
    .to(core, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: .9, ease: 'power3.out' })
    .to(logo, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' }, .3)
    .to(tiles, { scale: 1, opacity: 1, y: 0, rotation: 0, duration: .8, ease: 'back.out(1.6)', stagger: { each: .08, from: 'random' } }, .15)
    .to(P, { v: 100, duration: 3.2, ease: 'power1.inOut', onUpdate: update }, .5)
    .to(core, { scale: 1.06, duration: .22, yoyo: true, repeat: 1, ease: 'power2.inOut' })
    .to(tiles, { x: (i, el) => away(el).x, y: (i, el) => away(el).y, scale: .5, opacity: 0, rotation: () => gsap.utils.random(-14, 14), duration: .8, ease: 'power3.in', stagger: { each: .04, from: 'center' } })
    .to(core, { scale: 1.12, opacity: 0, duration: .5, ease: 'power2.in' }, '<+=.2')
    .add(cb.reveal)
    .to(ld, { yPercent: -100, duration: .9, ease: 'power4.inOut', onComplete: cb.done }, '<+=.15');
};
