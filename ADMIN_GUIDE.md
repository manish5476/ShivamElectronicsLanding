# 🎨 Mimiko Studio - Admin Panel Guide

Your complete admin system is ready! This guide will help you set up and use the admin panel to manage your jewellery store.

## 📋 What You Can Do

### ✅ Admin Features
- **Manage Designs**: Add, edit, delete products with multiple images
- **Manage Collections**: Organize products into categories
- **View Bookings**: See all customer booking requests
- **View Messages**: Read customer inquiries from the contact form
- **Upload Images**: Direct to Supabase Storage (no Cloudinary needed)
- **Set Pricing**: Fixed price, "starting from", or "on request"
- **Track Status**: Update booking status (NEW → CONTACTED → CONFIRMED → COMPLETED)

---

## 🚀 Quick Start (3 Steps)

### Step 1: Run the Database Schema

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/gnojncipluesigzwonch/sql)
2. Click "New Query"
3. Copy **ALL** the SQL from `supabase/schema.sql`
4. Paste it into the editor
5. Click "Run" (or press Ctrl+Enter)
6. Wait ~10 seconds for it to complete

✅ This creates all tables, security policies, and default collections.

### Step 2: Create Storage Bucket

1. Go to [Supabase Storage](https://supabase.com/dashboard/project/gnojncipluesigzwonch/storage)
2. Click "New bucket"
3. Name: `designs`
4. ✅ Toggle **"Public bucket"** ON
5. Click "Create bucket"

✅ This allows you to upload product images.

### Step 3: Create Admin User

1. Go to [Supabase Authentication](https://supabase.com/dashboard/project/gnojncipluesigzwonch/auth/users)
2. Click "Add user" → "Create new user"
3. Enter your email (e.g., `admin@mimikostudio.com`)
4. Choose a strong password
5. ✅ Check **"Auto Confirm User"**
6. Click "Create user"

✅ This creates your admin login.

---

## 🔐 Login to Admin Panel

1. Go to your website: `https://yourusername.github.io/yourrepo/`
2. Click "Admin" in the footer (or go to `/#/admin`)
3. Enter your email and password
4. You're in! 🎉

---

## 📦 Managing Designs

### Add a New Design

1. Go to **Designs** in the admin menu
2. Click **"Add Design"** button
3. Fill in the form:
   - **Name**: Product name (e.g., "Pearl Drop Earrings")
   - **Slug**: Auto-generated from name (e.g., `pearl-drop-earrings`)
   - **Description**: Short description for product cards
   - **Long Description**: Detailed description for product page
   - **Collection**: Choose a category (Jewellery, Navratri, etc.)
   - **Category**: Specific type (Earrings, Necklace, etc.)
   - **Price**: Enter price (e.g., "₹2,500") or leave empty for "on request"
   - **Price Type**: 
     - "Fixed Price" - shows exact price
     - "Starting From" - shows "Starting from ₹2,500"
     - "On Request" - shows "Price on request"
   - **Availability**: 
     - "In Stock" - ready to ship
     - "Made to Order" - custom order
     - "Sold" - no longer available
   - **Customizable**: Check if customers can request customizations
   - **Featured**: Check to show on homepage
   - **Material**: What it's made of (e.g., "Gold-plated brass, freshwater pearls")
   - **Craft**: Technique used (e.g., "Hand-set stone work")
   - **Occasion**: When to wear it (e.g., "Wedding, Festive")
   - **Care**: Care instructions
   - **Tags**: Comma-separated keywords (e.g., "earrings, pearl, festive")

4. **Upload Images**:
   - Click the upload area or drag & drop
   - Select multiple images (main view, close-up, lifestyle, etc.)
   - Images upload to Supabase Storage automatically
   - Click the star (★) to set the primary image
   - Click X to remove an image

5. Click **"Create Design"**

✅ Your product is now live on the website!

### Edit a Design

1. Go to **Designs**
2. Find the product in the table
3. Click the **edit icon** (pencil) on the right
4. Make your changes
5. Click **"Update Design"**

### Delete a Design

1. Go to **Designs**
2. Find the product
3. Click the **delete icon** (trash can)
4. Confirm deletion

⚠️ This cannot be undone. Images are also deleted from storage.

---

## 📁 Managing Collections

Collections are categories like "Jewellery", "Navratri", "Embroidery", etc.

### Add a Collection

1. Go to **Collections**
2. Click **"Add Collection"**
3. Fill in:
   - **Name**: Collection name
   - **Slug**: Auto-generated (e.g., `navratri-collection`)
   - **Description**: Short description
   - **Cover Image URL**: Optional - paste an image URL
   - **Sort Order**: Number to control display order (1, 2, 3...)
   - **Featured**: Check to show on homepage

4. Click **"Create Collection"**

### Edit/Delete Collections

Same as designs - use the edit/delete icons in the table.

---

## 📋 Managing Bookings

When customers submit booking requests, they appear here.

### View Bookings

1. Go to **Bookings**
2. See all bookings in a table
3. Filter by status: ALL, NEW, CONTACTED, CONFIRMED, COMPLETED, CANCELLED

### Update Booking Status

1. Find the booking
2. Click the status dropdown
3. Choose new status:
   - **NEW**: Just received
   - **CONTACTED**: You've reached out to customer
   - **CONFIRMED**: Order confirmed
   - **COMPLETED**: Order fulfilled
   - **CANCELLED**: Order cancelled

### View Booking Details

1. Click the **eye icon** on a booking
2. See full details:
   - Customer name, email, phone
   - Design they want
   - Occasion, date, quantity
   - Customization requests
   - Color preferences
   - Additional notes

3. Reply to customer via email or WhatsApp

### Delete a Booking

Click the **trash icon** to delete (cannot be undone).

---

## 💬 Managing Messages

When customers use the contact form, messages appear here.

### View Messages

1. Go to **Messages**
2. See all contact form submissions
3. Each message shows:
   - Customer name and email
   - Subject (if provided)
   - Full message content
   - Date received

### Reply to Messages

1. Click the **email icon** next to a message
2. Your email client opens with the customer's address
3. Reply directly

---

## 🖼️ Image Upload

### How It Works

- Images upload directly to **Supabase Storage**
- No need for Cloudinary or external services
- Images are stored in the `designs` bucket
- Public URLs are generated automatically

### Upload Limits

- **File size**: Up to 50MB per image (Supabase free tier)
- **Formats**: JPG, PNG, WebP, GIF
- **Storage**: 1GB total on free tier (plenty for a jewellery store)

### Best Practices

1. **Resize images** before uploading (recommended: 1200x1600px)
2. **Use WebP format** for smaller file sizes
3. **Upload multiple angles**: front, back, close-up, lifestyle
4. **Set primary image**: Click the star (★) on the best shot
5. **Use descriptive filenames**: `pearl-earrings-front.jpg` instead of `IMG_1234.jpg`

---

## 📊 Dashboard Overview

The dashboard shows:

- **Total Designs**: Number of products
- **Total Collections**: Number of categories
- **Total Bookings**: All booking requests
- **Total Messages**: All contact form submissions
- **Recent Bookings**: Latest 5 bookings with status

Use this to quickly see what needs your attention.

---

## 🔧 Troubleshooting

### "Setup Required" Warning

If you see this on the dashboard:

1. Go to **Setup Guide** in the admin menu
2. Follow the step-by-step instructions
3. Click "Refresh status check" when done

### Images Not Uploading

**Problem**: Upload fails or shows error

**Solutions**:
1. Check if storage bucket `designs` exists and is public
2. Verify you're logged in as admin
3. Check browser console for errors (F12 → Console)
4. Try a smaller image file (< 5MB)

### Can't Login

**Problem**: Login fails with "Invalid credentials"

**Solutions**:
1. Go to [Supabase Authentication](https://supabase.com/dashboard/project/gnojncipluesigzwonch/auth/users)
2. Verify your user exists
3. Check "Auto Confirm User" was enabled
4. Try resetting password: Click "..." → "Reset Password"

### Designs Not Showing on Website

**Problem**: You added designs but they don't appear on the public site

**Solutions**:
1. Refresh the page (Ctrl+F5)
2. Check if designs have images (required for display)
3. Verify designs are in a collection
4. Check browser console for errors

### Booking Not Saving

**Problem**: Customer submits booking but it doesn't appear in admin

**Solutions**:
1. Check browser console for errors
2. Verify Supabase is configured correctly
3. Check RLS policies allow public inserts (should be set by schema.sql)
4. Try submitting a test booking yourself

---

## 🎯 Daily Workflow

### Morning Routine

1. **Login to admin panel**
2. **Check Dashboard** - see new bookings/messages
3. **Review NEW bookings** - contact customers
4. **Update booking status** - mark as CONTACTED
5. **Reply to messages** - respond to inquiries

### When Adding New Products

1. **Take photos** - multiple angles, good lighting
2. **Edit images** - resize, optimize
3. **Add Design** - fill all details, upload images
4. **Set as Featured** - if it's a highlight piece
5. **Preview** - view on public site to check

### Weekly Tasks

1. **Review all bookings** - update statuses
2. **Check messages** - respond to any unanswered
3. **Update inventory** - mark sold items, add new arrivals
4. **Featured products** - rotate featured items on homepage

---

## 📱 Mobile Access

The admin panel works on mobile! You can:

- View bookings on the go
- Update booking status
- Read messages
- Check dashboard stats

**Note**: Adding designs is easier on desktop (image upload works better).

---

## 🔒 Security

### Who Can Access Admin?

- Only users created in Supabase Authentication
- You control who has access
- You can delete users anytime

### What's Protected?

- ✅ Public can: View designs, submit bookings, send messages
- ❌ Public cannot: Edit designs, delete products, view all bookings
- ✅ Admin can: Everything

### Best Practices

1. **Use strong password** for admin account
2. **Don't share admin credentials**
3. **Logout when done** (especially on shared computers)
4. **Regular backups** - export your data periodically

---

## 📞 Support

### Need Help?

1. **Check Setup Guide** - most issues are covered there
2. **Check browser console** - press F12, look for errors
3. **Check Supabase logs** - Dashboard → Logs → API
4. **Review this guide** - search for your issue

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't login | Check Supabase Authentication → Users |
| Images not uploading | Check Storage bucket exists and is public |
| Designs not showing | Refresh page, check browser console |
| Booking not saving | Check RLS policies in schema.sql |
| "Setup Required" warning | Complete Setup Guide steps |

---

## 🎉 You're Ready!

Your admin panel is fully functional. You can now:

- ✅ Add unlimited products with images
- ✅ Manage collections and categories
- ✅ Handle all customer bookings
- ✅ Respond to inquiries
- ✅ Track order status
- ✅ Update your store anytime

**Start by adding your first product!** 📦

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)

---

**Happy managing! 🎨✨**
