/* ============================================
   ADMIN PANEL - FULL CRUD (FIXED)
   ============================================ */

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const postList = document.getElementById('postList');
const newPostBtn = document.getElementById('newPostBtn');
const editorModal = document.getElementById('editorModal');
const deleteModal = document.getElementById('deleteModal');
const postForm = document.getElementById('postForm');
const postId = document.getElementById('postId');
const postTitle = document.getElementById('postTitle');
const postCategory = document.getElementById('postCategory');
const postAuthor = document.getElementById('postAuthor');
const postImage = document.getElementById('postImage');
const postContent = document.getElementById('postContent');
const postPublished = document.getElementById('postPublished');
const savePostBtn = document.getElementById('savePostBtn');
const closeEditor = document.getElementById('closeEditor');
const cancelEditor = document.getElementById('cancelEditor');
const editorError = document.getElementById('editorError');
const editorSuccess = document.getElementById('editorSuccess');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const deletePostTitle = document.getElementById('deletePostTitle');
const totalPostsEl = document.getElementById('totalPosts');
const publishedPostsEl = document.getElementById('publishedPosts');
const draftPostsEl = document.getElementById('draftPosts');

let currentDeleteId = null;
let editingPost = null;

// ============================================
// AUTHENTICATION
// ============================================

async function checkAuth() {
  try {
    if (typeof window.supabaseClient === 'undefined') {
      console.error('Supabase client not loaded!');
      if (loginError) {
        loginError.textContent = 'Supabase client not loaded. Please refresh.';
        loginError.hidden = false;
      }
      return;
    }

    const user = await getCurrentUser();
    if (user) {
      showDashboard();
    } else {
      showLogin();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    showLogin();
  }
}

function showLogin() {
  if (loginSection) loginSection.hidden = false;
  if (dashboardSection) dashboardSection.hidden = true;
}

function showDashboard() {
  if (loginSection) loginSection.hidden = true;
  if (dashboardSection) dashboardSection.hidden = false;
  loadPosts();
  updateStats();
}

// Login handler
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (loginError) loginError.hidden = true;

    try {
      const email = loginEmail ? loginEmail.value.trim() : '';
      const password = loginPassword ? loginPassword.value : '';

      if (!email || !password) {
        if (loginError) {
          loginError.textContent = 'Please enter email and password.';
          loginError.hidden = false;
        }
        return;
      }

      await signIn(email, password);
      showDashboard();
      if (loginForm) loginForm.reset();
    } catch (error) {
      if (loginError) {
        loginError.textContent = error.message || 'Invalid email or password.';
        loginError.hidden = false;
      }
    }
  });
}

// Logout handler
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut();
    showLogin();
  });
}

// ============================================
// LOAD POSTS
// ============================================

async function loadPosts() {
  if (!postList) return;

  try {
    const posts = await getPosts();
    renderPostList(posts);
  } catch (error) {
    postList.innerHTML = `<p class="admin-error">Error loading posts: ${error.message}</p>`;
  }
}

// Escape special HTML characters so titles/categories can never break markup or attributes
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderPostList(posts) {
  if (!postList) return;

  if (!posts || posts.length === 0) {
    postList.innerHTML = `
      <div class="admin-empty">
        <p>No posts yet. Click "New Post" to create your first one!</p>
      </div>
    `;
    return;
  }

  // Build HTML using data-* attributes
  // FIX: Use encodeURIComponent for data-title to safely handle
  // any special characters (quotes, ampersands, etc.) in post titles
  let html = '';
  posts.forEach(post => {
    const title = post.title || 'Untitled';
    html += `
      <div class="post-item">
        <div class="post-item__info">
          <span class="post-item__id">#${post.id}</span>
          <span class="post-item__title">${escapeHtml(title)}</span>
          <span class="post-item__category">${escapeHtml(post.category || 'Uncategorized')}</span>
          <span class="post-item__status ${post.published ? 'published' : 'draft'}">
            ${post.published ? 'Published' : 'Draft'}
          </span>
          <span class="post-item__date">${formatDate(post.created_at)}</span>
        </div>
        <div class="post-item__actions">
          <button class="view-btn" data-action="view" data-id="${post.id}">View</button>
          <button class="edit-btn" data-action="edit" data-id="${post.id}">Edit</button>
          <button class="delete-btn" data-action="delete" data-id="${post.id}" data-title="${encodeURIComponent(title)}">Delete</button>
        </div>
      </div>
    `;
  });

  postList.innerHTML = html;
}

