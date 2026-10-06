(function () {
    const $$ = s => [...document.querySelectorAll(s)], calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ds = document.getElementById('ds'), sc = document.getElementById('sc'), dm = document.getElementById('dm');
    const tg = o => {
        ds.classList.toggle('open', o);
        sc.classList.toggle('open', o);
        dm.setAttribute('aria-expanded', o);
        document.body.classList.toggle('menu-open', o);
    };
    dm.onclick = () => tg(!ds.classList.contains('open'));
    sc.onclick = () => tg(false);
    addEventListener('keydown', e => { if (e.key === 'Escape')
        tg(false); });
    $$('.ds a:not(.out)').forEach(a => a.addEventListener('click', e => {
        const view = a.dataset.viewTarget && document.querySelector('[data-view="' + a.dataset.viewTarget + '"]');
        e.preventDefault();
        $$('.ds a').forEach(x => x.classList.remove('on'));
        a.classList.add('on');
        if (view) {
            $$('.dashboard-view').forEach(section => { section.hidden = section !== view; });
        }
        tg(false);
        scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
    }));
    document.querySelector('.ds .out')?.addEventListener('click', () => sessionStorage.removeItem('dashboardEmail'));
    $$('.xd').forEach(c => c.addEventListener('click', () => c.classList.toggle('open')));
    const a = (t, v) => { if (window.gsap && !calm)
        gsap.to(t, v);
    else
        Object.assign(t.style || {}, {}); };
    $$('.bars').forEach(b => {
        b.dataset.b.split(',').forEach(v => {
            const i = document.createElement('i');
            b.appendChild(i);
            if (window.gsap && !calm)
                gsap.to(i, { height: v + '%', duration: 1, delay: .2, ease: 'power3.out' });
            else
                i.style.height = v + '%';
        });
    });
    $$('.ln').forEach(s => {
        const v = s.dataset.l.split(',').map(Number), m = Math.max(...v), n = v.length - 1;
        const d = v.map((y, i) => (i ? 'L' : 'M') + (i / n * 200).toFixed(1) + ' ' + (56 - y / m * 50).toFixed(1)).join(' ');
        s.setAttribute('viewBox', '0 0 200 60');
        s.setAttribute('preserveAspectRatio', 'none');
        s.innerHTML = '<path d="' + d + '"/>';
        const p = s.firstChild;
        if (window.gsap && !calm) {
            const L = p.getTotalLength();
            gsap.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.6 });
        }
    });
    $$('.bar i').forEach(i => { const w = i.dataset.w + '%'; if (window.gsap && !calm)
        gsap.to(i, { width: w, duration: 1.2, delay: .3 });
    else
        i.style.width = w; });
    $$('.cnt').forEach(c => {
        const o = { v: 0 }, to = +c.dataset.to;
        if (window.gsap && !calm)
            gsap.to(o, { v: to, duration: 1.6, onUpdate: () => c.textContent = Math.round(o.v).toLocaleString() });
        else
            c.textContent = to.toLocaleString();
    });
    if (window.gsap && !calm)
        gsap.from('.cd', { y: 24, opacity: 0, duration: .6, stagger: .05, ease: 'power2.out' });
})();
