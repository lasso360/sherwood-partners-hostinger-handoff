// Nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle) navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));

// Scroll-triggered reveal
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
}

// Swipeable carousel — native scroll-snap does the actual swiping (touch
// devices need zero JS for that); this just wires up the ghost arrow
// buttons and keeps the dot rail in sync with scroll position.
document.querySelectorAll('.carousel-wrap').forEach((wrap) => {
  const track = wrap.querySelector('.carousel');
  const cards = Array.from(track.querySelectorAll('.carousel-card'));
  const prevBtn = wrap.querySelector('.carousel-arrow.prev');
  const nextBtn = wrap.querySelector('.carousel-arrow.next');
  const dots = Array.from(wrap.querySelectorAll('.carousel-dot'));
  if (!cards.length) return;

  const step = () => cards[0].getBoundingClientRect().width + 24; // card + gap

  const updateState = () => {
    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (prevBtn) prevBtn.disabled = scrollLeft <= 4;
    if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll - 4;
    if (dots.length) {
      const idx = Math.round(scrollLeft / step());
      dots.forEach((d, i) => d.classList.toggle('active', i === Math.min(idx, dots.length - 1)));
    }
  };

  if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  dots.forEach((dot, i) => dot.addEventListener('click', () => track.scrollTo({ left: i * step(), behavior: 'smooth' })));

  track.addEventListener('scroll', () => { window.requestAnimationFrame(updateState); }, { passive: true });
  updateState();
});

// Contact form handler.
//
// Submits the form via POST to `/api/contact` as JSON, with the fields
// `name`, `email` and `message`. It expects a JSON response of the shape
// { ok: boolean, email_sent: boolean } and updates #form-status
// accordingly.
//
// NOTE FOR DEPLOYMENT: the `/api/contact` endpoint is NOT included in this
// package — it ran on the site's previous hosting. Until a replacement is
// wired up, this form will POST to a URL that does not exist and show the
// fallback error message. Either point the fetch() below at your own form
// handler, or replace this form with an embedded form from your CRM.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const status = document.getElementById('form-status');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const payload = {
      name: (data.get('name') || '').toString(),
      email: (data.get('email') || '').toString(),
      message: (data.get('message') || '').toString(),
    };

    if (submitBtn) submitBtn.disabled = true;
    if (status) status.textContent = 'Sending…';

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.ok && result.email_sent) {
          if (status) status.textContent = "Thanks — your message has been sent.";
          contactForm.reset();
        } else {
          // Saved to the record log even on email failure (see the
          // Function) — so this isn't "lost," just flagged honestly.
          if (status) status.textContent = "Received — but the automatic email may be delayed. You can also reach us directly at info@sherwoodea.com.";
        }
      })
      .catch(() => {
        if (status) status.textContent = "Something went wrong sending this. Please email us directly at info@sherwoodea.com.";
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
}

