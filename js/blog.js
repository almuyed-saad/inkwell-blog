/* ===== BLOG LISTING (with Supabase) ===== */
const searchInput = document.getElementById("searchInput");
const filtersEl = document.getElementById("filters");
const postGrid = document.getElementById("postGrid");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const clearBtn = document.getElementById("clearBtn");

let allPosts = [];
let activeCategory = "All";
let searchTerm = "";

// Load posts from Supabase
async function loadBlogPosts() {
  try {
    // Check if supabase client exists
    if (typeof window.supabaseClient === 'undefined') {
      console.error('Supabase client not loaded!');
      postGrid.innerHTML = `<p class="admin-error">Supabase client not loaded. Please refresh the page.</p>`;
      return;
    }

    console.log('Fetching posts from Supabase...');
    
    const { data, error } = await window.supabaseClient
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Posts loaded:', data);
    allPosts = data || [];
    buildFilters();
    render();
  } catch (error) {
    console.error('Error loading posts:', error);
    postGrid.innerHTML = `<p class="admin-error">Error loading posts: ${error.message}</p>`;
  }
}

// Build category chips
function buildFilters() {
  const categories = ["All", ...new Set(allPosts.map((p) => p.category).filter(Boolean))];
  filtersEl.innerHTML = categories
    .map((c) => `<button class="chip ${c === "All" ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");

  filtersEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCategory = chip.dataset.cat;
    filtersEl.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip));
    render();
  });
}

// Search input
searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  render();
});

// Clear button
clearBtn?.addEventListener("click", () => {
  searchTerm = "";
  activeCategory = "All";
  searchInput.value = "";
  filtersEl.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === "All"));
  render();
});

// Render posts
function render() {
  const filtered = allPosts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm) ||
      (p.excerpt || p.content).toLowerCase().includes(searchTerm) ||
      (p.category || "").toLowerCase().includes(searchTerm) ||
      (p.author || "").toLowerCase().includes(searchTerm);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    postGrid.innerHTML = "";
    emptyState.hidden = false;
    resultsCount.textContent = "";
    
    const hasSearch = searchTerm.length > 0;
    const hasFilter = activeCategory !== "All";
    
    const emoji = document.querySelector('.empty__emoji');
    const title = document.querySelector('.empty h3');
    const desc = document.querySelector('.empty p');
    const clearBtnEl = document.getElementById('clearBtn');
    
    if (emoji) emoji.textContent = hasSearch ? '🔍' : '📭';
    if (title) title.textContent = hasSearch ? 'No matches found' : 'No posts yet';
    if (desc) {
      if (hasSearch && hasFilter) {
        desc.textContent = `No posts matching "${searchTerm}" in "${activeCategory}". Try a different search or filter.`;
      } else if (hasSearch) {
        desc.textContent = `No posts matching "${searchTerm}". Try a different keyword.`;
      } else if (hasFilter) {
        desc.textContent = `No posts in "${activeCategory}". Try another category.`;
      } else {
        desc.textContent = 'Check back soon for new essays.';
      }
    }
    if (clearBtnEl) clearBtnEl.textContent = hasSearch || hasFilter ? 'Clear filters' : 'Browse all posts';
    return;
  }

  emptyState.hidden = true;
  resultsCount.textContent = `Showing ${filtered.length} article${filtered.length > 1 ? "s" : ""}`;
  postGrid.innerHTML = filtered.map(supabaseCardHTML).join("");
  postGrid.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

// Card HTML for Supabase posts
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

// Load posts
loadBlogPosts();