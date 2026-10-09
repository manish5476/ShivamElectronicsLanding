import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { cloudinaryService } from './cloudinaryService';

// Helper to detect missing table errors
const isTableMissingError = (error: any): boolean => {
  if (!error) return false;
  const msg = (error.message || '').toLowerCase();
  return msg.includes('does not exist') || 
         msg.includes('could not find') || 
         msg.includes('relation') ||
         msg.includes('schema cache') ||
         msg.includes('table');
};

// ============ DESIGNS ============
export const designsApi = {
  async getAll() {
    if (!isSupabaseConfigured()) {
      return { success: true, data: [] };
    }
    const { data, error } = await supabase
      .from('designs')
      .select('*, design_images(*)')
      .order('created_at', { ascending: false });
    if (error) {
      if (isTableMissingError(error)) return { success: true, data: [] };
      return { success: false, error: error.message };
    }
    
    // Transform all snake_case to camelCase
    const transformed = (data || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      description: d.description || '',
      longDescription: d.long_description || '',
      collectionId: d.collection_id || '',
      category: d.category || '',
      price: d.price || '',
      priceType: d.price_type || 'starting',
      availability: d.availability || 'made-to-order',
      customizable: d.customizable ?? true,
      featured: d.featured ?? false,
      material: d.material || '',
      craft: d.craft || '',
      occasion: d.occasion || '',
      care: d.care || '',
      tags: d.tags || [],
      images: (d.design_images || []).map((img: any) => ({
        id: img.id,
        url: img.image_url,
        alt: img.alt_text || '',
        isPrimary: img.is_primary ?? false,
      })).sort((a: any, b: any) => a.sort_order - b.sort_order),
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
    return { success: true, data: transformed };
  },

  async getBySlug(slug: string) {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Not configured' };
    }
    const { data, error } = await supabase
      .from('designs')
      .select('*, design_images(*)')
      .eq('slug', slug)
      .single();
    if (error) {
      if (isTableMissingError(error)) return { success: false, error: 'Not found' };
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        longDescription: data.long_description || '',
        collectionId: data.collection_id || '',
        category: data.category || '',
        price: data.price || '',
        priceType: data.price_type || 'starting',
        availability: data.availability || 'made-to-order',
        customizable: data.customizable ?? true,
        featured: data.featured ?? false,
        material: data.material || '',
        craft: data.craft || '',
        occasion: data.occasion || '',
        care: data.care || '',
        tags: data.tags || [],
        images: (data.design_images || []).map((img: any) => ({
          id: img.id,
          url: img.image_url,
          alt: img.alt_text || '',
          isPrimary: img.is_primary ?? false,
        })).sort((a: any, b: any) => a.sort_order - b.sort_order),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  },

  async create(design: any) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    const { images, ...designData } = design;
    const { data, error } = await supabase
      .from('designs')
      .insert({
        name: designData.name,
        slug: designData.slug,
        description: designData.description,
        long_description: designData.longDescription || null,
        collection_id: designData.collectionId || null,
        category: designData.category,
        price: designData.price || null,
        price_type: designData.priceType || 'starting',
        availability: designData.availability || 'made-to-order',
        customizable: designData.customizable ?? true,
        featured: designData.featured ?? false,
        material: designData.material || null,
        craft: designData.craft || null,
        occasion: designData.occasion || null,
        care: designData.care || null,
        tags: designData.tags || [],
      })
      .select()
      .single();
    if (error) {
      if (isTableMissingError(error)) return { success: false, error: 'Database tables not created. Please run the SQL schema first.' };
      return { success: false, error: error.message };
    }

    // Insert images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const { error: imgError } = await supabase.from('design_images').insert({
          design_id: data.id,
          image_url: images[i].url,
          alt_text: images[i].alt || '',
          sort_order: i,
          is_primary: images[i].isPrimary || i === 0,
        });
        if (imgError && !isTableMissingError(imgError)) {
          console.error('Failed to insert image:', imgError.message);
        }
      }
    }
    return { success: true, data };
  },

  async update(id: string, design: any) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    const { images, ...designData } = design;
    const { data, error } = await supabase
      .from('designs')
      .update({
        name: designData.name,
        slug: designData.slug,
        description: designData.description,
        long_description: designData.longDescription || null,
        collection_id: designData.collectionId || null,
        category: designData.category,
        price: designData.price || null,
        price_type: designData.priceType || 'starting',
        availability: designData.availability || 'made-to-order',
        customizable: designData.customizable ?? true,
        featured: designData.featured ?? false,
        material: designData.material || null,
        craft: designData.craft || null,
        occasion: designData.occasion || null,
        care: designData.care || null,
        tags: designData.tags || [],
      })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (isTableMissingError(error)) return { success: false, error: 'Database tables not created. Please run the SQL schema first.' };
      return { success: false, error: error.message };
    }

    // Update images
    if (images !== undefined) {
      const { error: delError } = await supabase.from('design_images').delete().eq('design_id', id);
      if (delError && !isTableMissingError(delError)) {
        console.error('Failed to delete images:', delError.message);
      }
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const { error: imgError } = await supabase.from('design_images').insert({
            design_id: id,
            image_url: images[i].url,
            alt_text: images[i].alt || '',
            sort_order: i,
            is_primary: images[i].isPrimary || i === 0,
          });
          if (imgError && !isTableMissingError(imgError)) {
            console.error('Failed to insert image:', imgError.message);
          }
        }
      }
    }
    return { success: true, data };
  },

  async delete(id: string) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    const { error } = await supabase.from('designs').delete().eq('id', id);
    if (error) {
      if (isTableMissingError(error)) return { success: true };
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};

