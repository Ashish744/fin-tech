(function () {
    if (typeof gsap === 'undefined')
        return;
    gsap.registerPlugin(ScrollTrigger);
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
    function hero() {
        document.dispatchEvent(new Event('go'));
        gsap.from('.rv', { y: 40, opacity: 0, duration: .9, stagger: .12, ease: 'power3.out' });
        gsap.from('.fc', { scale: .85, opacity: 0, y: 50, duration: 1, stagger: .15, delay: .3, ease: 'back.out(1.4)' });
        $$('.cnt').forEach(c => { const o = { v: 0 }; gsap.to(o, { v: +c.dataset.to, duration: 2, delay: .5, ease: 'power2.out', onUpdate: () => c.textContent = Math.round(o.v).toLocaleString() }); });
        const ch = $('#ch');
        if (ch) {
            const L = ch.getTotalLength();
            gsap.fromTo(ch, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 2, delay: .6 });
        }
        if (!calm)
            gsap.to('.fc', { y: '+=10', duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .4 });
        const st = $('#stage');
        if (st && !calm)
            addEventListener('pointermove', e => {
                const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
                $$('.fc').forEach(f => gsap.to(f, { x: x * +f.dataset.d, rotation: x * 3, duration: .8, overwrite: 'auto' }));
            });
    }
    function scroll() {
        gsap.to('#tlp', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#tl', start: 'top 70%', end: 'bottom 70%', scrub: true } });
        $$('.st').forEach((s, i) => gsap.from(s, { x: i % 2 ? 80 : -80, opacity: 0, scrollTrigger: { trigger: s, start: 'top 85%' } }));
        const t = $('#track');
        if (t)
            gsap.to(t, { x: () => -(t.scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: '#hs', start: 'top top', end: () => '+=' + (t.scrollWidth - innerWidth), pin: true, scrub: .6, invalidateOnRefresh: true } });
        $$('.fr').forEach(f => gsap.from(f, { y: 40, opacity: 0, scrollTrigger: { trigger: f, start: 'top 90%' } }));
        gsap.from('.cta', { scale: .92, opacity: 0, scrollTrigger: { trigger: '.cta', start: 'top 85%' } });
    }
    // Magnetic buttons
    if (!calm)
        $$('.mag').forEach(b => {
            b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .3 }); });
            b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.5)' }));
        });
    // Bento loader: index.html only (see loader.js)
    const ld = $('#loader');
    if (ld && document.body.dataset.page === 'home' && !calm && window.FTLoader) {
        document.body.style.overflow = 'hidden';
        window.FTLoader(ld, {
            reveal: () => { hero(); scroll(); },
            done: () => { ld.remove(); document.body.style.overflow = ''; ScrollTrigger.refresh(); }
        });
    }
    else {
        if (ld)
            ld.remove();
        hero();
        scroll();
    }
})();
