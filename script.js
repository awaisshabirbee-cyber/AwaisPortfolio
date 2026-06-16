/* =========================================
   Awais Shabir — Portfolio Scripts
   ========================================= */
(() => {
  'use strict';

  // ===== Year =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Sticky navbar =====
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    document.getElementById('backToTop').classList.toggle('show', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ===== Mobile menu =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    })
  );

  // ===== Active nav highlight on scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  const setActive = () => {
    const y = window.scrollY + 120;
    sections.forEach(sec => {
      if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        const id = sec.getAttribute('id');
        navAnchors.forEach(n => n.classList.toggle('active', n.getAttribute('href') === `#${id}`));
      }
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });

  // ===== Theme toggle =====
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const stored = localStorage.getItem('theme');
  if (stored === 'light') { document.body.classList.add('light'); themeIcon.className = 'fa-solid fa-sun'; }
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // ===== Typing animation =====
  const typedEl = document.getElementById('typedText');
  const phrases = [
    'Digital Solutions Specialist',
    'GoHighLevel Expert',
    'Canva Designer',
    'eBay Account Manager',
    'Social Media Manager',
    'Automation Builder'
  ];
  let pi = 0, ci = 0, deleting = false;
  const type = () => {
    const word = phrases[pi];
    typedEl.textContent = word.substring(0, ci);
    if (!deleting && ci < word.length) { ci++; setTimeout(type, 90); }
    else if (deleting && ci > 0) { ci--; setTimeout(type, 45); }
    else {
      if (!deleting) { deleting = true; setTimeout(type, 1400); }
      else { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 250); }
    }
  };
  type();

  // ===== Reveal on scroll =====
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObs.observe(el));

  // ===== Skill bars =====
  const bars = document.querySelectorAll('.fill');
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barObs.observe(b));

  // ===== Counters =====
  const counters = document.querySelectorAll('.counter');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      let cur = 0;
      const step = Math.max(1, Math.floor(target / 60));
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target; }
        else { el.textContent = cur; requestAnimationFrame(tick); }
      };
      tick();
      countObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => countObs.observe(c));

  // ===== Portfolio filter =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => {
      const match = f === 'all' || c.dataset.category === f;
      c.classList.toggle('hide', !match);
    });
  }));

  // ===== Testimonial slider =====
  const track = document.getElementById('testimonialTrack');
  const slides = track ? track.children.length : 0;
  const dotsWrap = document.getElementById('tDots');
  let idx = 0;
  if (slides) {
    for (let i = 0; i < slides; i++) {
      const d = document.createElement('span');
      if (i === 0) d.classList.add('active');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
    const goTo = (n) => {
      idx = (n + slides) % slides;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dotsWrap.querySelectorAll('span').forEach((d, i) => d.classList.toggle('active', i === idx));
    };
    document.getElementById('tPrev').addEventListener('click', () => goTo(idx - 1));
    document.getElementById('tNext').addEventListener('click', () => goTo(idx + 1));
    setInterval(() => goTo(idx + 1), 6000);
  }

  // ===== Back to top =====
  document.getElementById('backToTop').addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  // ===== Contact form validation =====
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const showError = (input, msg) => {
    const err = input.parentElement.querySelector('.error');
    if (err) err.textContent = msg || '';
    input.style.borderColor = msg ? '#ef4444' : '';
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const name = form.name, email = form.email, phone = form.phone, service = form.service, message = form.message;

    if (name.value.trim().length < 2) { showError(name, 'Please enter your name'); valid = false; } else showError(name, '');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!emailOk) { showError(email, 'Enter a valid email'); valid = false; } else showError(email, '');
    if (phone.value && phone.value.replace(/\D/g,'').length < 6) { showError(phone, 'Enter a valid phone'); valid = false; } else showError(phone, '');
    if (!service.value) { showError(service, 'Please select a service'); valid = false; } else showError(service, '');
    if (message.value.trim().length < 10) { showError(message, 'Message must be at least 10 characters'); valid = false; } else showError(message, '');

    if (valid) {
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 4500);
    }
  });
})();
