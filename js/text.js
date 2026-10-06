(function () {
    const tw = document.getElementById('tw'), calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm || !window.gsap) {
        if (tw)
            tw.textContent = 'payments';
        return;
    }
    const ST = window.ScrollTrigger;
    if (ST)
        gsap.registerPlugin(ST);
    const queue = [];
    const when = (el, fn) => { if (el.closest('.hero2'))
        queue.push(fn);
    else if (ST)
        ST.create({ trigger: el, start: 'top 88%', once: true, onEnter: fn });
    else
        fn(); };
    const A = (el, parts, from, to) => { gsap.set(parts, from); when(el, () => gsap.to(parts, to)); };
    function split(el, chars) {
        const out = [];
        el.setAttribute('aria-label', el.textContent.trim());
        (function walk(n) {
            [...n.childNodes].forEach(c => {
                if (c.nodeType === 3) {
                    const f = document.createDocumentFragment();
                    c.textContent.split(/(\s+)/).forEach(t => {
                        if (!t.trim()) {
                            f.append(t);
                            return;
                        }
                        const w = document.createElement('span');
                        w.className = 'w';
                        w.setAttribute('aria-hidden', 'true');
                        if (chars)
                            [...t].forEach(ch => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; w.append(s); out.push(s); });
                        else {
                            const s = document.createElement('span');
                            s.className = 'wi';
                            s.textContent = t;
                            w.append(s);
                            out.push(s);
                        }
                        f.append(w);
                    });
                    c.replaceWith(f);
                }
                else if (c.nodeType === 1)
                    walk(c);
            });
        })(el);
        return out;
    }
    // 1. Headlines (h1): characters rise in, dashboards get a typed fade
    document.querySelectorAll('h1').forEach(h => {
        if (h.closest('.nf'))
            return;
        const p = split(h, true);
        if (h.closest('.dmain'))
            A(h, p, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: .4, stagger: .03 });
        else
            A(h, p, { yPercent: 110, rotate: 6, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: .9, stagger: .025, ease: 'power4.out' });
    });
    // 2. Section titles (h2): words slide up through a mask
    [].forEach(h => {
        if (h.closest('.cta'))
            return;
        const p = split(h, false);
        A(h, p, { yPercent: 110 }, { yPercent: 0, duration: .8, stagger: .07, ease: 'power3.out' });
    });
    // 3. Body copy (.lead): words fade in from a blur
    [].forEach(l => {
        if (l.closest('details,.xc,.more,.flip') || l.querySelector('#tw'))
            return;
        l.classList.add('bl');
        const p = split(l, false);
        A(l, p, { opacity: 0, y: 10, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6, stagger: .018, clearProps: 'filter' });
    });
    // 4. Card titles (h3): scramble-decode on hover or focus
    const SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%';
    function scr(el) {
        const t = el.dataset.t || (el.dataset.t = el.textContent);
        let i = 0;
        clearInterval(el._i);
        el._i = setInterval(() => {
            el.textContent = [...t].map((c, k) => k < i || c === ' ' ? c : SET[Math.random() * SET.length | 0]).join('');
            if (i++ >= t.length) {
                clearInterval(el._i);
                el.textContent = t;
            }
        }, 35);
    }
    document.querySelectorAll('h3').forEach(h => {
        const p = h.closest('article,.xc,.st,.hc,.post,.rc') || h;
        p.addEventListener('mouseenter', () => scr(h));
        p.addEventListener('focusin', () => scr(h));
    });
    // 5. Footer wordmark: letters burst out from the centre
    document.querySelectorAll('footer .big').forEach(b => {
        const p = split(b, true);
        A(b, p, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: { each: .04, from: 'center' }, ease: 'power3.out' });
    });
    // 6. Hero: rotating typewriter word
    function type() {
        const W = ['payments', 'savings', 'investments', 'budgets'];
        let w = 0, c = 0, d = false;
        (function t() {
            const s = W[w];
            c += d ? -1 : 1;
            tw.textContent = s.slice(0, c);
            let ms = d ? 40 : 85;
            if (!d && c === s.length) {
                d = true;
                ms = 1500;
            }
            else if (d && c === 0) {
                d = false;
                w = (w + 1) % W.length;
                ms = 300;
            }
            setTimeout(t, ms);
        })();
    }
    if (tw)
        queue.push(type);
    if (document.getElementById('loader'))
        document.addEventListener('go', () => queue.forEach(f => f()), { once: true });
    else
        queue.forEach(f => f());
    if (ST)
        ST.refresh();
})();
