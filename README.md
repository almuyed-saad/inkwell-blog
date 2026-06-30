# Inkwell — A Modern Blog with Admin Panel


**Inkwell** is a full-featured, modern blog platform built with vanilla HTML, CSS, and JavaScript, powered by Supabase as the backend. It includes a complete admin panel for content management, dark mode, and a beautiful editorial design.

🔗 **Live Demo:** [https://demoo-blog.netlify.app/](https://demoo-blog.netlify.app/)

---

## ✨ Features

### Public Features
- 🏠 **Home Page** — Hero section, featured post, and recent posts grid
- 📝 **Blog Listing** — Search and filter posts by category
- 📖 **Single Post** — Full article view with reading progress bar
- 🌙 **Dark Mode** — Toggle with persistent preference
- 📱 **Fully Responsive** — Works on all devices
- ✨ **Smooth Animations** — Scroll reveals, hover effects, page transitions

### Admin Features
- 🔐 **Secure Login** — Authentication via Supabase
- ✍️ **Create Posts** — Markdown-style formatting with live preview
- 📝 **Edit Posts** — Update any existing post
- 🗑️ **Delete Posts** — Remove posts with confirmation
- 📊 **Dashboard** — Post statistics (total, published, drafts)
- 🖼️ **Image Support** — Add cover images via URL

### Technical Features
- 🔒 **Row Level Security (RLS)** — Only admins can create/edit/delete
- 📦 **Supabase Backend** — PostgreSQL database with real-time capabilities
- 🚀 **Netlify Deployment** — Continuous deployment from GitHub
- 📱 **PWA Ready** — Mobile-friendly and fast

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Supabase (PostgreSQL + Authentication) |
| **Hosting** | Netlify |
| **Fonts** | Google Fonts (Fraunces + Inter) |
| **Deployment** | Git + GitHub + Netlify |

---

## 📁 Project Structure

```
BLOG/
├── index.html              # Home page
├── blog.html                # Blog listing with search/filter
├── post.html                 # Single post view
├── admin.html                # Admin panel
├── about.html                 # About page
├── contact.html                # Contact page
├── 404.html                     # Custom 404 page
├── css/
│   ├── style.css                 # Main styles
│   └── admin.css                  # Admin panel styles
├── js/
│   ├── config.js                    # Supabase URL + anon key (NOT committed to Git)
│   ├── config.example.js             # Template for config.js (committed to Git)
│   ├── supabase-client.js              # Supabase connection, reads from config.js
│   ├── admin.js                          # Admin CRUD operations
│   ├── blog.js                            # Blog listing logic
│   ├── post.js                             # Single post logic
│   ├── main.js                              # Shared functionality
│   ├── data.js                               # Fallback post data
│   └── ...                                    # Other page-specific scripts
├── assets/
│   └── images/                                  # Image assets
└── sitemap.xml                                    # SEO sitemap
```

---

## 🚀 Getting Started

### Prerequisites
- A Supabase account (free tier)
- A Netlify account (free tier)
- Git installed

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/almuyed-saad/inkwell-blog.git
   cd inkwell-blog
   ```

2. **Set up Supabase**
   - Create a Supabase project
   - Create the `posts` table with required schema (see below)
   - Enable Row Level Security (RLS)
   - Add admin users

3. **Add your Supabase keys**

   This project keeps your Supabase URL and anon key out of Git by loading them from a local `js/config.js` file, which is listed in `.gitignore` and never gets pushed to GitHub.

   - Copy the template file:
     ```bash
     cp js/config.example.js js/config.js
     ```
   - Open `js/config.js` and fill in your own values from your Supabase dashboard (**Project Settings → API**):
     ```js
     window.SUPABASE_CONFIG = {
       url: "YOUR_SUPABASE_URL",
       anonKey: "YOUR_SUPABASE_ANON_KEY"
     };
     ```
   - `js/supabase-client.js` reads from `window.SUPABASE_CONFIG` automatically — no further edits needed there.

   > **Note:** the anon/public key is meant to be used in client-side code by design — it's not a secret on its own. Your actual data protection comes from the Row Level Security (RLS) policies on your tables, not from hiding this key. Keeping it out of Git here is just good hygiene, not a security requirement.

4. **Run locally**
   - Open `index.html` with Live Server in VS Code
   - Or use any local static server

5. **Access Admin Panel**
   - Go to `admin.html`
   - Login with your Supabase Auth credentials

---

## 🗄️ Database Schema

### Posts Table
```sql
CREATE TABLE posts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT,
  author TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT TRUE
);
```

### RLS Policies
```sql
-- Anyone can read published posts
CREATE POLICY "Anyone can read published posts"
ON posts FOR SELECT
USING (published = true);

-- Only admins can create, update, delete
CREATE POLICY "Admins can create/update/delete posts"
ON posts FOR ALL
USING (auth.email() IN ('admin@example.com'));
```

---

## 📱 Responsive Design

| Breakpoint | Layout |
|------------|--------|
| > 900px | 3-column grid |
| 680px – 900px | 2-column grid |
| < 680px | Single column, mobile menu |

---

## 🌐 Deployment

### Deploy to Netlify

1. Push your code to GitHub (`js/config.js` will not be included — that's expected)
2. Log in to Netlify
3. Click **"New site from Git"**
4. Select your repository
5. Configure:
   - **Branch:** `main`
   - **Build command:** *(leave empty)*
   - **Publish directory:** `.`
6. Click **"Deploy"**

### Setting up keys on Netlify

Since `js/config.js` isn't in your repo, Netlify won't have it either after deployment. You have two options:

**Option A — Snippet Injection (recommended, no build step needed)**
In Netlify: **Site settings → Build & deploy → Post processing → Snippet injection**, add a script tag before `</head>` that sets `window.SUPABASE_CONFIG` with your production values directly.

**Option B — Manually add `config.js` after deploy**
Use Netlify's file editor / a small deploy script to write `js/config.js` with your real values directly into the published output, since this site has no build process to inject environment variables automatically.

> If you'd rather not deal with this at all, you can also just hardcode the URL and anon key directly in `supabase-client.js` and skip `config.js` entirely — it's a valid option since the anon key isn't sensitive. The config file approach above is purely a code-cleanliness choice for keeping keys out of version history.

---

## 📝 Writing Posts

The admin panel supports Markdown-style formatting:

| You Type | You Get |
|----------|---------|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `# Heading` | Large heading |
| `## Subheading` | Subheading |
| `> Quote` | Blockquote |
| `- Item` | Bullet point |
| `---` | Horizontal line |

---

## 🤝 Contributing

This is a personal project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👤 Author

**Almuyed Saad**
- GitHub: [@almuyed-saad](https://github.com/almuyed-saad)
- Email: iamsaad236@gmail.com

---

## 🙏 Acknowledgments

- Built with Supabase for backend and authentication
- Deployed on Netlify
- Fonts from Google Fonts
- Images from Unsplash

---

## 📸 Screenshots

| Home Page | Blog Page | Admin Panel |
|-----------|-----------|--------------|
| https://demoo-blog.netlify.app/ | https://demoo-blog.netlify.app/blog.html | https://demoo-blog.netlify.app/admin.html |

---

## ⭐ Star This Project

If you found this project useful, please give it a star on GitHub!
