const body = document.body;

const trapFocus = (container, active) => {
  const selectors = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = [...container.querySelectorAll(selectors)];
  if (!active || !focusables.length) return () => {};
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const handler = (event) => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', handler);
  first.focus();
  return () => container.removeEventListener('keydown', handler);
};

const closeAllDropdowns = () => document.querySelectorAll('[data-dropdown]').forEach(dd => dd.classList.remove('open'));

document.querySelectorAll('[data-dropdown]').forEach((dropdown) => {
  const trigger = dropdown.querySelector('.pill');
  trigger?.addEventListener('click', () => {
    const open = dropdown.classList.contains('open');
    closeAllDropdowns();
    dropdown.classList.toggle('open', !open);
    trigger.setAttribute('aria-expanded', String(!open));
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-dropdown]')) closeAllDropdowns();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeAllDropdowns();
});

const drawer = document.getElementById('mobile-drawer');
const burger = document.querySelector('.burger');
const drawerClose = document.querySelector('.drawer-close');
let releaseDrawerFocus = () => {};

const openDrawer = () => {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  burger.setAttribute('aria-expanded', 'true');
  body.classList.add('lock');
  releaseDrawerFocus = trapFocus(drawer.querySelector('.drawer-panel'), true);
};
const closeDrawer = () => {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  burger.setAttribute('aria-expanded', 'false');
  body.classList.remove('lock');
  releaseDrawerFocus();
  burger.focus();
};

burger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
drawer?.addEventListener('click', (event) => {
  if (event.target === drawer) closeDrawer();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && drawer?.classList.contains('open')) closeDrawer();
});
drawer?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeDrawer));

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const btn = item.querySelector('button');
  const panel = item.querySelector('.faq-content');
  btn?.addEventListener('click', () => {
    faqItems.forEach((other) => {
      if (other === item) return;
      other.querySelector('button').setAttribute('aria-expanded', 'false');
      other.querySelector('.faq-content').classList.remove('open');
    });
    const open = panel.classList.contains('open');
    btn.setAttribute('aria-expanded', String(!open));
    panel.classList.toggle('open', !open);
  });
});

const modal = document.getElementById('privacy-modal');
const openModalBtn = document.querySelector('.privacy-link');
const closeModalButtons = modal ? [...modal.querySelectorAll('.modal-x, .close-modal')] : [];
let releaseModalFocus = () => {};

const openModal = () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  body.classList.add('lock');
  releaseModalFocus = trapFocus(modal.querySelector('.modal-panel'), true);
};
const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  body.classList.remove('lock');
  releaseModalFocus();
  openModalBtn.focus();
};

openModalBtn?.addEventListener('click', openModal);
closeModalButtons.forEach(btn => btn.addEventListener('click', closeModal));
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('open')) closeModal();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('section, .review-card, .visual-card').forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});
