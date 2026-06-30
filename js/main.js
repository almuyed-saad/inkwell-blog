/* ===== THEME ===== */
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme") || "light";
root.setAttribute("data-theme", savedTheme);
updateThemeIcon();

themeToggle?.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon();
});
function updateThemeIcon() {
  const icon = themeToggle?.querySelector(".theme-toggle__icon");
  if (icon) icon.textContent = root.getAttribute("data-theme") === "light" ? "🌙" : "☀️";
}

/* ===== MOBILE NAV ===== */
const burger = document.getElementById("navBurger");
const navLinks = document.getElementById("navLinks");
burger?.addEventListener("click", () => navLinks.classList.toggle("open"));

/* ===== BACK TO TOP (declare before scroll handler) ===== */
const toTop = document.getElementById("toTop");
toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ===== NAV SHADOW + TO-TOP ON SCROLL ===== */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav?.classList.toggle("scrolled", window.scrollY > 10);
  toTop?.classList.toggle("show", window.scrollY > 500);
});

/* ===== SCROLL REVEAL (with stagger + reduced-motion) ===== */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });

// Assign a stagger index to siblings sharing the same parent, then reveal
function observeReveals(scope = document) {
  const groups = new Map();
  scope.querySelectorAll(".reveal:not(.in)").forEach((el) => {
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    el.style.setProperty("--reveal-i", i);
    groups.set(parent, i + 1);
    if (prefersReducedMotion) el.classList.add("in");
    else io.observe(el);
  });
}
observeReveals();

/* ===== NEWSLETTER ===== */
const newsletterForm = document.getElementById("newsletterForm");
newsletterForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("newsletterNote").textContent = "Thanks for subscribing! 🎉";
  newsletterForm.reset();
});

/* ===== RENDER HOME CONTENT ===== */
function cardHTML(p) {
  return `
    <article class="card reveal">
      <a href="${postUrl(p.id)}">
        <div class="card__img"><img src="${p.image}" alt="${p.title}" loading="lazy" /></div>
        <div class="card__body">
          <span class="tag">${p.category}</span>
          <h3 class="card__title">${p.title}</h3>
          <p class="card__excerpt">${p.excerpt}</p>
          <p class="meta">${p.author} · ${formatDate(p.date)} · ${p.readTime} min read</p>
        </div>
      </a>
    </article>`;
}

const featuredCard = document.getElementById("featuredCard");
if (featuredCard) {
  const f = POSTS[0];
  featuredCard.href = postUrl(f.id);
  featuredCard.innerHTML = `
    <div class="featured__img"><img src="${f.image}" alt="${f.title}" /></div>
    <div class="featured__body">
      <span class="tag">${f.category}</span>
      <h3 class="featured__title">${f.title}</h3>
      <p class="featured__excerpt">${f.excerpt}</p>
      <p class="meta">${f.author} · ${formatDate(f.date)} · ${f.readTime} min read</p>
    </div>`;
}

const recentGrid = document.getElementById("recentGrid");
if (recentGrid) {
  recentGrid.innerHTML = POSTS.slice(1, 4).map(cardHTML).join("");
  observeReveals(recentGrid); // stagger the injected cards too
}
/* ===== ROUND B1: MICRO-INTERACTIONS ===== */