// Event delegation — one listener handles all current and future post buttons
if (postList) {
  postList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = parseInt(btn.dataset.id, 10);

    if (action === 'view') viewPost(id);
    if (action === 'edit') editPost(id);
    // FIX: decode the title back from encodeURIComponent before passing to confirmDelete
    if (action === 'delete') confirmDelete(id, decodeURIComponent(btn.dataset.title));
  });
}

// ============================================
// VIEW POST
// ============================================

function viewPost(id) {
  window.open(`post.html?id=${id}`, '_blank');
}

// ============================================
// EDIT POST
// ============================================

async function editPost(id) {
  try {
    const post = await getPostById(id);
    if (!post) {
      alert('Post not found!');
      return;
    }

    editingPost = post;
    if (postId) postId.value = post.id;
    if (postTitle) postTitle.value = post.title || '';
    if (postCategory) postCategory.value = post.category || 'Design';
    if (postAuthor) postAuthor.value = post.author || 'Almuyed Saad';
    if (postImage) postImage.value = post.image_url || '';
    if (postContent) postContent.value = post.content || '';
    if (postPublished) postPublished.checked = post.published !== false;

    const titleEl = document.getElementById('editorTitle');
    if (titleEl) titleEl.textContent = 'Edit Post';
    if (savePostBtn) savePostBtn.textContent = 'Update Post';
    if (editorError) editorError.hidden = true;
    if (editorSuccess) editorSuccess.hidden = true;
    if (editorModal) editorModal.hidden = false;
    if (postTitle) postTitle.focus();
  } catch (error) {
    alert('Error loading post: ' + error.message);
  }
}

// ============================================
// CONFIRM DELETE
// ============================================

function confirmDelete(id, title) {
  console.log('Deleting post:', id, 'Title:', title);
  currentDeleteId = id;
  if (deletePostTitle) {
    deletePostTitle.textContent = title || 'this post';
  }
  if (deleteModal) {
    deleteModal.hidden = false;
  }
}

// ============================================
// UPDATE STATS
// ============================================

