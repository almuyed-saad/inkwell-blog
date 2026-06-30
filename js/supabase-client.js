// ============================================
// SUPABASE CLIENT - HARDCODED KEYS
// ============================================

// Supabase configuration (anon key is safe to be public - RLS protects your data)
const supabaseUrl = 'https://sokhvipepnxapldbzynz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNva2h2aXBlcG54YXBsZGJ6eW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzIxMTQsImV4cCI6MjA5ODMwODExNH0.bWneo7ALFeyZLfJGhkr-u40-TT7kgvX5vi_9qlOQKLQ';

// Create Supabase client
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Make available globally
window.supabaseClient = supabaseClient;
window.supabase = supabaseClient;

console.log('✅ Supabase client initialized!');

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