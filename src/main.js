import './input.css'

// Hamburger
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('#nav-menu');

hamburger.addEventListener('click', function () {
  hamburger.classList.toggle('hamburger-active')
  navMenu.classList.toggle('hidden');
});

// Tutup menu mobile saat link nav diklik
navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', function () {
    hamburger.classList.remove('hamburger-active');
    navMenu.classList.add('hidden');
  });
});

// Navbar fixed
window.onscroll = function () {
  const header = document.querySelector('header');
  const fixedNav = header.offsetTop;

  if (window.scrollY > fixedNav) {
    header.classList.add('navbar-fixed');
  } else {
    header.classList.remove('navbar-fixed');
  }
};

// Copyright dinamis
document.querySelector('#year').textContent = new Date().getFullYear();

// Dark mode toggle
const themeToggle = document.querySelector('#theme-toggle');
themeToggle.addEventListener('click', function () {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Contact form - Web3Forms
const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const submitBtn = document.querySelector('#submit-btn');

const setStatus = (message, colorClass = 'text-primary') => {
  formStatus.textContent = message;
  formStatus.className = `text-base font-semibold ${colorClass} mb-4 text-center`;
};

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Honeypot: jika terisi, kemungkinan bot -> abaikan tanpa kirim
  if (form.botcheck.value) {
    setStatus('Pesan berhasil terkirim. Terima kasih!');
    form.reset();
    return;
  }

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  // Validasi klien
  if (!name || !email || !message) {
    setStatus('Harap lengkapi semua kolom.', 'text-red-700');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setStatus('Format email tidak valid.', 'text-red-700');
    return;
  }

  submitBtn.disabled = true;
  setStatus('Mengirim...');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
        name,
        email,
        message,
      }),
      signal: controller.signal,
    });

    if (response.ok) {
      form.reset();
      setStatus('Pesan berhasil terkirim. Terima kasih!');
    } else {
      throw new Error('Gagal mengirim pesan');
    }
  } catch (error) {
    const isTimeout = error.name === 'AbortError';
    setStatus(
      isTimeout
        ? 'Waktu pengiriman habis. Silakan coba lagi.'
        : 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi atau hubungi saya via email.',
      'text-red-700'
    );
  } finally {
    clearTimeout(timeout);
    submitBtn.disabled = false;
  }
});