async function updateStats() {
  try {
    const posts = await getPosts();
    const total = posts.length;
    const published = posts.filter(p => p.published).length;
    const drafts = total - published;

    if (totalPostsEl) totalPostsEl.textContent = total;
    if (publishedPostsEl) publishedPostsEl.textContent = published;
    if (draftPostsEl) draftPostsEl.textContent = drafts;
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

// ============================================
// NEW POST
// ============================================

if (newPostBtn) {
  newPostBtn.addEventListener('click', () => {
    editingPost = null;
    if (postId) postId.value = '';
    if (postTitle) postTitle.value = '';
    if (postCategory) postCategory.value = 'Design';
    if (postAuthor) postAuthor.value = 'Almuyed Saad';
    if (postImage) postImage.value = '';
    if (postContent) postContent.value = '';
    if (postPublished) postPublished.checked = true;

    const titleEl = document.getElementById('editorTitle');
    if (titleEl) titleEl.textContent = 'Add New Post';
    if (savePostBtn) savePostBtn.textContent = 'Create Post';
    if (editorError) editorError.hidden = true;
    if (editorSuccess) editorSuccess.hidden = true;
    if (editorModal) editorModal.hidden = false;
    if (postTitle) postTitle.focus();
  });
}

// ============================================
// CLOSE EDITOR
// ============================================

function closeEditorModal() {
  if (editorModal) editorModal.hidden = true;
}

if (closeEditor) closeEditor.addEventListener('click', closeEditorModal);
if (cancelEditor) cancelEditor.addEventListener('click', closeEditorModal);

if (editorModal) {
  editorModal.addEventListener('click', (e) => {
    if (e.target === editorModal) closeEditorModal();
  });
}

// ============================================
// SAVE POST
// ============================================

if (postForm) {
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (editorError) editorError.hidden = true;
    if (editorSuccess) editorSuccess.hidden = true;

    const title = postTitle ? postTitle.value.trim() : '';
    const content = postContent ? postContent.value.trim() : '';

    if (!title) {
      if (editorError) {
        editorError.textContent = 'Please enter a title.';
        editorError.hidden = false;
      }
      return;
    }

    if (!content) {
      if (editorError) {
        editorError.textContent = 'Please enter some content.';
        editorError.hidden = false;
      }
      return;
    }
    // Convert markdown-style formatting to HTML
function markdownToHtml(text) {
  if (!text) return '';
  
  let html = text;
  
  // Split into paragraphs (double line break)
  const paragraphs = html.split(/\n\s*\n/);
  
  html = paragraphs.map(p => {
    // Check if it's a heading
    if (p.startsWith('# ')) {
      return `<h2>${p.substring(2)}</h2>`;
    }
    if (p.startsWith('## ')) {
      return `<h3>${p.substring(3)}</h3>`;
    }
    
    // Check if it's a blockquote
    if (p.startsWith('> ')) {
      return `<blockquote>${p.substring(2)}</blockquote>`;
    }
    
    // Check if it's a horizontal line
    if (p.trim() === '---') {
      return '<hr />';
    }
    
    // Check if it's a list
    if (p.startsWith('- ')) {
      const items = p.split('\n').filter(line => line.startsWith('- '));
      const listItems = items.map(item => `<li>${item.substring(2)}</li>`).join('');
      return `<ul>${listItems}</ul>`;
    }
    
    // Regular paragraph with inline formatting
    let text = p;
    
    // Bold: **text** → <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text* → <em>text</em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return `<p>${text}</p>`;
  }).join('\n');
  
  return html;
}


const postData = {
  title: title,
  category: postCategory ? postCategory.value : 'Design',
  author: postAuthor ? postAuthor.value.trim() || 'Almuyed Saad' : 'Almuyed Saad',
  image_url: postImage ? postImage.value.trim() : '',
  content: markdownToHtml(content),  // ← CONVERT markdown to HTML
  published: postPublished ? postPublished.checked : true
};

    try {
      const id = postId ? postId.value : '';
      if (id) {
        await updatePost(parseInt(id), postData);
        if (editorSuccess) editorSuccess.textContent = '✅ Post updated successfully!';
      } else {
        await createPost(postData);
        if (editorSuccess) editorSuccess.textContent = '✅ Post created successfully!';
      }

      if (editorSuccess) editorSuccess.hidden = false;

      setTimeout(() => {
        loadPosts();
        updateStats();
        closeEditorModal();
      }, 1000);

    } catch (error) {
      if (editorError) {
        editorError.textContent = 'Error saving post: ' + error.message;
        editorError.hidden = false;
      }
    }
  });
}

// ============================================
// DELETE CONFIRMATION
// ============================================

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener('click', async () => {
    if (!currentDeleteId) {
      console.error('No post selected for deletion');
      return;
    }

    try {
      console.log('Deleting post:', currentDeleteId);
      await deletePost(currentDeleteId);
      if (deleteModal) deleteModal.hidden = true;
      const deletedId = currentDeleteId;
      currentDeleteId = null;
      loadPosts();
      updateStats();
      console.log('Post deleted successfully:', deletedId);
    } catch (error) {
      alert('Error deleting post: ' + error.message);
    }
  });
}

if (cancelDeleteBtn) {
  cancelDeleteBtn.addEventListener('click', () => {
    if (deleteModal) deleteModal.hidden = true;
    currentDeleteId = null;
  });
}

if (deleteModal) {
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      deleteModal.hidden = true;
      currentDeleteId = null;
    }
  });
}

// ============================================
// FORMAT DATE HELPER
// ============================================

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('Admin panel loaded');

  // Defensive: ensure modals start hidden and no stale delete id lingers
  if (deleteModal) deleteModal.hidden = true;
  if (editorModal) editorModal.hidden = true;
  currentDeleteId = null;

  checkAuth();
});