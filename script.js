/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

/* ============================================================
   NAVIGATION — sticky + hamburger
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  progressBar.style.width = (pct * 100) + '%';
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ============================================================
   SMOOTH SCROLL — offset for fixed nav
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 78;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   INTERSECTION OBSERVER — fade-in animations
   ============================================================ */
const animObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger children within the same parent
    const siblings = Array.from(
      entry.target.parentElement.querySelectorAll('[data-animate]')
    );
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), idx * 110);
    animObs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '-30px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => animObs.observe(el));

/* ============================================================
   PROGRESS BAR ANIMATIONS — trigger on card visibility
   ============================================================ */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.progress-fill').forEach(fill => {
      const target = fill.getAttribute('data-width') + '%';
      requestAnimationFrame(() => {
        setTimeout(() => { fill.style.width = target; }, 250);
      });
    });
    barObs.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.project-card').forEach(c => barObs.observe(c));

/* ============================================================
   FORM SUBMISSION — Web3Forms
   ============================================================ */
const form    = document.getElementById('signupForm');
const formBtn = document.getElementById('formBtn');

const WEB3FORMS_KEY = '95b2c17b-007d-4f9f-b814-bab04e6efbf5';

if (form && formBtn) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const orig = formBtn.textContent;
    formBtn.textContent = 'Sending…';
    formBtn.disabled = true;

    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: 'New Investor Signup — Lone Star Capital Partners',
      from_name: 'Lone Star Capital Partners Website',
      name:     form.querySelector('[name="name"]').value,
      email:    form.querySelector('[name="email"]').value,
      phone:    form.querySelector('[name="phone"]').value,
      interest: form.querySelector('[name="interest"]').value,
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        formBtn.textContent = "You're In — Welcome to the Network";
        formBtn.style.cssText = 'background:#16a34a;border-color:#16a34a;color:#fff;';
        setTimeout(() => {
          formBtn.textContent = orig;
          formBtn.style.cssText = '';
          formBtn.disabled = false;
          form.reset();
        }, 4500);
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch {
      formBtn.textContent = 'Something went wrong — try again';
      formBtn.style.cssText = 'background:#dc2626;border-color:#dc2626;color:#fff;';
      setTimeout(() => {
        formBtn.textContent = orig;
        formBtn.style.cssText = '';
        formBtn.disabled = false;
      }, 3500);
    }
  });
}

/* ============================================================
   ACTIVE NAV LINK — highlight current section
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + entry.target.id
        ? 'rgba(255,255,255,1)'
        : '';
    });
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObs.observe(s));