// 1. TOAST NOTIFICATION SYSTEM (for newsletter, copy link, etc.)
function showToast(message, duration = 3000) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--accent);
    color: #fff;
    padding: 14px 28px;
    border-radius: 999px;
    font-family: var(--sans);
    font-weight: 600;
    font-size: 0.95rem;
    box-shadow: 0 8px 32px rgba(67, 56, 202, 0.3);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
  `;
  document.body.appendChild(toast);

  // Trigger entrance
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  // Auto-remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 500);
  }, duration);
}

// 2. ENHANCE NEWSLETTER WITH TOAST
const newsletterFormEl = document.getElementById('newsletterForm');
if (newsletterFormEl) {
  // Remove old listener by cloning
  const newForm = newsletterFormEl.cloneNode(true);
  newsletterFormEl.parentNode.replaceChild(newForm, newsletterFormEl);

  newForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('🎉 Thanks for subscribing!');
    newForm.reset();
  });
}

// 3. ENHANCE CONTACT FORM WITH TOAST
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  // Remove old listener by cloning (preserve validation)
  const newContactForm = contactForm.cloneNode(true);
  contactForm.parentNode.replaceChild(newContactForm, contactForm);

  newContactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation check
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const subject = document.getElementById('subject')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (name && email && subject && message) {
      showToast('✅ Message sent! Almuyed will get back to you soon.', 4000);
      newContactForm.reset();
      const successEl = document.getElementById('formSuccess');
      if (successEl) successEl.hidden = true;
    }
  });
}

// 4. ENHANCE COPY LINK SHARE WITH TOAST
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.share__btn[data-net="copy"]');
  if (btn) {
    navigator.clipboard?.writeText(window.location.href);
    showToast('📋 Link copied to clipboard!');
  }
});

// 5. ENHANCE THEME TOGGLE WITH HAPTIC FEEDBACK
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    // Small haptic-style feedback via vibration API
    if (navigator.vibrate) navigator.vibrate(10);
  });
}
/* ============================================
   ROUND B2: PAGE TRANSITIONS & MOBILE QA
   ============================================ */

// 1. SMOOTH NAVIGATION - scroll to top on page change
document.addEventListener('DOMContentLoaded', () => {
  // Scroll to top on page load (with smooth behavior)
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Add page transition class to body
  document.body.classList.add('page-transition');
});

// 2. ENHANCE NAV LINKS - smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// 3. MOBILE MENU - close on link click (better UX)
const mobileNavLinks = document.querySelectorAll('.nav__links a');
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    const navLinksEl = document.getElementById('navLinks');
    if (navLinksEl && window.innerWidth <= 680) {
      navLinksEl.classList.remove('open');
    }
  });
});

// 4. MOBILE MENU - close on outside click
document.addEventListener('click', (e) => {
  const navLinksEl = document.getElementById('navLinks');
  const burgerEl = document.getElementById('navBurger');
  if (!navLinksEl || !burgerEl) return;
  if (window.innerWidth <= 680 && navLinksEl.classList.contains('open')) {
    const isClickInside = navLinksEl.contains(e.target) || burgerEl.contains(e.target);
    if (!isClickInside) {
      navLinksEl.classList.remove('open');
    }
  }
});

// 5. RESIZE HANDLER - close mobile menu on resize to desktop
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const navLinksEl = document.getElementById('navLinks');
    if (navLinksEl && window.innerWidth > 680) {
      navLinksEl.classList.remove('open');
    }
  }, 200);
});

// 6. TOUCH FEEDBACK - subtle vibration for mobile
document.querySelectorAll('.btn, .chip, .social-btn, .theme-toggle, .nav__burger').forEach(el => {
  el.addEventListener('touchstart', () => {
    if (navigator.vibrate) navigator.vibrate(5);
  }, { passive: true });
});

// 7. PREVENT ZOOM ON DOUBLE TAP (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

console.log('🌿 Inkwell — Round B2: Page Transitions & Mobile QA loaded.');

/* ============================================
   ROUND B3: 404 REDIRECT HANDLING
   ============================================ */

// Check if we're on a page that doesn't exist
// This catches when someone navigates to a broken link within the site
document.addEventListener('DOMContentLoaded', () => {
  // If this is a post page with no post, we already handle it in post.js
  // But for any other broken page, the server should serve 404.html
  // This is a fallback for client-side navigation issues
  
  // If there's a hash or query param that broke, log it
  if (window.location.pathname.endsWith('.html') && !window.location.pathname.includes('index') && 
      !window.location.pathname.includes('blog') && !window.location.pathname.includes('post') &&
      !window.location.pathname.includes('about') && !window.location.pathname.includes('contact') && !window.location.pathname.includes('admin') && 
      !window.location.pathname.includes('404')) {
    // This shouldn't happen with proper server config, but just in case
    console.warn('Page not found. Redirecting to 404...');
    // window.location.href = '404.html';
  }
});

/* ============================================
   ROUND B4: PERFORMANCE & FINAL POLISH
   ============================================ */

// 1. SKIP LINK - add to page for keyboard users
document.addEventListener('DOMContentLoaded', () => {
  // Add skip link to body if not exists
  if (!document.querySelector('.skip-link')) {
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main-content';
    skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }

  // Add main-content ID to main content areas
  const mainContent = document.querySelector('main, .hero, .page-head');
  if (mainContent) {
    mainContent.id = 'main-content';
  }
});

// 2. IMAGE ERROR HANDLING - show placeholder on broken images
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      // Show a subtle placeholder instead of broken image icon
      this.style.background = 'var(--surface)';
      this.style.display = 'flex';
      this.style.alignItems = 'center';
      this.style.justifyContent = 'center';
      this.style.color = 'var(--text-soft)';
      this.style.fontSize = '0.8rem';
      this.style.minHeight = '100px';
      // Don't set alt text, keep original
    });
  });
});

// 3. CLEAN UP - remove any stray console logs from development
// (Keeping only essential logs for debugging)
const originalLog = console.log;
console.log = function(...args) {
  // Only show logs in development (you can comment this out to keep logs)
  // Uncomment below to disable all logs:
  // return;
  originalLog(...args);
};

// 4. CONSOLE WELCOME - nice touch
console.log('📖 Inkwell — Words worth reading, slowly.');
console.log('✨ Crafted with care by Almuyed Saad.');
console.log('🚀 Built with ❤️ using vanilla HTML/CSS/JS.');

// 5. PERFORMANCE MARK - measure page load
if (window.performance) {
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⏱️ Page loaded in ${Math.round(loadTime)}ms`);
  });
}

