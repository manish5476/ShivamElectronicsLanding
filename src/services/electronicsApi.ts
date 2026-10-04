// ============================================
// SHIVAM ELECTRONICS - API SERVICE
// ============================================
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_SHOWROOM_PRODUCTS } from '../data/showroomProducts';
import type {
  Brand,
  Category,
  CategoryAttribute,
  Product,
  ProductImage,
  ProductSpecification,
  Banner,
  Offer,
  Enquiry,
  ApiResponse,
  ProductFilters,
  DashboardStats
} from '../types/electronics';

// Helper to detect missing table errors
const isTableMissingError = (error: any): boolean => {
  if (!error) return false;
  if (error.code === 'PGRST205' || error.code === 'PGRST200') return true;
  const msg = (error.message || '').toLowerCase();
  return msg.includes('does not exist') || 
         msg.includes('could not find') || 
         msg.includes('relation') ||
         msg.includes('schema cache') ||
         msg.includes('table') ||
         msg.includes('pgrst205') ||
         msg.includes('pgrst200');
};

// ============================================
// BRANDS API
// ============================================
export const brandsApi = {
  async getAll(): Promise<ApiResponse<Brand[]>> {
    if (!isSupabaseConfigured()) return { success: true, data: [] };
    
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('sort_order');
      
      if (error) {
        if (isTableMissingError(error)) return { success: true, data: [] };
        return { success: false, error: error.message };
      }
      
      const brands: Brand[] = (data || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        logoUrl: b.logo_url,
        description: b.description,
        website: b.website,
        featured: b.featured,
        status: b.status,
        sortOrder: b.sort_order,
        seoTitle: b.seo_title,
        seoDescription: b.seo_description,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      }));
      
      return { success: true, data: brands };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getBySlug(slug: string): Promise<ApiResponse<Brand>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        if (isTableMissingError(error)) return { success: false, error: 'Not found' };
        return { success: false, error: error.message };
      }
      
      const brand: Brand = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        logoUrl: data.logo_url,
        description: data.description,
        website: data.website,
        featured: data.featured,
        status: data.status,
        sortOrder: data.sort_order,
        seoTitle: data.seo_title,
        seoDescription: data.seo_description,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      return { success: true, data: brand };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async create(brand: Partial<Brand>): Promise<ApiResponse<Brand>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert({
          name: brand.name,
          slug: brand.slug,
          logo_url: brand.logoUrl,
          description: brand.description,
          website: brand.website,
          featured: brand.featured ?? false,
          status: brand.status ?? 'ACTIVE',
          sort_order: brand.sortOrder ?? 0,
          seo_title: brand.seoTitle,
          seo_description: brand.seoDescription,
        })
        .select()
        .single();
      
      if (error) {
        if (isTableMissingError(error)) return { success: false, error: 'Database tables not created' };
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async update(id: string, brand: Partial<Brand>): Promise<ApiResponse<Brand>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('brands')
        .update({
          name: brand.name,
          slug: brand.slug,
          logo_url: brand.logoUrl,
          description: brand.description,
          website: brand.website,
          featured: brand.featured,
          status: brand.status,
          sort_order: brand.sortOrder,
          seo_title: brand.seoTitle,
          seo_description: brand.seoDescription,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};

// ============================================
// CATEGORIES API
// ============================================
export const categoriesApi = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    if (!isSupabaseConfigured()) return { success: true, data: [] };
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');
      
      if (error) {
        if (isTableMissingError(error)) return { success: true, data: [] };
        return { success: false, error: error.message };
      }
      
      const categories: Category[] = (data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        imageUrl: c.image_url,
        iconUrl: c.icon_url,
        parentId: c.parent_id,
        status: c.status,
        featured: c.featured,
        sortOrder: c.sort_order,
        seoTitle: c.seo_title,
        seoDescription: c.seo_description,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }));
      
      return { success: true, data: categories };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getTree(): Promise<ApiResponse<Category[]>> {
    const result = await this.getAll();
    if (!result.success || !result.data) return result;
    
    // Build tree structure
    const categoryMap = new Map<string, Category>();
    const roots: Category[] = [];
    
    result.data.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });
    
    result.data.forEach(cat => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children!.push(category);
        }
      } else {
        roots.push(category);
      }
    });
    
    return { success: true, data: roots };
  },

  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) return { success: false, error: error.message };
      
      const category: Category = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.image_url,
        iconUrl: data.icon_url,
        parentId: data.parent_id,
        status: data.status,
        featured: data.featured,
        sortOrder: data.sort_order,
        seoTitle: data.seo_title,
        seoDescription: data.seo_description,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      return { success: true, data: category };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async create(category: Partial<Category>): Promise<ApiResponse<Category>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          slug: category.slug,
          description: category.description,
          image_url: category.imageUrl,
          icon_url: category.iconUrl,
          parent_id: category.parentId,
          status: category.status ?? 'ACTIVE',
          featured: category.featured ?? false,
          sort_order: category.sortOrder ?? 0,
          seo_title: category.seoTitle,
          seo_description: category.seoDescription,
        })
        .select()
        .single();
      
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async update(id: string, category: Partial<Category>): Promise<ApiResponse<Category>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          slug: category.slug,
          description: category.description,
          image_url: category.imageUrl,
          icon_url: category.iconUrl,
          parent_id: category.parentId,
          status: category.status,
          featured: category.featured,
          sort_order: category.sortOrder,
          seo_title: category.seoTitle,
          seo_description: category.seoDescription,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};

