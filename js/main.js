(function () {
    const nav = document.getElementById('nav'), b = document.getElementById('burger'), l = document.getElementById('links'), p = document.getElementById('prog');
    const on = () => {
        nav && nav.classList.toggle('s', scrollY > 10);
        if (p)
            p.style.transform = 'scaleX(' + (scrollY / (document.documentElement.scrollHeight - innerHeight || 1)) + ')';
    };
    addEventListener('scroll', on, { passive: true });
    on();
    if (b) {
        const toggleMenu = open => {
            l.classList.toggle('open', open);
            b.setAttribute('aria-expanded', open);
            document.body.classList.toggle('menu-open', open);
        };
        b.onclick = () => toggleMenu(!l.classList.contains('open'));
        l.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
        addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });
    }
    document.querySelectorAll('.spot').forEach(s => s.addEventListener('pointermove', e => {
        const r = s.getBoundingClientRect();
        s.style.setProperty('--mx', e.clientX - r.left + 'px');
        s.style.setProperty('--my', e.clientY - r.top + 'px');
    }));
    document.querySelectorAll('.flip').forEach(f => f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        f.classList.toggle('f');
    } }));
})();
