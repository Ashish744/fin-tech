(function () {
    const R = {
        name: v => /^[A-Za-z]+$/.test(v.trim()),
        email: v => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v.trim()),
        pass: v => v.length >= 8
    };
    const MSG = { name: 'Please enter a valid name.', email: 'Please enter a valid email address.', pass: 'Password must be at least 8 characters.' };
    function mark(input, ok, msg) {
        const fd = input.closest('.fd'), e = fd.querySelector('.err');
        fd.classList.remove('bad', 'ok');
        void fd.offsetWidth;
        fd.classList.add(ok ? 'ok' : 'bad');
        e.textContent = ok ? '' : msg;
        input.setAttribute('aria-invalid', !ok);
        return ok;
    }
    function check(input) {
        const t = input.dataset.v, f = input.form;
        if (t === 'confirm')
            return mark(input, input.value.length > 0 && input.value === f.querySelector('[data-v=pass]').value, 'Passwords do not match.');
        if (t === 'terms')
            return mark(input, input.checked, 'Please accept the terms to continue.');
        return mark(input, R[t](input.value), MSG[t]);
    }
    document.querySelectorAll('form[data-validate]').forEach(f => {
        f.noValidate = true;
        const fields = [...f.querySelectorAll('[data-v]')];
        const choice = f.querySelector('[data-required-choice]');
        fields.forEach(i => i.addEventListener('blur', () => check(i)));
        fields.forEach(i => i.addEventListener('input', () => { if (i.closest('.fd').classList.contains('bad'))
            check(i); }));
        choice?.querySelectorAll('input[type=radio]').forEach(i => i.addEventListener('change', () => {
            if (choice.classList.contains('bad'))
                checkChoice();
        }));
        function checkChoice() {
            const selected = choice.querySelector('input[type=radio]:checked');
            choice.classList.toggle('bad', !selected);
            choice.classList.toggle('ok', !!selected);
            choice.querySelector('.err').textContent = selected ? '' : 'Please choose a dashboard.';
            choice.querySelectorAll('input[type=radio]').forEach(i => i.setAttribute('aria-invalid', !selected));
            return !!selected;
        }
        f.addEventListener('submit', e => {
            e.preventDefault();
            const ok = fields.map(check).every(Boolean) && (!choice || checkChoice());
            if (ok) {
                if (f.hasAttribute('data-role-redirect')) {
                    sessionStorage.setItem('dashboardEmail', f.querySelector('input[type=email]').value.trim());
                }
                const s = f.querySelector('.success');
                if (s) {
                    s.hidden = false;
                    s.textContent = f.dataset.success || 'Success!';
                }
                const destination = f.hasAttribute('data-role-redirect')
                    ? f.querySelector('[name=dashboard]:checked').value
                    : f.dataset.redirect;
                if (destination)
                    setTimeout(() => location.href = destination, 900);
            }
            else {
                const invalidField = fields.find(i => i.closest('.fd').classList.contains('bad'));
                if (invalidField)
                    invalidField.focus();
                else
                    choice?.querySelector('input[type=radio]')?.focus();
            }
        });
    });
    document.querySelectorAll('.eye').forEach(b => b.addEventListener('click', () => {
        const i = b.parentElement.querySelector('input'), show = i.type === 'password';
        i.type = show ? 'text' : 'password';
        b.classList.toggle('on', show);
        b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        b.textContent = show ? '🙈' : '👁';
    }));
})();
