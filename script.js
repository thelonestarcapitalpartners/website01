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
   FORM SUBMISSION
   ============================================================ */
const form    = document.getElementById('signupForm');
const formBtn = document.getElementById('formBtn');

if (form && formBtn) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const orig = formBtn.textContent;

    formBtn.textContent = "You're In — Welcome to the Network";
    formBtn.style.cssText = 'background:#16a34a;border-color:#16a34a;';
    formBtn.disabled = true;

    setTimeout(() => {
      formBtn.textContent = orig;
      formBtn.style.cssText = '';
      formBtn.disabled = false;
      form.reset();
    }, 4500);
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