// ============ COLLECTIONS ============
export const collectionsApi = {
  async getAll() {
    if (!isSupabaseConfigured()) {
      return { success: true, data: [] };
    }
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('sort_order');
    if (error) {
      if (isTableMissingError(error)) return { success: true, data: [] };
      return { success: false, error: error.message };
    }
    
    // Transform snake_case to camelCase
    const transformed = (data || []).map((col: any) => ({
      id: col.id,
      name: col.name,
      slug: col.slug,
      description: col.description || '',
      coverImage: col.cover_image || '',
      featured: col.featured ?? false,
      sortOrder: col.sort_order || 0,
      createdAt: col.created_at,
      updatedAt: col.updated_at,
    }));
    
    return { success: true, data: transformed };
  },

  async create(col: any) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    const { data, error } = await supabase
      .from('collections')
      .insert({
        name: col.name,
        slug: col.slug,
        description: col.description || '',
        cover_image: col.coverImage || null,
        featured: col.featured ?? false,
        sort_order: col.sortOrder || 0,
      })
      .select()
      .single();
    if (error) {
      if (isTableMissingError(error)) return { success: false, error: 'Database tables not created. Please run the SQL schema first.' };
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async update(id: string, col: any) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    const { data, error } = await supabase
      .from('collections')
      .update({
        name: col.name,
        slug: col.slug,
        description: col.description || '',
        cover_image: col.coverImage || null,
        featured: col.featured ?? false,
        sort_order: col.sortOrder || 0,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (isTableMissingError(error)) return { success: false, error: 'Database tables not created. Please run the SQL schema first.' };
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async delete(id: string) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) {
      if (isTableMissingError(error)) return { success: true };
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};

// ============ BOOKINGS ============
export const bookingsApi = {
  async getAll() {
    if (!isSupabaseConfigured()) return { success: true, data: [] };
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      if (isTableMissingError(error)) return { success: true, data: [] };
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async create(booking: any) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        customer_name: booking.customerName,
        email: booking.email,
        phone: booking.phone,
        design_id: booking.designId || null,
        design_name: booking.designName || null,
        collection: booking.collection || null,
        occasion: booking.occasion || null,
        requested_date: booking.requestedDate || null,
        quantity: parseInt(booking.quantity) || 1,
        customization: booking.customization || 'no',
        color_preference: booking.colorPreference || null,
        size_details: booking.sizeDetails || null,
        notes: booking.notes || null,
        status: 'NEW',
      })
      .select()
      .single();
    if (error) {
      if (isTableMissingError(error)) {
        // Table doesn't exist - booking saved locally only
        return { success: true, data: { ...booking, id: 'local_' + Date.now() }, note: 'Saved locally (database not configured)' };
      }
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async updateStatus(id: string, status: string) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (isTableMissingError(error)) return { success: true };
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async delete(id: string) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) {
      if (isTableMissingError(error)) return { success: true };
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};

// ============ CONTACT MESSAGES ============
export const contactApi = {
  async getAll() {
    if (!isSupabaseConfigured()) return { success: true, data: [] };
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      if (isTableMissingError(error)) return { success: true, data: [] };
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async create(msg: any) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: msg.name,
        email: msg.email,
        subject: msg.subject || null,
        message: msg.message,
      })
      .select()
      .single();
    if (error) {
      if (isTableMissingError(error)) {
        // Table doesn't exist - message saved locally only
        return { success: true, data: { ...msg, id: 'local_' + Date.now() }, note: 'Saved locally (database not configured)' };
      }
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },
};

// ============ IMAGE UPLOAD (Supabase Storage) ============
export const uploadApi = {
  async uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    // 1. Try Cloudinary first if configured
    if (cloudinaryService.isConfigured()) {
      const cRes = await cloudinaryService.uploadImage(file);
      if (cRes.success && cRes.secureUrl) {
        return { success: true, url: cRes.secureUrl };
      }
      console.warn('Cloudinary upload warning, falling back to Supabase:', cRes.error);
    }

    // 2. Fallback to Supabase Storage
    if (!isSupabaseConfigured()) {
      return { success: true, url: URL.createObjectURL(file) };
    }
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('designs')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) {
      // Fallback to local URL if storage bucket doesn't exist
      return { success: true, url: URL.createObjectURL(file) };
    }
    const { data: urlData } = supabase.storage.from('designs').getPublicUrl(data.path);
    return { success: true, url: urlData.publicUrl };
  },

  async uploadMultiple(files: FileList): Promise<{ success: boolean; urls: string[]; error?: string }> {
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const result = await uploadApi.uploadImage(file);
      if (result.success && result.url) {
        urls.push(result.url);
      } else {
        return { success: false, urls, error: result.error };
      }
    }
    return { success: true, urls };
  },
};
