import type { ApiResponse } from '../types/electronics';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'showroom' | 'televisions' | 'appliances' | 'furniture' | 'deliveries';
  imageUrl: string;
  thumbnailUrl?: string;
  description: string;
  locationTag: string;
  featured?: boolean;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  source: 'GOOGLE_MAPS' | 'STORE_CAMERA';
  likesCount?: number;
}

export interface GooglePlaceInfo {
  name: string;
  subtitle: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  rating: number;
  reviewsCount: number;
  googleMapsUrl: string;
  directionsUrl: string;
  embedMapUrl: string;
  phone: string;
  timings: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const GOOGLE_MAPS_STORE_INFO: GooglePlaceInfo = {
  name: 'SHIVAM ELECTRONICS JOLVA',
  subtitle: 'Electronics, Home Appliances & Furniture Superstore',
  address: 'Panchratna Complex, Kadodara - Bardoli Road, Near Jolva Cross Road',
  area: 'Jolva',
  city: 'Surat',
  state: 'Gujarat',
  pincode: '394305',
  rating: 4.9,
  reviewsCount: 128,
  googleMapsUrl: 'https://maps.app.goo.gl/yaPUQR26M6jbg49F9',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=21.1587948,72.9991155',
  embedMapUrl: 'https://maps.google.com/maps?q=21.1587948,72.9991155&t=&z=16&ie=UTF8&iwloc=&output=embed',
  phone: '+91 98765 43210',
  timings: 'Monday – Sunday: 09:30 AM – 09:30 PM (Open All 7 Days)',
  coordinates: {
    lat: 21.1587948,
    lng: 72.9991155,
  },
};

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'Shivam Electronics Jolva — Showroom Entrance & Displays',
    category: 'showroom',
    imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RMh-IsqZ2nDU6W94_-_QES_yEIZJEsJzRga6Tr2wYM8Z1UfRJJfj0HSYdWp9OQvLlm3iVVJzJ2bQprW4_7wIYt1gX8_fF-p0v0Z0RW_4KUbKVFrlWvCmAAYs8j0tmrlmfP0vaZ=w1600',
    description: 'Verified photograph from our official Google Maps listing at Panchratna Complex, Kadodara - Bardoli Road, Jolva.',
    locationTag: 'Official Google Maps Photo',
    featured: true,
    aspectRatio: 'landscape',
    source: 'GOOGLE_MAPS',
    likesCount: 98,
  },
  {
    id: 'gal-02',
    title: '4K QLED & OLED Smart Television Display Wall',
    category: 'televisions',
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1400&q=85',
    description: 'Experience side-by-side color accuracy and Dolby Atmos surround sound across 43", 55", 65", and 75" screens.',
    locationTag: 'Audio-Visual Zone',
    featured: true,
    aspectRatio: 'landscape',
    source: 'GOOGLE_MAPS',
    likesCount: 89,
  },
  {
    id: 'gal-03',
    title: 'Solid Teakwood Storage Bed & Bedroom Showcase',
    category: 'furniture',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&q=85',
    description: 'Handcrafted king size wooden bed with hydraulic storage, paired with matching bedside tables and polish finish.',
    locationTag: 'Furniture Gallery, 1st Floor',
    featured: true,
    aspectRatio: 'landscape',
    source: 'STORE_CAMERA',
    likesCount: 41,
  },
  {
    id: 'gal-04',
    title: 'French Door & Side-by-Side Smart Refrigerators',
    category: 'appliances',
    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1400&q=85',
    description: 'Energy-efficient 5-star inverter refrigerators from LG, Samsung, Whirlpool, and Haier with instant showroom warranty.',
    locationTag: 'Cooling Appliances Section',
    featured: true,
    aspectRatio: 'portrait',
    source: 'GOOGLE_MAPS',
    likesCount: 62,
  },
  {
    id: 'gal-05',
    title: 'Front-Load & Top-Load Washing Machine Aisle',
    category: 'appliances',
    imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1400&q=85',
    description: 'Bosch, IFB, LG, and Samsung eco-bubble washing machines with free on-site demo and installation support.',
    locationTag: 'Laundry Care Aisle',
    featured: false,
    aspectRatio: 'square',
    source: 'GOOGLE_MAPS',
    likesCount: 37,
  },
  {
    id: 'gal-06',
    title: 'Designer Steel Almirahs & Multi-Door Wardrobes',
    category: 'furniture',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1400&q=85',
    description: 'Heavy gauge powder-coated steel wardrobes with secure locker units and custom mirror placements.',
    locationTag: 'Storage & Almirah Section',
    featured: false,
    aspectRatio: 'portrait',
    source: 'STORE_CAMERA',
    likesCount: 29,
  },
  {
    id: 'gal-07',
    title: 'Handcrafted Sheesham Wood Temple / Mandir with Warm LED',
    category: 'furniture',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85',
    description: 'Artisanal carved home temples with drawer storage, bell accents, and moisture-resistant teak polish.',
    locationTag: 'Sacred Living & Mandir Zone',
    featured: true,
    aspectRatio: 'portrait',
    source: 'STORE_CAMERA',
    likesCount: 78,
  },
  {
    id: 'gal-08',
    title: 'Flagship Living Lounge & Home Entertainment Experience',
    category: 'showroom',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85',
    description: 'Complete home living concept combining smart 4K projection, plush seating, and acoustic wooden paneling.',
    locationTag: 'Flagship Experience Suite',
    featured: true,
    aspectRatio: 'landscape',
    source: 'GOOGLE_MAPS',
    likesCount: 95,
  },
  {
    id: 'gal-09',
    title: 'High-Wattage Party Speakers & Wireless Audio Demos',
    category: 'televisions',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1400&q=85',
    description: 'Party speakers with deep bass, karaoke mics, and RGB sync lights. Available for live testing before purchase.',
    locationTag: 'Party Audio Station',
    featured: false,
    aspectRatio: 'square',
    source: 'STORE_CAMERA',
    likesCount: 44,
  },
  {
    id: 'gal-10',
    title: 'Modular Kitchen Appliances, Microwaves & Chimneys',
    category: 'appliances',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=85',
    description: 'Auto-clean kitchen chimneys, touch microwaves, and RO water purifiers ready for doorstep delivery.',
    locationTag: 'Kitchen & Water Purifier Counter',
    featured: false,
    aspectRatio: 'landscape',
    source: 'GOOGLE_MAPS',
    likesCount: 33,
  },
  {
    id: 'gal-11',
    title: 'Safe Padded Transport & Express Delivery Fleet',
    category: 'deliveries',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=85',
    description: 'Every appliance and furniture piece is double-cushioned and delivered safely to your doorstep in Jolva & Surat.',
    locationTag: 'Dispatch & Logistics Bay',
    featured: true,
    aspectRatio: 'landscape',
    source: 'STORE_CAMERA',
    likesCount: 66,
  },
  {
    id: 'gal-12',
    title: 'Bedroom Suite Complete Assembly at Customer Home',
    category: 'deliveries',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85',
    description: 'Our carpentry team completes on-site assembly, leveling, and mattress placement within 24 hours of delivery.',
    locationTag: 'Customer Home Delivery, Jolva',
    featured: false,
    aspectRatio: 'landscape',
    source: 'STORE_CAMERA',
    likesCount: 52,
  },
];