// 6. NETWORK STATUS INDICATOR (optional, subtle)
document.addEventListener('DOMContentLoaded', () => {
  const online = navigator.onLine;
  if (!online) {
    // Show a subtle warning if offline
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
      background: #e5484d; color: #fff; padding: 8px 20px;
      border-radius: 999px; font-size: 0.85rem; font-weight: 500;
      z-index: 999; box-shadow: 0 4px 16px rgba(229,72,77,0.3);
      font-family: var(--sans);
    `;
    toast.textContent = '🌐 You are offline. Some features may not work.';
    document.body.prepend(toast);
  }
});

// 7. SCROLL POSITION RESTORE - remember scroll position on back
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

/* ============================================
   SMOOTH PAGE TRANSITIONS (with title handling)
   ============================================ */

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'page-transition-overlay';
document.body.prepend(overlay);

// Store the original title
const originalTitle = document.title;

// Add page-content class to body
document.body.classList.add('page-content');

// Intercept all internal link clicks
document.addEventListener('click', function(e) {
  const link = e.target.closest('a');
  
  // Only handle internal links
  if (!link) return;
  if (!link.href) return;
  if (link.target === '_blank') return;
  if (link.href.startsWith('#')) return;
  if (link.href.startsWith('mailto:')) return;
  if (link.href.startsWith('tel:')) return;
  
  // Check if it's an internal link (same origin)
  const currentOrigin = window.location.origin;
  let linkOrigin;
  try {
    linkOrigin = new URL(link.href).origin;
  } catch {
    return;
  }
  
  if (currentOrigin !== linkOrigin) return;
  
  // Check if it's an HTML page (not external resource)
  const url = new URL(link.href);
  const path = url.pathname;
  if (path.includes('.') && !path.endsWith('.html') && !path.endsWith('/')) return;
  
  // Prevent default navigation
  e.preventDefault();
  
  // Don't change title yet — keep the current one
  const targetUrl = link.href;
  
  // Start transition
  overlay.classList.add('active');
  
  // Navigate after fade
  setTimeout(() => {
    window.location.href = targetUrl;
  }, 300);
});

// Remove overlay on page load
window.addEventListener('pageshow', function(e) {
  overlay.classList.remove('active');
});

// Also remove overlay when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    overlay.classList.remove('active');
  }, 100);
});
/* ============================================
   SUPABASE INTEGRATION - OVERRIDE DATA SOURCE
   ============================================ */

// Override the cardHTML and post rendering to work with Supabase
// This allows the site to read posts from Supabase instead of data.js

// Store posts globally
let supabasePosts = [];

// Load posts from Supabase
async function loadPostsFromSupabase() {
  try {
    // Check if supabase client exists
    if (typeof supabase === 'undefined') {
      console.warn('Supabase client not loaded, using data.js fallback');
      return false;
    }
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      supabasePosts = data;
      // Re-render content with Supabase data
      renderHomeWithSupabase();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error loading posts from Supabase:', error);
    return false;
  }
}

// Render home page with Supabase posts
function renderHomeWithSupabase() {
  if (!supabasePosts || supabasePosts.length === 0) return;
  
  // Featured - newest post
  const featuredCard = document.getElementById('featuredCard');
  if (featuredCard) {
    const f = supabasePosts[0];
    featuredCard.href = `post.html?id=${f.id}`;
    featuredCard.innerHTML = `
      <div class="featured__img"><img src="${f.image_url || 'https://picsum.photos/seed/fallback/800/500'}" alt="${f.title}" loading="lazy" /></div>
      <div class="featured__body">
        <span class="tag">${f.category || 'Blog'}</span>
        <h3 class="featured__title">${f.title}</h3>
        <p class="featured__excerpt">${f.excerpt || f.content.substring(0, 120).replace(/<[^>]*>/g, '')}...</p>
        <p class="meta">${f.author || 'Inkwell'} · ${formatDate(f.created_at) || 'Recently'} · ${Math.ceil(f.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min read</p>
      </div>
    `;
  }
  
  // Recent - next 3 posts
  const recentGrid = document.getElementById('recentGrid');
  if (recentGrid) {
    const recent = supabasePosts.slice(1, 4);
    recentGrid.innerHTML = recent.map(p => supabaseCardHTML(p)).join('');
    if (typeof observeReveals === 'function') {
      observeReveals(recentGrid);
    }
  }
}

// Card HTML for Supabase posts
function supabaseCardHTML(p) {
  const excerpt = p.excerpt || p.content.substring(0, 120).replace(/<[^>]*>/g, '');
  return `
    <article class="card reveal">
      <a href="post.html?id=${p.id}">
        <div class="card__img"><img src="${p.image_url || 'https://picsum.photos/seed/fallback/800/500'}" alt="${p.title}" loading="lazy" /></div>
        <div class="card__body">
          <span class="tag">${p.category || 'Blog'}</span>
          <h3 class="card__title">${p.title}</h3>
          <p class="card__excerpt">${excerpt}...</p>
          <p class="meta">${p.author || 'Inkwell'} · ${formatDate(p.created_at)} · ${Math.ceil(p.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min read</p>
        </div>
      </a>
    </article>`;
}

// Override the initial render if on home page
document.addEventListener('DOMContentLoaded', async function() {
  // Check if we're on home page
  const isHome = window.location.pathname.endsWith('index.html') || 
                 window.location.pathname.endsWith('/') ||
                 window.location.pathname === '';
  
  if (isHome) {
    await loadPostsFromSupabase();
  }
});

// Also override post.html rendering
// This is handled in post.js