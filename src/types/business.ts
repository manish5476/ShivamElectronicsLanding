// ============================================================
// SHIVAM ELECTRONICS - BUSINESS OPERATING SYSTEM TYPES
// ============================================================

// ─── COMPANY PROFILE & BRANDING ──────────────────────────────
export interface CompanyProfile {
  id: string;
  legalName: string;
  displayName: string;
  shortName: string;
  tagline: string;
  description: string;
  foundedYear?: number;
  logoUrl?: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  coverImageUrl?: string;
  
  // Primary Contact
  phone: string;
  alternatePhone?: string;
  whatsapp: string;
  email: string;
  alternateEmail?: string;
  website: string;
  
  // Physical Location
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  
  // Operations & Business
  openingHours: string;
  holidayInfo?: string;
  gstNumber?: string;
  businessRegistrationNumber?: string;
  supportContact?: string;
  salesContact?: string;
  
  // Social Links
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    pinterest?: string;
    whatsapp?: string;
  };
  
  status: 'ACTIVE' | 'MAINTENANCE';
  createdAt: string;
  updatedAt: string;
}

export interface ContactChannel {
  id: string;
  label: string;
  type: 'PHONE' | 'WHATSAPP' | 'EMAIL' | 'MAP' | 'SOCIAL';
  value: string;
  displayOrder: number;
  isPrimary: boolean;
  isPublic: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface BusinessHighlight {
  id: string;
  title: string;
  subtitle: string;
  iconName?: string;
  sortOrder: number;
  isActive: boolean;
}

// ─── COMPANY DOCUMENTS ───────────────────────────────────────
export type DocumentVisibility = 'PUBLIC' | 'PRIVATE' | 'ADMIN_ONLY';
export type DocumentType = 
  | 'REGISTRATION' 
  | 'CERTIFICATE' 
  | 'WARRANTY' 
  | 'CATALOGUE' 
  | 'MANUAL' 
  | 'BROCHURE' 
  | 'POLICY' 
  | 'OTHER';

export interface CompanyDocument {
  id: string;
  title: string;
  description?: string;
  documentType: DocumentType;
  fileUrl: string;
  storageKey?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  version: string;
  visibility: DocumentVisibility;
  status: 'ACTIVE' | 'ARCHIVED';
  sortOrder: number;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── COMPANY POLICIES & CONTENT ─────────────────────────────
export type PolicySlug = 'privacy' | 'terms' | 'warranty' | 'shipping' | 'cancellation' | 'returns';

export interface CompanyPolicy {
  id: string;
  title: string;
  slug: PolicySlug | string;
  content: string;
  version: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AboutSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  sectionType: 'STORY' | 'MISSION' | 'VISION' | 'VALUES' | 'SHOWROOM' | 'HIGHLIGHTS';
  imageUrl?: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── CUSTOMERS & CRM ─────────────────────────────────────────
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  notes?: string;
  source?: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryEvent {
  id: string;
  enquiryId: string;
  eventType: 
    | 'CREATED' 
    | 'ASSIGNED' 
    | 'CONTACTED' 
    | 'STATUS_CHANGE' 
    | 'NOTE_ADDED' 
    | 'FOLLOW_UP_SCHEDULED';
  note: string;
  createdBy?: string;
  createdAt: string;
}

// ─── BOOKINGS & APPOINTMENTS ────────────────────────────────
export type BookingStatus = 
  | 'REQUESTED' 
  | 'CONFIRMED' 
  | 'RESCHEDULED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'REJECTED';

export type BookingType = 
  | 'SHOWROOM_VISIT' 
  | 'PRODUCT_CONSULTATION' 
  | 'FURNITURE_CONSULTATION' 
  | 'DEMONSTRATION' 
  | 'INSTALLATION_REQUEST';

export interface Booking {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  productId?: string;
  productName?: string;
  categoryId?: string;
  bookingType: BookingType;
  requestedDate: string;
  requestedTime: string;
  alternateDate?: string;
  alternateTime?: string;
  message?: string;
  status: BookingStatus;
  assignedTo?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── INVENTORY & STOCK MOVEMENTS ────────────────────────────
export type MovementType = 
  | 'STOCK_IN' 
  | 'STOCK_OUT' 
  | 'SALE' 
  | 'RETURN' 
  | 'DAMAGE' 
  | 'ADJUSTMENT' 
  | 'TRANSFER' 
  | 'RESERVATION' 
  | 'RELEASE';

export interface InventoryLocation {
  id: string;
  name: string;
  code: string;
  address?: string;
  locationType: 'SHOWROOM' | 'WAREHOUSE' | 'DISPLAY_FLOOR';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  locationId: string;
  productName?: string;
  productSku?: string;
  locationName?: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number; // Derived: onHand - reserved
  lowStockThreshold: number;
  reorderLevel: number;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName?: string;
  locationId: string;
  movementType: MovementType;
  quantity: number;
  referenceType?: 'PURCHASE' | 'ORDER' | 'ENQUIRY' | 'MANUAL_AUDIT';
  referenceId?: string;
  reason?: string;
  performedBy?: string;
  createdAt: string;
}
