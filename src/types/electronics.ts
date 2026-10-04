
// ============================================
// SHIVAM ELECTRONICS - TYPE DEFINITIONS
// ============================================

// ============================================
// BRAND TYPES
// ============================================
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  featured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CATEGORY TYPES
// ============================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  iconUrl?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CATEGORY ATTRIBUTE TYPES
// ============================================
export type AttributeFieldType = 'text' | 'number' | 'boolean' | 'select' | 'multiselect';

export interface CategoryAttribute {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  fieldType: AttributeFieldType;
  options?: string[]; // For select/multiselect
  unit?: string; // e.g., "inches", "GB", "Watts"
  isRequired: boolean;
  isFilterable: boolean;
  isSearchable: boolean;
  sortOrder: number;
  createdAt: string;
}

// ============================================
// PRODUCT TYPES
// ============================================
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type ProductAvailability = 'IN_STOCK' | 'OUT_OF_STOCK' | 'COMING_SOON' | 'ON_REQUEST';
export type PriceDisplayMode = 'SHOW_PRICE' | 'CONTACT_FOR_PRICE' | 'CALL_US';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  brandId?: string;
  brand?: Brand;
  categoryId?: string;
  category?: Category;
  description?: string;
  shortDescription?: string;
  mrp?: number;
  sellingPrice?: number;
  offerPrice?: number;
  priceDisplayMode: PriceDisplayMode;
  availability: ProductAvailability;
  stockQuantity: number;
  featured: boolean;
  newArrival: boolean;
  popular: boolean;
  rating: number;
  tags: string[];
  warranty?: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
  seoTitle?: string;
  seoDescription?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// PRODUCT IMAGE TYPES
// ============================================
export type ImageSourceType = 'UPLOAD' | 'URL';

export interface ProductImage {
  id: string;
  productId: string;
  sourceType: ImageSourceType;
  imageUrl: string;
  storageKey?: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

// ============================================
// PRODUCT SPECIFICATION TYPES
// ============================================
export interface ProductSpecification {
  id: string;
  productId: string;
  attributeId: string;
  attribute?: CategoryAttribute;
  value: string;
  createdAt: string;
}

// ============================================
// BANNER TYPES
// ============================================
export type BannerStatus = 'DRAFT' | 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'PAUSED';
export type BannerBackgroundType = 'IMAGE' | 'COLOR' | 'GRADIENT';
export type BannerCTATargetType = 'PRODUCT' | 'CATEGORY' | 'BRAND' | 'OFFER' | 'URL';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  desktopStorageKey?: string;
  mobileStorageKey?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaTargetType?: BannerCTATargetType;
  status: BannerStatus;
  priority: number;
  startDate?: string;
  endDate?: string;
  displayOrder: number;
  backgroundType: BannerBackgroundType;
  overlayOpacity: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// OFFER TYPES
// ============================================
export type OfferStatus = 'DRAFT' | 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'PAUSED';
export type OfferType = 'PERCENTAGE' | 'FIXED' | 'BUNDLE' | 'FREEBIE';
export type OfferApplicableTo = 'ALL' | 'PRODUCTS' | 'CATEGORIES' | 'BRANDS';

export interface Offer {
  id: string;
  name: string;
  slug: string;
  description?: string;
  offerType: OfferType;
  discountValue?: number;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  status: OfferStatus;
  priority: number;
  applicableTo: OfferApplicableTo;
  products?: Product[];
  categories?: Category[];
  brands?: Brand[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// ENQUIRY TYPES
// ============================================
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'CLOSED';
export type EnquiryType = 'PRODUCT' | 'GENERAL' | 'CALLBACK';

export interface Enquiry {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  productId?: string;
  product?: Product;
  enquiryType: EnquiryType;
  message?: string;
  quantity: number;
  status: EnquiryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  note?: string;
}

// ============================================
// FILTER TYPES
// ============================================
export interface ProductFilters {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: ProductAvailability[];
  featured?: boolean;
  newArrival?: boolean;
  popular?: boolean;
  tags?: string[];
  specifications?: Record<string, string | string[]>;
  search?: string;
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}

// ============================================
// DASHBOARD STATS TYPES
// ============================================
export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalBrands: number;
  activeOffers: number;
  activeBanners: number;
  newEnquiries: number;
  pendingEnquiries: number;
  todayEnquiries: number;
  featuredProducts: number;
}
