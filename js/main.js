// ============================================
// VILLA JAIA — Main JS
// ============================================

// ── Availability Calendar
(function() {
  const el = document.getElementById('availCalendar');
  if (!el) return;

  const lang = document.documentElement.lang || 'en';

  const labels = {
    en: { months: ['April','May','June','July','August','September','October','November','December'], days: ['Mo','Tu','We','Th','Fr','Sa','Su'], year: '2026' },
    it: { months: ['Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'], days: ['Lu','Ma','Me','Gi','Ve','Sa','Do'], year: '2026' },
    fr: { months: ['Avril','Mai','Juin','Juillet','Ao\u00fbt','Septembre','Octobre','Novembre','D\u00e9cembre'], days: ['Lu','Ma','Me','Je','Ve','Sa','Di'], year: '2026' },
    de: { months: ['April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'], days: ['Mo','Di','Mi','Do','Fr','Sa','So'], year: '2026' },
    es: { months: ['Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'], days: ['Lu','Ma','Mi','Ju','Vi','S\u00e1','Do'], year: '2026' }
  };

  const L = labels[lang] || labels.en;

  // startDay: 0=Mon … 6=Sun
  const monthData = [
    { idx: 0, startDay: 2, total: 30, booked: d => d >= 1 && d <= 22, hold: () => false },
    { idx: 1, startDay: 4, total: 31, booked: d => d >= 21 && d <= 23, hold: () => false },
    { idx: 2, startDay: 0, total: 30, booked: d => d >= 28 && d <= 30, hold: d => d >= 6 && d <= 25 },
    { idx: 3, startDay: 2, total: 31, booked: () => true, hold: () => false },
    { idx: 4, startDay: 5, total: 31, booked: d => d >= 1 && d <= 14, hold: () => false },
    { idx: 5, startDay: 1, total: 30, booked: () => false, hold: () => false },
    { idx: 6, startDay: 3, total: 31, booked: () => false, hold: () => false },
    { idx: 7, startDay: 6, total: 30, booked: () => false, hold: () => false },
    { idx: 8, startDay: 1, total: 31, booked: () => false, hold: () => false }
  ];

  let html = '';
  monthData.forEach(m => {
    const name = L.months[m.idx] + ' ' + L.year;
    let grid = '<div class="cal-grid">';
    L.days.forEach(d => { grid += `<div class="cal-day-header">${d}</div>`; });
    for (let i = 0; i < m.startDay; i++) grid += '<div class="cal-day empty"></div>';
    for (let d = 1; d <= m.total; d++) {
      const cls = m.booked(d) ? 'booked' : m.hold(d) ? 'hold' : 'available';
      grid += `<div class="cal-day ${cls}">${d}</div>`;
    }
    grid += '</div>';
    html += `<div class="avail-month"><p class="avail-month-name">${name}</p>${grid}</div>`;
  });

  el.innerHTML = html;
})();

// ── NAV scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// ── Hero load animation + WebP detection
window.addEventListener('load', () => {
  document.getElementById('hero').classList.add('loaded');
});

// ── Swap hero background to WebP if supported
(function() {
  var webp = new Image();
  webp.onload = function() {
    var heroBg = document.querySelector('.hero-bg');
    if (heroBg) heroBg.style.backgroundImage = "url('/images/villa-jaia-13.webp')";
  };
  webp.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAkA4JZQCdAEO/gHOAAA=';
})();

// ── Gallery Lightbox
const galleryImages = Array.from(document.querySelectorAll('.gallery-item img')).map(img => ({
  src: img.src,
  alt: img.alt
}));

let currentImg = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const counter = document.getElementById('lightbox-counter');

function updateCounter() {
  counter.textContent = `${currentImg + 1} / ${galleryImages.length}`;
}

function openLightbox(index) {
  currentImg = index;
  lightboxImg.src = galleryImages[index].src;
  lightboxImg.alt = galleryImages[index].alt;
  updateCounter();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function prevImg() {
  currentImg = (currentImg - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentImg].src;
  updateCounter();
}

function nextImg() {
  currentImg = (currentImg + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentImg].src;
  updateCounter();
}

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox-prev').addEventListener('click', prevImg);
document.getElementById('lightbox-next').addEventListener('click', nextImg);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevImg();
  if (e.key === 'ArrowRight') nextImg();
});

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

// ── Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Fade-in on scroll
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80;
  fadeObserver.observe(el);
});

// ── Mobile hamburger menu
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Cookie banner
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
if (cookieBanner && !localStorage.getItem('vm_cookie_ok')) {
  setTimeout(() => cookieBanner.classList.add('visible'), 1800);
}
if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('vm_cookie_ok', '1');
    cookieBanner.classList.remove('visible');
  });
}

// ── Enquiry form (Web3Forms)
const enquiryForm = document.getElementById('enquiryForm');
const formSuccess = document.getElementById('formSuccess');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(enquiryForm);
    const submit = enquiryForm.querySelector('.form-submit');
    submit.textContent = 'Sending…';
    submit.disabled = true;
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data))
      });
      const json = await res.json();
      if (json.success) {
        enquiryForm.style.display = 'none';
        formSuccess.style.display = 'block';
      } else {
        submit.textContent = 'Error — please try WhatsApp';
        submit.disabled = false;
      }
    } catch {
      submit.textContent = 'Error — please try WhatsApp';
      submit.disabled = false;
    }
  });
}
