(function () {
    const b = document.body, p = b.dataset.page, d = b.dataset.dash;
    document.querySelectorAll('img[data-u]').forEach(i => { i.src = 'assets/images/' + i.dataset.u + '.webp'; i.loading = 'lazy'; });
    if (d) {
        const m = d === 'admin' ? ['Overview', 'Users', 'Transactions'] : ['Overview', 'My Account', 'Transactions'];
        const who = d === 'admin' ? ['AD', 'Admin'] : ['SK', 'Sam K.'];
        const views = d === 'admin' ? ['overview', 'users', 'transactions'] : ['overview', 'account', 'transactions'];
        const email = sessionStorage.getItem('dashboardEmail');
        const username = email ? email.split('@')[0].split('+')[0].split(/[._-]+/).filter(Boolean) : [];
        const displayName = username.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
        const initials = username.length > 1
            ? username.slice(0, 2).map(part => part[0]).join('').toUpperCase()
            : (username[0] || who[0]).slice(0, 2).toUpperCase();
        b.insertAdjacentHTML('afterbegin', '<header class="dh"><button id="dm" aria-label="Open menu">☰</button><a class="logo" href="index.html"><img src="assets/logo/logo.webp" alt="Stackly" width="173" height="50"></a><div class="pf"><span class="av">' + who[0] + '</span><b>' + who[1] + '</b></div></header><div id="sc"></div><aside class="ds" id="ds" aria-label="Dashboard menu">' + m.map((x, i) => '<a href="' + (views[i] ? '#' + views[i] : '#') + '"' + (views[i] ? ' data-view-target="' + views[i] + '"' : '') + (i ? '' : ' class="on"') + '>' + x + '</a>').join('') + '<a href="index.html" class="out">Log out</a></aside>');
        if (displayName) {
            b.querySelector('.pf .av').textContent = initials;
            b.querySelector('.pf b').textContent = displayName;
            const profileName = b.querySelector('[data-profile-name]');
            if (profileName)
                profileName.textContent = displayName;
            const profileEmail = b.querySelector('[data-profile-email]');
            if (profileEmail)
                profileEmail.textContent = email;
            const greeting = b.querySelector('[data-profile-greeting]');
            if (greeting)
                greeting.textContent = displayName;
        }
    }
    else if (!document.getElementById('nav') && p !== '404') {
        const n = [['index', 'Home'], ['about', 'About'], ['services', 'Services'], ['blog', 'Blog'], ['contact', 'Contact']];
        b.insertAdjacentHTML('afterbegin', '<div id="prog"></div><nav id="nav"><div class="wrap nb"><a class="logo" href="index.html"><img src="assets/logo/logo.webp" alt="Stackly" width="173" height="50"></a><button id="burger" aria-label="Menu" aria-expanded="false">☰</button><div class="links" id="links"><div class="mid">' + n.map(x => '<a href="' + x[0] + '.html"' + (x[0] === p ? ' class="on"' : '') + '>' + x[1] + '</a>').join('') + '</div><a class="btn" href="login.html">Login</a></div></div></nav>');
        
    }
    if (window.gsap && window.ScrollTrigger && p !== 'home' && !d) {
        gsap.registerPlugin(ScrollTrigger);
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
            gsap.utils.toArray('.rv').forEach(e => gsap.from(e, { y: 40, opacity: 0, duration: .8, scrollTrigger: { trigger: e, start: 'top 90%' } }));
        gsap.utils.toArray('.cnt').forEach(c => { const o = { v: 0 }; ScrollTrigger.create({ trigger: c, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: +c.dataset.to, duration: 1.8, onUpdate: () => c.textContent = Math.round(o.v).toLocaleString() }) }); });
    }
    document.querySelectorAll('.xc').forEach(c => c.addEventListener('click', () => { const o = c.classList.contains('open'); c.parentElement.querySelectorAll('.xc').forEach(x => x.classList.remove('open')); if (!o)
        c.classList.add('open'); }));
    document.querySelectorAll('.pill').forEach(x => x.addEventListener('click', () => { document.querySelectorAll('.pill').forEach(y => y.classList.toggle('on', y === x)); document.querySelectorAll('[data-c]').forEach(a => a.hidden = x.dataset.f !== 'all' && a.dataset.c !== x.dataset.f); }));
})();
(function () { const s = document.createElement('script'); s.src = 'js/text.js'; document.body.appendChild(s); })();

