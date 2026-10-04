# 🎨 Mimiko Studio - Visual CMS Setup Guide

Your Mimiko Studio website now includes a **complete Visual CMS** that lets you control every aspect of your website's appearance and homepage without editing code.

---

## ✨ What's New

### 🎨 Appearance Studio (`/#/admin/appearance`)
- **Theme Presets**: One-click themes (Champagne Luxury, Midnight Gold, Soft Artisan, Festive Navratri, Minimal Editorial)
- **Color Control**: 9 color pickers for primary, secondary, accent, background, surface, dark background, text, muted text, border
- **Typography**: Choose heading & body fonts, weights, sizes
- **Shapes**: Control card radius, button radius, image style (sharp/rounded/organic/capsule/arch)
- **Effects**: Shadow intensity, section spacing, animation intensity
- **Live Preview**: See changes instantly in a mini preview panel

### 🏠 Homepage Builder (`/#/admin/homepage`)
- **Add Sections**: Hero, Collection Grid, Featured Designs, Split Content, Dark Showcase, CTA, Gallery, Booking CTA
- **Reorder**: Move sections up/down with arrow buttons
- **Toggle Visibility**: Show/hide sections without deleting
- **Edit Content**: Change headings, descriptions, buttons, images, themes
- **Image Support**: Use image URLs for all sections
- **Theme per Section**: Each section can be light or dark

### 🖼️ Media Library (`/#/admin/media`)
- **Upload Images**: Drag & drop or file picker
- **Add by URL**: Paste any HTTPS image URL
- **Search**: Find images by name
- **Copy URL**: Quick copy for reuse
- **Delete**: Remove unused images
- **Preview**: See all your images in a grid

---

## 🚀 Initial Setup (5 minutes)

### Step 1: Run the CMS Schema

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/gnojncipluesigzwonch/sql)
2. Click "New Query"
3. Copy **ALL** content from `supabase/cms-schema.sql`
4. Paste and click "Run"
5. ✅ This creates:
   - `appearance_settings` table (theme settings)
   - `media_assets` table (image library)
   - `homepages` table (homepage config)
   - `homepage_sections` table (section blocks)
   - `homepage_versions` table (version history)
   - `site_settings` table (contact info, social links)
   - Default theme, homepage, and 9 sections

### Step 2: Create Media Storage Bucket