// ============================================
// PRODUCTS API
// ============================================
export const productsApi = {
  async getAll(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    const filterFallback = () => {
      let fallback = [...INITIAL_SHOWROOM_PRODUCTS];
      if (filters?.categoryId) {
        fallback = fallback.filter(p => p.categoryId === filters.categoryId || p.category?.slug === filters.categoryId);
      }
      if (filters?.brandId) {
        fallback = fallback.filter(p => p.brandId === filters.brandId || p.brand?.slug === filters.brandId);
      }
      if (filters?.featured !== undefined) {
        fallback = fallback.filter(p => p.featured === filters.featured);
      }
      if (filters?.newArrival !== undefined) {
        fallback = fallback.filter(p => p.newArrival === filters.newArrival);
      }
      if (filters?.popular !== undefined) {
        fallback = fallback.filter(p => p.popular === filters.popular);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        fallback = fallback.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
      }
      if (filters?.limit) {
        fallback = fallback.slice(0, filters.limit);
      }
      return fallback;
    };

    if (!isSupabaseConfigured()) return { success: true, data: filterFallback() };
    
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          images:product_images(*),
          specifications:product_specifications(*, attribute:category_attributes(*))
        `)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.brandId) {
        query = query.eq('brand_id', filters.brandId);
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      if (filters?.newArrival !== undefined) {
        query = query.eq('new_arrival', filters.newArrival);
      }
      if (filters?.popular !== undefined) {
        query = query.eq('popular', filters.popular);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      // Pagination
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit;
        query = query.range(from, from + filters.limit - 1);
      }
      
      const { data, error } = await query;
      
      if (error) {
        if (isTableMissingError(error)) return { success: true, data: filterFallback() };
        return { success: true, data: filterFallback() };
      }
      
      const products: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        brandId: p.brand_id,
        brand: p.brand,
        categoryId: p.category_id,
        category: p.category,
        description: p.description,
        shortDescription: p.short_description,
        mrp: p.mrp,
        sellingPrice: p.selling_price,
        offerPrice: p.offer_price,
        priceDisplayMode: p.price_display_mode,
        availability: p.availability,
        stockQuantity: p.stock_quantity,
        featured: p.featured,
        newArrival: p.new_arrival,
        popular: p.popular,
        rating: p.rating,
        tags: p.tags || [],
        warranty: p.warranty,
        images: (p.images || []).map((img: any) => ({
          id: img.id,
          productId: img.product_id,
          sourceType: img.source_type,
          imageUrl: img.image_url,
          storageKey: img.storage_key,
          altText: img.alt_text,
          sortOrder: img.sort_order,
          isPrimary: img.is_primary,
          createdAt: img.created_at,
        })).sort((a: any, b: any) => a.sortOrder - b.sortOrder),
        specifications: (p.specifications || []).map((spec: any) => ({
          id: spec.id,
          productId: spec.product_id,
          attributeId: spec.attribute_id,
          attribute: spec.attribute,
          value: spec.value,
          createdAt: spec.created_at,
        })),
        seoTitle: p.seo_title,
        seoDescription: p.seo_description,
        status: p.status,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));

      if (products.length === 0) {
        return { success: true, data: filterFallback() };
      }
      
      return { success: true, data: products };
    } catch (err: any) {
      return { success: true, data: filterFallback() };
    }
  },

  async getBySlug(slug: string): Promise<ApiResponse<Product>> {
    const fallback = INITIAL_SHOWROOM_PRODUCTS.find(p => p.slug === slug);

    if (!isSupabaseConfigured()) {
      if (fallback) return { success: true, data: fallback };
      return { success: false, error: 'Not configured' };
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          images:product_images(*),
          specifications:product_specifications(*, attribute:category_attributes(*))
        `)
        .eq('slug', slug)
        .single();
      
      if (error || !data) {
        if (fallback) return { success: true, data: fallback };
        return { success: false, error: error?.message || 'Product not found' };
      }
      
      const product: Product = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        brandId: data.brand_id,
        brand: data.brand,
        categoryId: data.category_id,
        category: data.category,
        description: data.description,
        shortDescription: data.short_description,
        mrp: data.mrp,
        sellingPrice: data.selling_price,
        offerPrice: data.offer_price,
        priceDisplayMode: data.price_display_mode,
        availability: data.availability,
        stockQuantity: data.stock_quantity,
        featured: data.featured,
        newArrival: data.new_arrival,
        popular: data.popular,
        rating: data.rating,
        tags: data.tags || [],
        warranty: data.warranty,
        images: (data.images || []).map((img: any) => ({
          id: img.id,
          productId: img.product_id,
          sourceType: img.source_type,
          imageUrl: img.image_url,
          storageKey: img.storage_key,
          altText: img.alt_text,
          sortOrder: img.sort_order,
          isPrimary: img.is_primary,
          createdAt: img.created_at,
        })).sort((a: any, b: any) => a.sortOrder - b.sortOrder),
        specifications: (data.specifications || []).map((spec: any) => ({
          id: spec.id,
          productId: spec.product_id,
          attributeId: spec.attribute_id,
          attribute: spec.attribute,
          value: spec.value,
          createdAt: spec.created_at,
        })),
        seoTitle: data.seo_title,
        seoDescription: data.seo_description,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      return { success: true, data: product };
    } catch (err: any) {
      if (fallback) return { success: true, data: fallback };
      return { success: false, error: err.message };
    }
  },

  async create(product: Partial<Product>): Promise<ApiResponse<Product>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          brand_id: product.brandId,
          category_id: product.categoryId,
          description: product.description,
          short_description: product.shortDescription,
          mrp: product.mrp,
          selling_price: product.sellingPrice,
          offer_price: product.offerPrice,
          price_display_mode: product.priceDisplayMode ?? 'SHOW_PRICE',
          availability: product.availability ?? 'IN_STOCK',
          stock_quantity: product.stockQuantity ?? 0,
          featured: product.featured ?? false,
          new_arrival: product.newArrival ?? false,
          popular: product.popular ?? false,
          rating: product.rating ?? 0,
          tags: product.tags ?? [],
          warranty: product.warranty,
          seo_title: product.seoTitle,
          seo_description: product.seoDescription,
          status: product.status ?? 'DRAFT',
        })
        .select()
        .single();
      
      if (error) return { success: false, error: error.message };

      if (product.images && product.images.length > 0) {
        const imageInserts = product.images.map((img, i) => ({
          product_id: data.id,
          image_url: img.imageUrl,
          alt_text: img.altText || product.name,
          is_primary: i === 0,
          sort_order: i
        }));
        await supabase.from('product_images').insert(imageInserts);
      }

      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async update(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          brand_id: product.brandId,
          category_id: product.categoryId,
          description: product.description,
          short_description: product.shortDescription,
          mrp: product.mrp,
          selling_price: product.sellingPrice,
          offer_price: product.offerPrice,
          price_display_mode: product.priceDisplayMode,
          availability: product.availability,
          stock_quantity: product.stockQuantity,
          featured: product.featured,
          new_arrival: product.newArrival,
          popular: product.popular,
          rating: product.rating,
          tags: product.tags,
          warranty: product.warranty,
          seo_title: product.seoTitle,
          seo_description: product.seoDescription,
          status: product.status,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) return { success: false, error: error.message };

      if (product.images !== undefined) {
        // Delete old images
        await supabase.from('product_images').delete().eq('product_id', id);
        
        // Insert new images
        if (product.images.length > 0) {
          const imageInserts = product.images.map((img, i) => ({
            product_id: id,
            image_url: img.imageUrl,
            alt_text: img.altText || product.name || '',
            is_primary: i === 0,
            sort_order: i
          }));
          await supabase.from('product_images').insert(imageInserts);
        }
      }

      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};