['motion', 'cards', 'textfx', 'footer'].forEach(function (n) {
    var s = document.createElement('script');
    s.src = 'js/' + n + '.js';
    document.body.appendChild(s);
});

// Footer markup (every page except the dashboards)
(function () {
  if (document.body.dataset.dash || document.querySelector('footer')) return;
  const a = (h, t) => '<a href="' + h + '">' + t + '</a>';
  const nav = [['index', 'Home'], ['about', 'About'], ['services', 'Services'], ['blog', 'Blog'], ['contact', 'Contact']].map(x => a(x[0] + '.html', x[1])).join('');
  const svc = ['Digital payments', 'Expense management', 'Financial analytics', 'Investment tracking', 'Budget planning', ].map(t => a('404.html', t)).join('');
  const acc = a('login.html', 'Login') + a('create-account.html', 'Create account') + a('404.html', 'My dashboard') + a('404.html', 'Admin dashboard');
  const ic = {
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    in: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg>'
  };
  const soc = [['X', 'x'], ['LinkedIn', 'in'], ['Instagram', 'ig'], ['YouTube', 'yt']].map(s => '<a href="404.html" aria-label="' + s[0] + '">' + ic[s[1]] + '</a>').join('');
  const run = ['Secure payments', 'Smart analytics', 'Wealth insights', 'Digital banking', 'Expense management'].map(w => '<span>' + w + '</span>').join('');
  document.body.insertAdjacentHTML('beforeend',
    '<footer class="ft spot" aria-label="Site footer"><div class="ft-gridbg"></div><div class="ft-dots" aria-hidden="true"></div>' +
    '<div class="wrap"><section class="ft-cta"><svg class="ft-line" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true"><path pathLength="100" d="M0 100 C60 90 90 50 150 60 S240 110 300 70 S420 10 480 40 S560 20 600 8"/></svg>' +
    '<div class="ft-cta-in"><p class="ft-eyebrow">Get started today</p><h2 data-animation="word-reveal">Build a smarter financial future.</h2><p class="ft-sub" data-animation="fade-up">Open an account in under three minutes. No fees to start.</p></div>' +
    '<div class="ft-cta-btns"><a class="btn" href="create-account.html">Create account</a><a class="btn ghost" href="contact.html">Talk to us</a></div></section>' +
    '<div class="ft-main"><div class="ft-brand"><a class="flogo" href="index.html"><img src="assets/logo/logo.webp" alt="Stackly" width="173" height="50"></a>' +
    '<p data-animation="blur-reveal">Smarter payments, planning and insight for everyone. One calm workspace for every part of your money.</p><div class="ft-soc">' + soc + '</div><p class="ft-status"><span></span>All systems operational</p></div>' +
    '<nav class="ft-col" aria-label="Footer navigation"><h4 class="ft-h">Navigate</h4>' + nav + '</nav>' +
    '<nav class="ft-col" aria-label="Footer services"><h4 class="ft-h">Services</h4>' + svc + '</nav>' +
    '<nav class="ft-col" aria-label="Footer account"><h4 class="ft-h">Account</h4>' + acc + '</nav>' +
    '<div class="ft-col ft-contact"><h4 class="ft-h">Contact</h4><address>12 MG Road<br>Bengaluru, Karnataka 560001</address><a href="mailto:hr@stackly.com.com" target="_blank">hr@stackly.com.com</a><a href="tel:+918055550142" target="_blank">+91 80 5555 0142</a></div></div></div>' +
    '<div class="mq ft-mq" aria-hidden="true"><div class="mt">' + run + run + '</div></div>' +
    '<div class="wrap ft-bottom"><span>© 2026 Fintech Platform. All rights reserved.</span><span class="ft-legal"><a href="404.html">Privacy Policy</a><a href="404.html">Terms &amp; Conditions</a></span><button type="button" class="ft-top" aria-label="Back to top">↑</button></div></footer>');
})();
