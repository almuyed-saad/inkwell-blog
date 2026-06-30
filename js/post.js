/* ===== SINGLE POST (with Supabase) ===== */
const params = new URLSearchParams(window.location.search);
const postId = parseInt(params.get('id'), 10);

const articleEl = document.getElementById('article');
const notFoundEl = document.getElementById('notFound');
const progressBar = document.getElementById('progress');
const relatedSec = document.getElementById('relatedSection');
const relatedGrid = document.getElementById('relatedGrid');

async function loadPost() {
  if (!postId) {
    articleEl.hidden = true;
    notFoundEl.hidden = false;
    return;
  }

  try {
    // Check if supabase client exists
    if (typeof window.supabaseClient === 'undefined') {
      console.error('Supabase client not loaded!');
      articleEl.hidden = true;
      notFoundEl.hidden = false;
      notFoundEl.querySelector('h3').textContent = 'Error loading post';
      notFoundEl.querySelector('p').textContent = 'Supabase client not loaded. Please refresh.';
      return;
    }

    // Fetch from Supabase
    const { data: post, error } = await window.supabaseClient
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error || !post) {
      articleEl.hidden = true;
      notFoundEl.hidden = false;
      return;
    }

    // Check if published
    if (!post.published) {
      articleEl.hidden = true;
      notFoundEl.hidden = false;
      notFoundEl.querySelector('h3').textContent = 'This post is not published.';
      notFoundEl.querySelector('p').textContent = 'The author is still working on it.';
      return;
    }

    renderPost(post);
    
    // Load related posts
    await loadRelatedPosts(post);

  } catch (error) {
    console.error('Error loading post:', error);
    articleEl.hidden = true;
    notFoundEl.hidden = false;
  }
}

function renderPost(post) {
  document.title = `${post.title} | Inkwell`;

  const excerpt = post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '');
  const readTime = Math.ceil(post.content.replace(/<[^>]*>/g, '').split(' ').length / 200);

  articleEl.innerHTML = `
    <section class="article__hero">
      <div class="container">
        <a href="blog.html" class="article__back">← Back to blog</a>
        <div><span class="tag">${post.category || 'Blog'}</span></div>
        <h1 class="article__title">${post.title}</h1>
        <div class="article__meta">
          <span class="article__avatar">${(post.author || 'I').charAt(0)}</span>
          <span>${post.author || 'Inkwell'}</span><span>·</span>
          <span>${formatDate(post.created_at)}</span><span>·</span>
          <span>${readTime} min read</span>
        </div>
      </div>
      <div class="article__cover container">
        <img src="${post.image_url || 'https://picsum.photos/seed/fallback/800/500'}" alt="${post.title}" loading="lazy" />
      </div>
    </section>

    <article class="article__body">${post.content}</article>

    <div class="share">
      <span>Share:</span>
      <button class="share__btn" data-net="twitter">Twitter</button>
      <button class="share__btn" data-net="linkedin">LinkedIn</button>
      <button class="share__btn" data-net="copy">Copy link</button>
    </div>`;

  // Share buttons
  articleEl.querySelectorAll('.share__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(post.title);
      if (btn.dataset.net === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
      } else if (btn.dataset.net === 'linkedin') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
      } else {
        navigator.clipboard.writeText(window.location.href);
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = 'Copy link'), 1500);
      }
    });
  });
}

async function loadRelatedPosts(currentPost) {
  try {
    // Check if supabase client exists
    if (typeof window.supabaseClient === 'undefined') {
      relatedSec.hidden = true;
      return;
    }

    // Get posts with same category, excluding current
    const { data: related, error } = await window.supabaseClient
      .from('posts')
      .select('*')
      .eq('published', true)
      .neq('id', currentPost.id)
      .eq('category', currentPost.category)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error || !related || related.length === 0) {
      // Fallback: get any other posts
      const { data: fallback, error: fallbackError } = await window.supabaseClient
        .from('posts')
        .select('*')
        .eq('published', true)
        .neq('id', currentPost.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!fallbackError && fallback && fallback.length > 0) {
        renderRelatedPosts(fallback);
      } else {
        relatedSec.hidden = true;
      }
      return;
    }

    renderRelatedPosts(related);
  } catch (error) {
    console.error('Error loading related posts:', error);
    relatedSec.hidden = true;
  }
}

function renderRelatedPosts(posts) {
  if (!posts || posts.length === 0) {
    relatedSec.hidden = true;
    return;
  }

  relatedSec.hidden = false;
  relatedGrid.innerHTML = posts.map(p => supabaseCardHTML(p)).join('');
  if (typeof observeReveals === 'function') {
    observeReveals(relatedGrid);
  }
}

// Helper: Card HTML for Supabase posts
function supabaseCardHTML(p) {
  const excerpt = p.excerpt || p.content.substring(0, 120).replace(/<[^>]*>/g, '');
  const readTime = Math.ceil(p.content.replace(/<[^>]*>/g, '').split(' ').length / 200);
  return `
    <article class="card reveal">
      <a href="post.html?id=${p.id}">
        <div class="card__img"><img src="${p.image_url || 'https://picsum.photos/seed/fallback/800/500'}" alt="${p.title}" loading="lazy" /></div>
        <div class="card__body">
          <span class="tag">${p.category || 'Blog'}</span>
          <h3 class="card__title">${p.title}</h3>
          <p class="card__excerpt">${excerpt}...</p>
          <p class="meta">${p.author || 'Inkwell'} · ${formatDate(p.created_at)} · ${readTime} min read</p>
        </div>
      </a>
    </article>`;
}

// Format date helper
function formatDate(dateStr) {
  if (!dateStr) return 'Recently';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Load the post
loadPost();

/* ===== READING PROGRESS BAR ===== */
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
  if (progressBar) progressBar.style.width = `${scrolled * 100}%`;
});