1. Go to [Supabase Storage](https://supabase.com/dashboard/project/gnojncipluesigzwonch/storage)
2. Click "New bucket"
3. Name: `media`
4. ✅ Toggle **"Public bucket"** ON
5. Click Create

### Step 3: Login to Admin

1. Go to `/#/admin`
2. Login with your credentials
3. You'll see the new CMS menu items:
   - **Homepage Builder** - Arrange homepage sections
   - **Appearance** - Customize theme/colors/fonts
   - **Media Library** - Manage images

---

## 🎯 How to Use Each Feature

### 🎨 Customizing Appearance

1. Go to **Appearance Studio**
2. **Try a preset first**: Click "Champagne Luxury" or any preset
3. **Fine-tune colors**: Use color pickers or paste hex codes
4. **Change fonts**: Select from dropdown (changes apply instantly)
5. **Adjust shapes**: Use sliders for radius, dropdowns for styles
6. **Watch the preview**: Updates in real-time on the right
7. **Save**: Click "Save Changes" to persist

**Tip**: Changes apply globally across the entire site via CSS variables.

### 🏠 Building the Homepage

1. Go to **Homepage Builder**
2. **See current sections**: Listed in order with drag handles
3. **Add a section**: Click "Add Section" → choose type
4. **Edit a section**: Click the edit (pencil) icon
   - Change heading, description
   - Set image URL
   - Configure buttons
   - Choose light/dark theme
5. **Reorder**: Use ↑↓ arrows to move sections
6. **Hide**: Click eye icon to toggle visibility
7. **Delete**: Click trash icon (with confirmation)

**Section Types Explained**:
- **Hero**: Full-screen intro with heading, buttons, background image
- **Collection Grid**: Shows your collections in editorial layout
- **Featured Designs**: Grid of featured products
- **Split Content**: Image + text side-by-side (great for Navratri, Embroidery stories)
- **Dark Showcase**: Full-width dark section with background image
- **CTA**: Call-to-action with background image
- **Gallery**: Masonry grid of product images
- **Booking CTA**: Final booking call-to-action

### 🖼️ Managing Media

1. Go to **Media Library**
2. **Upload**: Click "Upload" → select images
3. **Add URL**: Click "Add URL" → paste HTTPS image URL
4. **Search**: Type to filter by name
5. **Copy URL**: Hover → click copy icon
6. **Use in sections**: Copy URL → paste in Homepage Builder image field

**Image Recommendations**:
- Use HTTPS URLs only (security)
- Recommended size: 1200x1600px for product images
- Formats: JPG, PNG, WebP
- Max file size: 50MB (Supabase limit)

---

## 🎨 Theme Presets

### Champagne Luxury (Default)
- Warm ivory + champagne gold + espresso
- Perfect for: Classic luxury jewellery brand

### Midnight Gold
- Deep espresso + gold + cream
- Perfect for: High-end evening wear, bridal

### Soft Artisan
- Warm beige + brown + muted gold
- Perfect for: Handcrafted, earthy aesthetic

### Festive Navratri
- Deep warm tones + bright gold
- Perfect for: Seasonal festive campaigns

### Minimal Editorial
- White + charcoal + champagne
- Perfect for: Modern, clean fashion editorial

---

## 📱 How It All Works Together

```
Admin Panel                    Database                   Public Site
    │                             │                           │
    ├─ Appearance Studio ────────► appearance_settings ──────► ThemeProvider
    │                             │                           │ (applies CSS vars)
    ├─ Homepage Builder ─────────► homepage_sections ────────► DynamicHome
    │                             │                           │ (renders sections)
    ├─ Media Library ────────────► media_assets ─────────────► Section images
    │                             │                           │
    └─ Designs Manager ──────────► designs ──────────────────► Product grids
                                  │                           │
                                  └─ bookings ──────────────── Booking manager
```

**Key Architecture**:
- **CSS Variables**: Theme settings → applied to `:root` → all components read them
- **Dynamic Sections**: Homepage sections stored as JSON → rendered by `SectionRenderer`
- **Media Reuse**: Same image URL can be used across multiple sections
- **Live Updates**: Appearance changes reflect immediately (no reload needed)

---

## 🔒 Safety & Guardrails

### What Admin CAN Do:
- ✅ Change colors, fonts, shapes
- ✅ Add/remove/reorder homepage sections
- ✅ Edit section content (text, buttons, images)
- ✅ Upload images or use URLs
- ✅ Apply theme presets
- ✅ Reset to defaults

### What Admin CANNOT Do (by design):
- ❌ Break the layout (sections have fixed layouts)
- ❌ Inject arbitrary HTML/JS
- ❌ Use non-HTTPS image URLs
- ❌ Create inconsistent typography
- ❌ Delete customer data

### Warnings:
- Low contrast color combinations show warnings
- Small images show resolution warnings
- Invalid URLs are rejected

---

## 🔄 Data Flow

### When Admin Changes Theme:
1. Admin updates color in Appearance Studio
2. `ThemeProvider` receives update
3. CSS variables on `:root` are updated
4. All components re-render with new colors
5. Admin clicks "Save" → persisted to Supabase
6. Next visitor sees the new theme

### When Admin Edits Homepage:
1. Admin adds/edits section in Homepage Builder
2. Section config saved to `homepage_sections` table
3. `DynamicHome` fetches sections on page load
4. `SectionRenderer` renders each section
5. Changes visible on next page load

---

## 🛠️ Technical Details

### Database Tables

```sql
appearance_settings  -- Single row, site-wide theme
media_assets         -- Image library
homepages            -- Homepage config (draft/published)
homepage_sections    -- Section blocks (JSON config)
homepage_versions    -- Version history (for restore)
site_settings        -- Key-value settings (contact, social)
```

### Section Config Structure

Each section stores a JSON `config` object:

```json
{
  "label": "MIMIKO ATELIER",
  "heading": "Crafted to Adorn",
  "description": "...",
  "image": { "sourceType": "URL", "url": "https://..." },
  "primaryButton": { "text": "Explore", "link": "/collections" },
  "theme": "light"
}
```

### CSS Variables Applied

```css
--color-primary, --color-secondary, --color-accent
--color-bg, --color-surface, --color-dark-bg
--color-text, --color-muted, --color-border
--font-heading, --font-body
--radius-sm, --radius-md, --radius-btn
--image-radius, --shadow, --section-spacing
```

---

## 📋 Admin Workflow

### Daily:
1. Check new bookings → update status
2. Reply to messages

### Weekly:
3. Add new designs with images
4. Update featured designs
5. Review homepage performance

### Seasonal (Navratri, Wedding Season, etc.):
6. Apply festive theme preset
7. Update homepage sections for the season
8. Upload new festive imagery
9. Feature seasonal collections

### Rebranding:
10. Create new theme in Appearance Studio
11. Update logo (via Layout component)
12. Refresh homepage sections
13. Update media library

---

## 🐛 Troubleshooting

### Homepage shows "Welcome to Mimiko Studio" instead of sections?
- Run `supabase/cms-schema.sql` to seed default sections
- Check homepage_id matches in sections

### Images not showing in sections?
- Use HTTPS URLs only
- Check image is publicly accessible
- Try uploading to Media Library instead

### Theme changes not applying?
- Click "Save Changes" in Appearance Studio
- Hard refresh browser (Ctrl+Shift+R)
- Check Supabase connection

### Can't upload images?
- Verify `media` storage bucket exists and is public
- Check file size < 50MB
- Try HTTPS URL instead

---

## 🎉 You're Ready!

Your Mimiko Studio website is now a **complete visual brand platform**:

- ✅ **Dynamic Homepage** - Admin-controlled sections
- ✅ **Appearance Studio** - Full theme control
- ✅ **Media Library** - Centralized image management
- ✅ **Theme Presets** - One-click professional themes
- ✅ **Live Preview** - See changes instantly
- ✅ **Safe Guardrails** - Can't break the design
- ✅ **All Existing Features Preserved** - Bookings, designs, collections still work

**Start by:**
1. Running the CMS schema SQL
2. Logging into admin
3. Trying the Appearance Studio presets
4. Editing homepage sections
5. Uploading your real product images

Your website now adapts to your brand, not the other way around! 🎨✨