// ============================================
// OFFERS API
// ============================================
export const offersApi = {
  async getActive(): Promise<ApiResponse<any[]>> {
    if (!isSupabaseConfigured()) return { success: true, data: [] };
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('status', 'ACTIVE')
        .order('priority', { ascending: false });
      
      if (error) {
        if (isTableMissingError(error)) return { success: true, data: [] };
        return { success: false, error: error.message };
      }
      return { success: true, data: data || [] };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};

// ============================================
// BANNERS API
// ============================================
export const bannersApi = {
  async getAll(): Promise<ApiResponse<Banner[]>> {
    if (!isSupabaseConfigured()) return { success: true, data: [] };
    
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('status', 'ACTIVE')
        .order('display_order');
      
      if (error) {
        if (isTableMissingError(error)) return { success: true, data: [] };
        return { success: false, error: error.message };
      }
      
      const banners: Banner[] = (data || []).map((b: any) => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle,
        description: b.description,
        desktopImageUrl: b.desktop_image_url,
        mobileImageUrl: b.mobile_image_url,
        desktopStorageKey: b.desktop_storage_key,
        mobileStorageKey: b.mobile_storage_key,
        ctaText: b.cta_text,
        ctaLink: b.cta_link,
        ctaTargetType: b.cta_target_type,
        status: b.status,
        priority: b.priority,
        startDate: b.start_date,
        endDate: b.end_date,
        displayOrder: b.display_order,
        backgroundType: b.background_type,
        overlayOpacity: b.overlay_opacity,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      }));
      
      return { success: true, data: banners };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async create(banner: Partial<Banner>): Promise<ApiResponse<Banner>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert({
          title: banner.title,
          subtitle: banner.subtitle,
          description: banner.description,
          desktop_image_url: banner.desktopImageUrl,
          mobile_image_url: banner.mobileImageUrl,
          desktop_storage_key: banner.desktopStorageKey,
          mobile_storage_key: banner.mobileStorageKey,
          cta_text: banner.ctaText,
          cta_link: banner.ctaLink,
          cta_target_type: banner.ctaTargetType,
          status: banner.status ?? 'DRAFT',
          priority: banner.priority ?? 0,
          start_date: banner.startDate,
          end_date: banner.endDate,
          display_order: banner.displayOrder ?? 0,
          background_type: banner.backgroundType ?? 'IMAGE',
          overlay_opacity: banner.overlayOpacity ?? 0.5,
        })
        .select()
        .single();
      
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async update(id: string, banner: Partial<Banner>): Promise<ApiResponse<Banner>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('banners')
        .update({
          title: banner.title,
          subtitle: banner.subtitle,
          description: banner.description,
          desktop_image_url: banner.desktopImageUrl,
          mobile_image_url: banner.mobileImageUrl,
          cta_text: banner.ctaText,
          cta_link: banner.ctaLink,
          cta_target_type: banner.ctaTargetType,
          status: banner.status,
          priority: banner.priority,
          start_date: banner.startDate,
          end_date: banner.endDate,
          display_order: banner.displayOrder,
          background_type: banner.backgroundType,
          overlay_opacity: banner.overlayOpacity,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};

// ============================================
// ENQUIRIES API
// ============================================
export const enquiriesApi = {
  async getAll(): Promise<ApiResponse<Enquiry[]>> {
    if (!isSupabaseConfigured()) return { success: true, data: [] };
    
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select(`
          *,
          product:products(name, slug)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        if (isTableMissingError(error)) return { success: true, data: [] };
        return { success: false, error: error.message };
      }
      
      const enquiries: Enquiry[] = (data || []).map((e: any) => ({
        id: e.id,
        customerName: e.customer_name,
        customerEmail: e.customer_email,
        customerPhone: e.customer_phone,
        productId: e.product_id,
        product: e.product,
        enquiryType: e.enquiry_type,
        message: e.message,
        quantity: e.quantity,
        status: e.status,
        notes: e.notes,
        createdAt: e.created_at,
        updatedAt: e.updated_at,
      }));
      
      return { success: true, data: enquiries };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async create(enquiry: Partial<Enquiry>): Promise<ApiResponse<Enquiry>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .insert({
          customer_name: enquiry.customerName,
          customer_email: enquiry.customerEmail,
          customer_phone: enquiry.customerPhone,
          product_id: enquiry.productId,
          enquiry_type: enquiry.enquiryType ?? 'PRODUCT',
          message: enquiry.message,
          quantity: enquiry.quantity ?? 1,
          status: 'NEW',
          notes: enquiry.notes,
        })
        .select()
        .single();
      
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async update(id: string, updates: Partial<Enquiry>): Promise<ApiResponse<Enquiry>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    try {
      const payload: Record<string, unknown> = {};
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.notes !== undefined) payload.notes = updates.notes;
      const { data, error } = await supabase
        .from('enquiries')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async updateStatus(id: string, status: string): Promise<ApiResponse<Enquiry>> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };
    
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};

// ============================================
// DASHBOARD API
// ============================================
export const dashboardApi = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: {
          totalProducts: 0,
          activeProducts: 0,
          totalCategories: 0,
          totalBrands: 0,
          activeOffers: 0,
          activeBanners: 0,
          newEnquiries: 0,
          pendingEnquiries: 0,
          todayEnquiries: 0,
          featuredProducts: 0,
        }
      };
    }
    
    try {
      const [productsRes, categoriesRes, brandsRes, bannersRes, enquiriesRes] = await Promise.all([
        supabase.from('products').select('id, status, featured', { count: 'exact', head: false }),
        supabase.from('categories').select('id', { count: 'exact', head: false }),
        supabase.from('brands').select('id', { count: 'exact', head: false }),
        supabase.from('banners').select('id', { count: 'exact', head: false }).eq('status', 'ACTIVE'),
        supabase.from('enquiries').select('id, status, created_at', { count: 'exact', head: false }),
      ]);
      
      const today = new Date().toISOString().split('T')[0];
      const todayEnquiries = (enquiriesRes.data || []).filter((e: any) => 
        e.created_at.startsWith(today)
      ).length;
      
      const stats: DashboardStats = {
        totalProducts: productsRes.count || 0,
        activeProducts: (productsRes.data || []).filter((p: any) => p.status === 'ACTIVE').length,
        totalCategories: categoriesRes.count || 0,
        totalBrands: brandsRes.count || 0,
        activeOffers: 0, // TODO: Implement offers
        activeBanners: bannersRes.count || 0,
        newEnquiries: (enquiriesRes.data || []).filter((e: any) => e.status === 'NEW').length,
        pendingEnquiries: (enquiriesRes.data || []).filter((e: any) => 
          ['NEW', 'CONTACTED', 'FOLLOW_UP'].includes(e.status)
        ).length,
        todayEnquiries,
        featuredProducts: (productsRes.data || []).filter((p: any) => p.featured).length,
      };
      
      return { success: true, data: stats };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
