# 🎉 Mimiko Studio - Complete Setup Guide (Supabase)

Your entire website is now a **single self-contained app** powered by Supabase. No separate backend needed!

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Mimiko Studio (React)           │
│                                         │
│  Public Site        Admin Panel         │
│  /                  /#/admin            │
│  /collections       /#/admin/designs    │
│  /navratri          /#/admin/bookings   │
│  /booking           etc.                │
│                                         │
│         All via Supabase SDK            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│            SUPABASE                     │
│                                         │
│  📦 Database    → PostgreSQL            │
│  🔐 Auth        → Admin login          │
│  🖼️ Storage     → Image uploads        │
│  🔌 API         → Auto-generated REST  │
│  🔒 RLS         → Security policies    │
└─────────────────────────────────────────┘
```

**One platform. Everything included. Free tier available.**

---

## 🚀 Setup in 5 Steps

### Step 1: Create Supabase Project (2 minutes)

1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Click **"New Project"**
3. Name it: `mimiko-studio`
4. Set a database password (save it!)
5. Choose region closest to you
6. Wait ~2 minutes for it to initialize

### Step 2: Run Database Schema (1 minute)

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file `supabase/schema.sql` from this project
4. Copy ALL the SQL and paste into the editor
5. Click **"Run"** (or press Ctrl+Enter)
6. ✅ Tables, policies, and default collections are created!

### Step 3: Create Storage Bucket (30 seconds)

The schema already creates the `designs` bucket. Verify:
1. Go to **Storage** in Supabase sidebar
2. You should see a bucket called `designs`
3. If not, create it manually:
   - Click "New bucket"
   - Name: `designs`
   - Toggle **"Public bucket"** ON
   - Click Create

### Step 4: Create Admin User (1 minute)

1. Go to **Authentication → Users** in Supabase sidebar
2. Click **"Add user" → "Create new user"**
3. Enter:
   - Email: `admin@mimikostudio.com` (or your email)
   - Password: Choose a strong password
   - ✅ **Auto Confirm User** (check this box)
4. Click **"Create user"**

### Step 5: Configure Frontend (30 seconds)

1. In Supabase Dashboard, go to **Settings → API**
2. Copy these two values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
3. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://abc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Done!** 🎉

---

## 🛠️ Run Locally

```bash
npm install
npm run dev
```

Visit:
- Public site: `http://localhost:3000/`
- Admin panel: `http://localhost:3000/#/admin/login`

Login with the admin email/password you created in Step 4.

---

## 🌐 Deploy to GitHub Pages

```bash
npm run build
```

Upload the `dist` folder contents to your `gh-pages` branch.

Or use GitHub Actions (automatic):

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Important:** Add your `.env` values to GitHub repo secrets if needed, or commit them (anon key is safe to expose - security is handled by RLS policies).

---

## 📋 What You Can Do

### As Admin (/#/admin):
- ✅ **Add/Edit/Delete designs** with multiple images
- ✅ **Upload images** directly to Supabase Storage
- ✅ **Set pricing** (fixed, starting from, on request)
- ✅ **Manage collections** (categories)
- ✅ **View bookings** from customers
- ✅ **Update booking status** (NEW → CONTACTED → CONFIRMED → COMPLETED)
- ✅ **View contact messages**
- ✅ **Mark designs as featured** (show on homepage)

### As Customer:
- ✅ Browse all designs and collections
- ✅ View design details with multiple images
- ✅ Submit booking requests
- ✅ Send contact enquiries
- ✅ Request custom designs

---

## 🔒 Security

Everything is secured through **Row Level Security (RLS)**:

| Action | Public | Admin |
|--------|--------|-------|
| View designs | ✅ | ✅ |
| View collections | ✅ | ✅ |
| Create booking | ✅ | ✅ |
| Send message | ✅ | ✅ |
| Edit designs | ❌ | ✅ |
| Delete designs | ❌ | ✅ |
| Upload images | ❌ | ✅ |
| View all bookings | ❌ | ✅ |

The `anon` key is safe to expose in frontend code because RLS policies control what can be done.

---

## 💰 Cost

**Supabase Free Tier includes:**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth/month
- 50,000 monthly active users
- Unlimited API requests

**More than enough for a boutique studio website!**

---

## 📁 Project Structure

```
mimiko-studio/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout.tsx      # Header + Footer
│   │   ├── BookingModal.tsx
│   │   ├── ImageGallery.tsx
│   │   └── ScrollReveal.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Admin auth state
│   ├── data/
│   │   └── index.ts        # Sample data (fallback)
│   ├── lib/
│   │   └── supabase.ts     # Supabase client
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Collections.tsx
│   │   ├── DesignDetail.tsx
│   │   ├── Navratri.tsx
│   │   ├── Embroidery.tsx
│   │   ├── Booking.tsx
│   │   ├── Contact.tsx
│   │   ├── admin/          # Admin panel pages
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DesignsManager.tsx
│   │   │   ├── CollectionsManager.tsx
│   │   │   ├── BookingsManager.tsx
│   │   │   └── MessagesManager.tsx
│   │   └── ...
│   ├── services/
│   │   └── api.ts          # All Supabase queries
│   └── App.tsx
├── supabase/
│   └── schema.sql          # Database schema
├── .env.example
└── SETUP_GUIDE.md
```

---

## 🐛 Troubleshooting

### "Supabase not configured" message?
- Check `.env` file exists in project root
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after changing `.env`

### Images not uploading?
- Check Storage bucket `designs` exists and is public
- Verify you're logged in as admin (uploads require auth)
- Check browser console for errors

### Can't login to admin?
- Verify user exists in Supabase → Authentication → Users
- Make sure "Auto Confirm User" was checked
- Try resetting password in Supabase dashboard

### Blank page after deploy?
- Ensure `base: './'` is in `vite.config.js`
- Use `HashRouter` (already configured)
- Check `.env` values are included in build

---

## 🎨 Customization

### Change colors
Edit `src/index.css` → `@theme` section

### Change fonts
Edit `index.html` → Google Fonts link
Edit `src/index.css` → `--font-serif` and `--font-sans`

### Add new pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add link in `src/components/Layout.tsx`

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] SQL schema run successfully
- [ ] Storage bucket `designs` exists
- [ ] Admin user created in Authentication
- [ ] `.env` file configured
- [ ] `npm run dev` works locally
- [ ] Can login to /#/admin
- [ ] Can add a design with images
- [ ] Can submit a booking (test as customer)
- [ ] Deployed to GitHub Pages / Netlify / Vercel

---

## 🎉 You're Live!

Your complete in-house jewellery studio website is ready. Customers browse and book, you manage everything from the admin panel — all powered by a single Supabase project.

**No backend server. No separate database. No Cloudinary. Just Supabase.**

Share your site and start taking bookings! 🎊
