# 🎨 Mimiko Studio - Complete Jewellery Store Website

A **fully functional** premium jewellery store website with admin panel, powered entirely by **Supabase**. No backend server needed!

![Mimiko Studio](https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=1200&q=80)

---

## ✨ Features

### 🌐 Public Website
- **Home Page**: Hero section, featured collections, signature designs
- **Collections**: Browse all product categories
- **Product Pages**: Multi-image galleries, detailed descriptions
- **Booking System**: Customers can request products
- **Contact Form**: Direct inquiries
- **Custom Design Requests**: Bespoke order forms
- **Gallery**: Masonry image grid
- **FAQ**: Common questions
- **Responsive Design**: Works on all devices

### 🔐 Admin Panel
- **Dashboard**: Overview stats and recent activity
- **Designs Manager**: Add/edit/delete products with images
- **Collections Manager**: Organize product categories
- **Bookings Manager**: View and manage customer requests
- **Messages Manager**: Read contact form submissions
- **Image Upload**: Direct to Supabase Storage
- **Setup Guide**: Step-by-step configuration

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: GitHub Pages / Netlify / Vercel

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- GitHub account (for deployment)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd mimiko-studio
npm install
```

### 2. Setup Supabase

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `mimiko-studio`
4. Set a database password (save it!)
5. Wait for project to initialize

#### Run Database Schema
1. Go to [SQL Editor](https://supabase.com/dashboard/project/gnojncipluesigzwonch/sql)
2. Click "New Query"
3. Copy **ALL** content from `supabase/schema.sql`
4. Paste and click "Run"
5. Wait ~10 seconds ✅

#### Create Storage Bucket
1. Go to [Storage](https://supabase.com/dashboard/project/gnojncipluesigzwonch/storage)
2. Click "New bucket"
3. Name: `designs`
4. ✅ Toggle **"Public bucket"** ON
5. Click "Create bucket" ✅

#### Create Admin User
1. Go to [Authentication](https://supabase.com/dashboard/project/gnojncipluesigzwonch/auth/users)
2. Click "Add user" → "Create new user"
3. Email: `admin@mimikostudio.com` (or your email)
4. Password: Choose a strong password
5. ✅ Check **"Auto Confirm User"**
6. Click "Create user" ✅

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://gnojncipluesigzwonch.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Get these values from:**
- Supabase Dashboard → Settings → API
- Copy "Project URL" and "anon public" key

### 4. Run Locally

```bash
npm run dev
```

Visit:
- **Public Site**: http://localhost:3000/
- **Admin Panel**: http://localhost:3000/#/admin

Login with your admin email and password.

### 5. Deploy to GitHub Pages

```bash
npm run build
```

Upload the `dist` folder to your `gh-pages` branch, or use GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Setup Pages
        uses: actions/configure-pages@v3
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

Add your Supabase credentials as GitHub Secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 📖 Documentation

- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Complete admin panel guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[supabase/schema.sql](./supabase/schema.sql)** - Database schema with comments

---

## 🎯 Using the Admin Panel

### First Time Setup

1. Go to `/#/admin`
2. Login with your credentials
3. Check the **Setup Guide** page - it shows what's configured
4. Complete any missing steps

### Adding Your First Product

1. Go to **Designs** → **Add Design**
2. Fill in product details:
   - Name: "Pearl Drop Earrings"
   - Description: "Elegant pearl earrings perfect for weddings"
   - Collection: Select "Jewellery"
   - Category: "Earrings"
   - Price: "₹2,500"
   - Price Type: "Starting From"
3. Upload images (multiple angles recommended)
4. Click **Create Design**
5. View it on the public site! 🎉

### Managing Bookings

When customers submit booking requests:

1. Go to **Bookings**
2. See all requests with status (NEW, CONTACTED, CONFIRMED, etc.)
3. Click the **eye icon** to view details
4. Contact customer via email/WhatsApp
5. Update status as you progress

### Handling Messages

Contact form submissions appear in **Messages**:

1. Go to **Messages**
2. Read customer inquiries
3. Click **email icon** to reply
4. Mark as handled

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
│   │   └── AuthContext.tsx  # Admin authentication
│   ├── data/
│   │   └── index.ts        # Sample data (fallback)
│   ├── lib/
│   │   └── supabase.ts     # Supabase client
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Collections.tsx
│   │   ├── CollectionDetail.tsx
│   │   ├── DesignDetail.tsx
│   │   ├── Navratri.tsx
│   │   ├── Embroidery.tsx
│   │   ├── CustomDesign.tsx
│   │   ├── Booking.tsx
│   │   ├── Contact.tsx
│   │   ├── Gallery.tsx
│   │   ├── About.tsx
│   │   ├── FAQ.tsx
│   │   ├── NotFound.tsx
│   │   ├── StaticPages.tsx
│   │   └── admin/          # Admin panel
│   │       ├── Login.tsx
│   │       ├── AdminLayout.tsx
│   │       ├── Dashboard.tsx
│   │       ├── DesignsManager.tsx
│   │       ├── CollectionsManager.tsx
│   │       ├── BookingsManager.tsx
│   │       ├── MessagesManager.tsx
│   │       └── SetupGuide.tsx
│   ├── services/
│   │   └── api.ts          # All Supabase queries
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── schema.sql          # Database schema
├── public/
│   └── robots.txt
├── .env                    # Your credentials (create this)
├── .env.example            # Template
├── ADMIN_GUIDE.md          # Admin documentation
├── SETUP_GUIDE.md          # Setup instructions
└── README.md               # This file
```

---

## 🔒 Security

### Row Level Security (RLS)

All tables have RLS policies:

| Table | Public Access | Admin Access |
|-------|---------------|--------------|
| collections | Read | Read/Write |
| designs | Read | Read/Write |
| design_images | Read | Read/Write |
| bookings | Create | Read/Update/Delete |
| contact_messages | Create | Read/Delete |

### What's Safe to Expose

- ✅ **anon key** - Safe in frontend code
- ✅ **Project URL** - Public knowledge
- ❌ **service_role key** - NEVER expose (not used)
- ❌ **Database password** - Keep secret

### Best Practices

1. Use strong admin password
2. Don't share admin credentials
3. Logout when done
4. Regular backups

---

## 💰 Cost

**Supabase Free Tier:**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth/month
- 50,000 monthly active users
- Unlimited API requests

**More than enough for a boutique jewellery store!**

Upgrade to Pro ($25/month) only if you exceed these limits.

---

## 🎨 Customization

### Change Colors

Edit `src/index.css`:

```css
@theme {
  --color-ivory: #FAF7F0;
  --color-champagne: #E8D5B5;
  --color-light-gold: #C9A96E;
  /* ... */
}
```

### Change Fonts

Edit `index.html` (Google Fonts link) and `src/index.css`:

```css
@theme {
  --font-serif: 'Cormorant Garamond', serif;
  --font-sans: 'Inter', sans-serif;
}
```

### Add New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Layout.tsx`

---

## 🐛 Troubleshooting

### "Setup Required" Warning

Go to **Setup Guide** in admin panel - it shows exactly what's missing.

### Images Not Uploading

- Check storage bucket `designs` exists and is public
- Verify you're logged in as admin
- Check browser console (F12) for errors

### Can't Login

- Verify user exists in Supabase Authentication
- Check "Auto Confirm User" was enabled
- Try resetting password

### Designs Not Showing

- Refresh page (Ctrl+F5)
- Check designs have images
- Verify designs are in a collection
- Check browser console for errors

---

## 📱 Features Checklist

### Public Site
- [x] Responsive design (mobile, tablet, desktop)
- [x] Hero section with call-to-action
- [x] Featured collections
- [x] Product galleries with multiple images
- [x] Booking request system
- [x] Contact form
- [x] Custom design requests
- [x] FAQ page
- [x] About page
- [x] Gallery page
- [x] SEO optimized
- [x] Fast loading (lazy images)

### Admin Panel
- [x] Secure login (Supabase Auth)
- [x] Dashboard with stats
- [x] Product management (CRUD)
- [x] Image upload to Supabase Storage
- [x] Collection management
- [x] Booking management
- [x] Message management
- [x] Setup guide
- [x] Status tracking
- [x] Mobile-friendly

---

## 🚀 Deployment Options

### GitHub Pages (Free)
- Automatic deployment with GitHub Actions
- URL: `https://yourusername.github.io/yourrepo/`

### Netlify (Free)
- Drag & drop `dist` folder
- Automatic deployments from Git
- URL: `https://your-site.netlify.app`

### Vercel (Free)
- Connect GitHub repo
- Automatic deployments
- URL: `https://your-site.vercel.app`

---

## 📞 Support

### Need Help?

1. **Check [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Most issues covered
2. **Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Step-by-step instructions
3. **Check browser console** - Press F12, look for errors
4. **Check Supabase logs** - Dashboard → Logs → API

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't login | Check Supabase Auth → Users |
| Images not uploading | Check Storage bucket exists |
| Designs not showing | Refresh page, check console |
| Booking not saving | Check RLS policies |
| "Setup Required" | Complete Setup Guide |

---

## 🎉 You're Ready!

Your complete jewellery store website is ready to go live!

**Next Steps:**
1. ✅ Complete Supabase setup (3 steps above)
2. ✅ Login to admin panel
3. ✅ Add your first product
4. ✅ Deploy to GitHub Pages
5. ✅ Share your site! 🎊

---

## 📄 License

This project is created for **Mimiko Studio**. Feel free to customize and use for your own jewellery store.

---

## 🙏 Credits

- **Design**: Premium jewellery store aesthetic
- **Images**: Unsplash (replace with your own product photos)
- **Icons**: Lucide React
- **Fonts**: Cormorant Garamond + Inter (Google Fonts)

---

**Built with ❤️ for Mimiko Studio**

**Questions?** Check the guides or open an issue!
