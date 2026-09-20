/* ============================================================
   Portfolio interactions
   ============================================================ */
(function () {
    'use strict';

    const root = document.documentElement;

    /* ---------- Theme toggle (persisted) ---------- */
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) root.setAttribute('data-theme', savedTheme);
    setToggleIcon(root.getAttribute('data-theme'));

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            setToggleIcon(next);
        });
    }

    function setToggleIcon(theme) {
        if (!themeToggle) return;
        themeToggle.innerHTML = theme === 'dark'
            ? '<i class="bi bi-moon-stars-fill"></i>'
            : '<i class="bi bi-brightness-high-fill"></i>';
    }

    /* ---------- Typewriter effect ---------- */
    const typeTarget = document.getElementById('typewriter');
    const phrases = [
        'Aspiring Software Engineer',
        'Backend Developer',
        'Full-Stack Developer',
        'Problem Solver'
    ];
    if (typeTarget) {
        let pIndex = 0, cIndex = 0, deleting = false;

        function type() {
            const current = phrases[pIndex];
            typeTarget.textContent = deleting
                ? current.substring(0, cIndex--)
                : current.substring(0, cIndex++);

            let delay = deleting ? 45 : 90;

            if (!deleting && cIndex === current.length + 1) {
                deleting = true;
                delay = 1600; // pause at full word
            } else if (deleting && cIndex < 0) {
                deleting = false;
                cIndex = 0;
                pIndex = (pIndex + 1) % phrases.length;
                delay = 300;
            }
            setTimeout(type, delay);
        }
        type();
    }

    /* ---------- Navbar background on scroll + progress bar ---------- */
    const nav = document.getElementById('siteNav');
    const progress = document.getElementById('scrollProgress');
    const scrollTopBtn = document.getElementById('scrollTop');

    function onScroll() {
        const y = window.scrollY;
        if (nav) nav.classList.toggle('scrolled', y > 30);
        if (scrollTopBtn) scrollTopBtn.classList.toggle('show', y > 400);
        if (progress) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = h > 0 ? (y / h) * 100 + '%' : '0%';
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Scroll reveal + skill bars via IntersectionObserver ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.querySelectorAll('.skill-fill').forEach(function (fill) {
                    fill.style.width = (fill.getAttribute('data-level') || 0) + '%';
                });
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });

    /* ---------- Active nav link highlight ---------- */
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.site-nav .nav-link');
    const spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { spy.observe(s); });

    /* ---------- Close mobile menu after clicking a link ---------- */
    const collapseEl = document.getElementById('navMenu');
    document.querySelectorAll('#navMenu .nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            if (collapseEl && collapseEl.classList.contains('show') && window.bootstrap) {
                const instance = window.bootstrap.Collapse.getOrCreateInstance(collapseEl);
                instance.hide();
            }
        });
    });
})();
