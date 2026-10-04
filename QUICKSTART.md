# 🚀 Mimiko Studio - Quick Start

Your complete jewellery store website is ready! Here's everything you need to know.

---

## ✅ What You Have

### 🌐 Public Website (14 pages)
- Home, Collections, Products, Navratri, Embroidery, Custom Designs, Booking, Contact, Gallery, FAQ, About, Privacy, Terms, 404

### 🔐 Admin Panel (/#/admin)
- **Dashboard** - Overview stats
- **Designs Manager** - Add/edit/delete products with images
- **Collections Manager** - Manage categories
- **Bookings Manager** - View customer requests
- **Messages Manager** - Read contact inquiries
- **Setup Guide** - Step-by-step configuration

### 🗄️ Database (Supabase)
- PostgreSQL database
- Image storage
- Authentication
- Auto-generated API
- Row Level Security

---

## 🎯 What You Need To Do (3 Steps)

### Step 1: Run Database Schema (2 minutes)

1. Go to: https://supabase.com/dashboard/project/gnojncipluesigzwonch/sql
2. Click "New Query"
3. Open `supabase/schema.sql` from this project
4. Copy ALL the SQL
5. Paste into Supabase SQL Editor
6. Click "Run"
7. ✅ Done!

### Step 2: Create Storage Bucket (30 seconds)

1. Go to: https://supabase.com/dashboard/project/gnojncipluesigzwonch/storage
2. Click "New bucket"
3. Name: `designs`
4. ✅ Toggle "Public bucket" ON
5. Click "Create bucket"
6. ✅ Done!

### Step 3: Create Admin User (1 minute)

1. Go to: https://supabase.com/dashboard/project/gnojncipluesigzwonch/auth/users
2. Click "Add user" → "Create new user"
3. Email: `admin@mimikostudio.com` (or your email)
4. Password: Choose a strong password
5. ✅ Check "Auto Confirm User"
6. Click "Create user"
7. ✅ Done!

---

## 🎉 That's It!

Your website is ready to use!

### Access Your Site

- **Public Site**: https://yourusername.github.io/yourrepo/
- **Admin Panel**: https://yourusername.github.io/yourrepo/#/admin

### Login to Admin

1. Go to `/#/admin`
2. Enter your email and password
3. You're in! 🎊

---

## 📦 First Things to Do in Admin

### 1. Check Setup Guide
- Go to **Setup Guide** in admin menu
- It shows what's configured
- Complete any missing steps

### 2. Add Your First Product
- Go to **Designs** → **Add Design**
- Fill in product details
- Upload images
- Click "Create Design"
- View it on the public site!

### 3. Explore the Admin
- **Dashboard** - See stats
- **Collections** - Manage categories
- **Bookings** - View customer requests
- **Messages** - Read inquiries

---

## 📖 Documentation

- **[README.md](./README.md)** - Complete project overview
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Detailed admin panel guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Step-by-step setup instructions

---

## 🆘 Need Help?

### Common Issues

**Can't login?**
- Check user exists in Supabase Authentication
- Verify "Auto Confirm User" was checked

**Images not uploading?**
- Check storage bucket `designs` exists and is public
- Verify you're logged in as admin

**"Setup Required" warning?**
- Go to Setup Guide in admin
- Complete the steps shown

**Designs not showing?**
- Refresh page (Ctrl+F5)
- Check designs have images
- Check browser console (F12) for errors

---

## 🌐 Deploy to GitHub Pages

### Option 1: GitHub Actions (Automatic)

1. Create `.github/workflows/deploy.yml` (see README.md)
2. Add secrets to GitHub repo:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Push to main branch
4. Site deploys automatically!

### Option 2: Manual Deployment

```bash
npm run build
# Upload dist/ folder to gh-pages branch
```

---

## 💡 Tips

### Adding Products
- Take multiple photos (front, back, close-up, lifestyle)
- Resize images before upload (1200x1600px recommended)
- Use descriptive filenames
- Set primary image (click the star ★)

### Managing Bookings
- Check dashboard daily for new requests
- Update status as you progress (NEW → CONTACTED → CONFIRMED)
- Reply to customers via email/WhatsApp

### Customization
- Change colors in `src/index.css`
- Change fonts in `index.html`
- Add new pages in `src/pages/`

---

## 📊 What's Included

### Frontend
- ✅ 14 public pages
- ✅ Admin panel with 6 sections
- ✅ Responsive design
- ✅ Image galleries
- ✅ Booking system
- ✅ Contact forms
- ✅ SEO optimized

### Backend (Supabase)
- ✅ PostgreSQL database
- ✅ Image storage (1GB free)
- ✅ Authentication
- ✅ Auto-generated API
- ✅ Row Level Security
- ✅ Real-time ready

### Features
- ✅ Multi-image upload
- ✅ Product management
- ✅ Collection management
- ✅ Booking tracking
- ✅ Message management
- ✅ Setup wizard
- ✅ Mobile-friendly

---

## 🎯 Quick Commands

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Deploy (if using gh-pages)
npm run deploy
```

---

## 🔗 Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/gnojncipluesigzwonch
- **SQL Editor**: https://supabase.com/dashboard/project/gnojncipluesigzwonch/sql
- **Storage**: https://supabase.com/dashboard/project/gnojncipluesigzwonch/storage
- **Authentication**: https://supabase.com/dashboard/project/gnojncipluesigzwonch/auth/users
- **Settings**: https://supabase.com/dashboard/project/gnojncipluesigzwonch/settings

---

## ✅ Checklist

Before going live:

- [ ] Run database schema
- [ ] Create storage bucket
- [ ] Create admin user
- [ ] Login to admin panel
- [ ] Add first product
- [ ] Test booking system
- [ ] Test contact form
- [ ] Deploy to GitHub Pages
- [ ] Share your site! 🎊

---

## 🎉 You're All Set!

Your complete jewellery store website is ready. Start adding products and share your site with the world!

**Questions?** Check the documentation or the Setup Guide in the admin panel.

---

**Built with ❤️ for Mimiko Studio**