const STORAGE_KEY = 'shivam_showroom_gallery_v4';

export const galleryApi = {
  async getItems(category?: string): Promise<ApiResponse<GalleryItem[]>> {
    try {
      let items: GalleryItem[] = [...INITIAL_GALLERY_ITEMS];
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        items = JSON.parse(cached);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }

      if (category && category !== 'all') {
        items = items.filter(i => i.category === category);
      }

      return { success: true, data: items };
    } catch (e: any) {
      return { success: false, data: INITIAL_GALLERY_ITEMS, error: e.message };
    }
  },

  async addItem(item: Omit<GalleryItem, 'id'>): Promise<ApiResponse<GalleryItem>> {
    try {
      const items = (await this.getItems()).data || [...INITIAL_GALLERY_ITEMS];
      const newItem: GalleryItem = {
        ...item,
        id: `gal-${Date.now()}`,
      };
      items.unshift(newItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return { success: true, data: newItem };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async deleteItem(id: string): Promise<ApiResponse<boolean>> {
    try {
      const items = (await this.getItems()).data || [...INITIAL_GALLERY_ITEMS];
      const filtered = items.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return { success: true, data: true };
    } catch (e: any) {
      return { success: false, data: false, error: e.message };
    }
  },

  getStorePlaceInfo(): GooglePlaceInfo {
    return GOOGLE_MAPS_STORE_INFO;
  },
};
