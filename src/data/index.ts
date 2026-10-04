// Type definitions for Mimiko Studio
// All data is now fetched from Supabase in real-time

export interface DesignImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Design {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  collectionId: string;
  category: string;
  images: DesignImage[];
  price?: string;
  priceType: 'fixed' | 'starting' | 'on-request';
  availability: 'available' | 'made-to-order' | 'sold';
  customizable: boolean;
  featured: boolean;
  tags: string[];
  material?: string;
  craft?: string;
  occasion?: string;
  care?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  featured: boolean;
  sortOrder: number;
}

// Collections are now fetched from Supabase
export const collections: Collection[] = [];

// Designs are now fetched from Supabase
export const designs: Design[] = [];

// FAQ items (static content)
export const faqItems = [
  {
    question: 'How do I place a custom order?',
    answer: 'Visit our Custom Designs page or contact us directly. Share your idea, occasion, color preferences, and budget. We\'ll discuss the design with you and provide a quote.',
  },
  {
    question: 'How long does a custom design take?',
    answer: 'Custom designs typically take 2-4 weeks depending on complexity. We\'ll provide a timeline estimate when you place your order.',
  },
  {
    question: 'Can I modify an existing design?',
    answer: 'Yes! Many of our designs can be customized — different colors, sizes, or stone options. Use the "Ask About Customization" option on any design page.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently we ship within India. International shipping is available on request — please contact us for details.',
  },
  {
    question: 'What is your return/exchange policy?',
    answer: 'Custom-made pieces cannot be returned. Ready pieces can be exchanged within 7 days if unused and in original packaging. Please see our full Terms for details.',
  },
  {
    question: 'How should I care for my jewellery?',
    answer: 'Store pieces in the provided pouch or box. Avoid contact with perfume, water, and chemicals. Clean gently with a soft dry cloth. Each piece comes with specific care instructions.',
  },
  {
    question: 'Do you offer bridal consultations?',
    answer: 'Yes, we offer personal consultations for bridal jewellery and accessories. Contact us to schedule a session.',
  },
  {
    question: 'Are your pieces handmade?',
    answer: 'Yes, every piece from Mimiko Studio is handcrafted by our artisans. We take pride in the time and skill that goes into each creation.',
  },
];
