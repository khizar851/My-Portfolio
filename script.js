/* ===== Helpers ===== */
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

/* ===== Mobile Nav ===== */
const hamburger = $('#hamburger');
const nav = $('#nav');
hamburger?.addEventListener('click', () => nav.classList.toggle('open'));
$$('#nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

/* ===== Dark Mode Toggle (persist) ===== */
const THEME_KEY = 'khizar.theme';
const themeToggle = $('#themeToggle');

function applyTheme(mode){
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem(THEME_KEY, mode);
  if(themeToggle) themeToggle.textContent = mode === 'light' ? '☀️' : '🌙';
}

// init: from storage or system preference
const saved = localStorage.getItem(THEME_KEY);
const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
applyTheme(saved || (systemPrefersLight ? 'light' : 'dark'));

// toggle
themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'light' ? 'dark' : 'light');
});

/* ===== Typing Effect ===== */
const typeEl = $('#type');
const roles = [
  'Digital Marketer',
  'SEO Specialist',
  'WordPress Optimizer',
  'Performance Marketer'
];
let r = 0, i = 0, deleting = false;
function typeLoop(){
  const current = roles[r];
  typeEl.textContent = current.slice(0, i);
  i += deleting ? -1 : 1;
  if(!deleting && i > current.length + 4){ deleting = true; }
  if(deleting && i === 0){ deleting = false; r = (r+1) % roles.length; }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

/* ===== Year & Back-to-top ===== */
$('#year').textContent = new Date().getFullYear();

/* ===== Counters ===== */
function animateCounter(el){
  const target = +el.dataset.counter;
  let val = 0;
  const step = Math.max(1, Math.floor(target / 60));
  const t = setInterval(() => {
    val += step;
    if(val >= target){ val = target; clearInterval(t); }
    el.textContent = val;
  }, 18);
}
$$('[data-counter]').forEach(animateCounter);

/* ===== Reveal on Scroll ===== */
const io = new IntersectionObserver((entries) => {
  for(const e of entries){
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }
}, { threshold: 0.15 });
$$('.reveal').forEach(el => io.observe(el));

/* ===== Slider ===== */
const slides = Array.from(document.querySelectorAll('.slide'));
const dotsWrap = document.querySelector('.slider-dots');

// create dots dynamically
dotsWrap.innerHTML = '';
slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.className = 'dot' + (i === 0 ? ' active' : '');
  b.setAttribute('aria-label', `Slide ${i+1}`);
  b.addEventListener('click', () => go(i));
  dotsWrap.appendChild(b);
});
const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

function go(n){
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[n].classList.add('active');
  dots[n].classList.add('active');
}

let current = 0;
setInterval(() => { current = (current + 1) % slides.length; go(current); }, 4500);


/* ===== Form (mailto guard + basic validation) ===== */
$('#contactForm')?.addEventListener('submit', (e) => {
  const email = $('[name="email"]')?.value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    e.preventDefault();
    alert('Please enter a valid email address.');
    return;
  }
  // For nicer subject in mailto
  e.target.action = `mailto:Khizarshaikh851@gmail.com?subject=New%20Inquiry%20from%20${encodeURIComponent($('[name="name"]').value)}`;
});

/* ===== Small analytics (console) ===== */
$$('a[href^="#"]').forEach(a => a.addEventListener('click', () => console.log('nav:', a.getAttribute('href'))));

/* ===== FAQ: one open at a time ===== */
const faqItems = Array.from(document.querySelectorAll('#faq .faq'));
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach(other => { if (other !== item) other.open = false; });
    }
  });
});


const form = document.getElementById("contactForm");
  const phoneNumber = "923164837306";

  // simple, reliable email check
  const emailOk = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const msgEl = document.getElementById("message");

    const name = nameEl.value.trim();
    const email = emailEl.value.trim().toLowerCase(); // normalize
    const message = msgEl.value.trim();

    // custom validation
    if (!name) { alert("Please enter your name."); nameEl.focus(); return; }
    if (!emailOk(email)) { alert("Please enter a valid email address."); emailEl.focus(); return; }
    if (!message) { alert("Please write a message."); msgEl.focus(); return; }

    // WhatsApp text
    const text = `Hello, my name is ${name}.
Email: ${email}
Message: ${message}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  });