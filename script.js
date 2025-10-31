// script.js — shared behavior for all pages
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (if loaded)
  if (window.AOS) {
    AOS.init({ duration: 900, once: true });
  }

  // NAV active link highlight
  document.querySelectorAll('.nav-link').forEach(a => {
    if (
      a.href === window.location.href ||
      (window.location.pathname.endsWith('index.html') && a.getAttribute('href') === 'index.html')
    ) {
      a.classList.add('active');
    }
  });

  // PORTFOLIO FILTERS
  const filterButtons = document.querySelectorAll('.filter-btn');
  const videoCards = document.querySelectorAll('.video-card');
  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const active = document.querySelector('.filter-btn.active');
        if (active) active.classList.remove('active');
        btn.classList.add('active');
        const cat = btn.dataset.category;
        videoCards.forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.category === cat) ? 'block' : 'none';
        });
        setTimeout(() => { if (window.AOS) AOS.refresh(); }, 300);
      });
    });
  }

  // LIGHTBOX play
  const lightbox = document.getElementById('lightbox');
  const videoFrame = document.getElementById('video-frame');
  const closeLightbox = document.getElementById('close-lightbox');

  document.body.addEventListener('click', (e) => {
    const card = e.target.closest('.video-card');
    if (!card) return;
    const id = card.dataset.videoId;
    if (!id) return;
    videoFrame.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
  });

  if (closeLightbox) closeLightbox.addEventListener('click', closeLight);
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLight(); });

  function closeLight() {
    videoFrame.src = '';
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  // SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setTimeout(() => { if (window.AOS) AOS.refresh(); }, 600);
    });
  });

  // ACTIVE NAV ON SCROLL
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 90;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        const id = sec.getAttribute('id');
        document.querySelectorAll('.navbar nav a').forEach(a => {
          a.classList.remove('active');
          // Note: Using template literals for clear string interpolation
          if (a.getAttribute('href') === `#${id}` || a.href.includes(`${location.pathname}#${id}`)) {
            a.classList.add('active');
          }
        });
      }
    });
  });

  // ✅ EMAIL FORM (JSON + Google Sheets Integration)
  const emailForm = document.getElementById('emailForm');
  if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msgEl = document.getElementById('emailMsg');
      msgEl.textContent = 'Submitting...';

      const email = e.target.email.value;
      const action = emailForm.action;

      try {
        const res = await fetch(action, {
          method: 'POST',
          // Data is sent as JSON
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (data.result === 'success') {
          msgEl.textContent = '✅ Thanks for subscribing!';
          msgEl.style.color = 'green';
          emailForm.reset();
        } else {
          msgEl.textContent = '⚠️ Subscription failed. Try again.';
          msgEl.style.color = 'red';
        }
      } catch (err) {
        console.error(err);
        msgEl.textContent = '⚠️ Network error. Please try again.';
        msgEl.style.color = 'red';
      }
    });
  }

  // ✅ CONTACT FORM (JSON + Google Sheets Integration)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msgEl = document.getElementById('contactMsg');
      msgEl.textContent = 'Sending...';

      // Serialize form data to a JS object
      const formData = Object.fromEntries(new FormData(e.target).entries());
      const action = contactForm.action;

      try {
        const res = await fetch(action, {
          method: 'POST',
          // Data is sent as JSON
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (data.result === 'success') {
          msgEl.textContent = '✅ Message sent successfully!';
          msgEl.style.color = 'green';
          contactForm.reset();
        } else {
          msgEl.textContent = '⚠️ Failed to send. Try again.';
          msgEl.style.color = 'red';
        }
      } catch (err) {
        console.error(err);
        msgEl.textContent = '⚠️ Network error. Please try later.';
        msgEl.style.color = 'red';
      }
    });
  }
});