/* ===== CONTACT FORM VALIDATION ===== */
const form = document.getElementById('contactForm');

const setError = (name, msg) => {
  const field = document.getElementById(name)?.closest('.field');
  if (!field) return;
  field.classList.toggle('invalid', !!msg);
  const errorEl = field.querySelector('.field__error');
  if (errorEl) errorEl.textContent = msg || '';
};

const validators = {
  name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
  email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Enter a valid email address.' : ''),
  subject: (v) => (v.trim().length < 3 ? 'Add a short subject.' : ''),
  message: (v) => (v.trim().length < 10 ? 'Message should be at least 10 characters.' : ''),
};

Object.keys(validators).forEach((name) => {
  const input = document.getElementById(name);
  if (!input) return;
  input.addEventListener('input', () => setError(name, validators[name](input.value)));
});

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;
  Object.keys(validators).forEach((name) => {
    const input = document.getElementById(name);
    if (!input) return;
    const msg = validators[name](input.value);
    setError(name, msg);
    if (msg) valid = false;
  });

  if (valid) {
    // Toast is handled by main.js
    form.reset();
    const successEl = document.getElementById('formSuccess');
    if (successEl) successEl.hidden = true;
  }
});