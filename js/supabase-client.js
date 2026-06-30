// ============================================
// SUPABASE CLIENT
// ============================================

// Wait for the CDN script to load
(function() {
  // Check if supabase is available from CDN
  if (typeof supabase === 'undefined') {
    console.error('❌ Supabase JS library not loaded! Check CDN script.');
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  // Create client
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
  
  // Make it available globally
  window.supabaseClient = supabaseClient;
  window.supabase = supabaseClient; // Also set as supabase for compatibility

  console.log('✅ Supabase client initialized!');
})();

// ============================================
// POST CRUD OPERATIONS
// ============================================

async function getPosts() {
  const { data, error } = await window.supabaseClient
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data || [];
}

async function getPostById(id) {
  const { data, error } = await window.supabaseClient
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }
  return data;
}

async function createPost(post) {
  const { data, error } = await window.supabaseClient
    .from('posts')
    .insert([{
      title: post.title,
      excerpt: post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, ''),
      content: post.content,
      category: post.category,
      author: post.author || 'Almuyed Saad',
      image_url: post.image_url || '',
      published: post.published !== undefined ? post.published : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select();
  
  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }
  return data;
}

async function updatePost(id, post) {
  const { data, error } = await window.supabaseClient
    .from('posts')
    .update({
      title: post.title,
      excerpt: post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, ''),
      content: post.content,
      category: post.category,
      author: post.author || 'Almuyed Saad',
      image_url: post.image_url || '',
      published: post.published !== undefined ? post.published : true,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating post:', error);
    throw error;
  }
  return data;
}

async function deletePost(id) {
  const { error } = await window.supabaseClient
    .from('posts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
  return true;
}

// ============================================
// AUTHENTICATION
// ============================================

async function signIn(email, password) {
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });
  
  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }
  return data;
}

async function signOut() {
  const { error } = await window.supabaseClient.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
  return true;
}

async function getCurrentUser() {
  const { data, error } = await window.supabaseClient.auth.getUser();
  if (error) {
    return null;
  }
  return data.user;
}