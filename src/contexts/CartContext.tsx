import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../types/electronics';

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  sellingPrice: number;
  mrp?: number;
  quantity: number;
  category?: string;
  brand?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalMrp: number;
  totalSavings: number;
  estimatedMonthlyEmi: number | null;
  isCartDrawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shivam_cart_items_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    const primaryImg =
      product.images?.find(i => i.isPrimary)?.imageUrl ||
      product.images?.[0]?.imageUrl ||
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=700&q=80';

    const price = product.sellingPrice || product.mrp || 0;
    const mrp = product.mrp || price;

    setItems(prev => {
      const existingIdx = prev.findIndex(item => item.productId === product.id);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          imageUrl: primaryImg,
          sellingPrice: price,
          mrp,
          quantity,
          category: product.category?.name,
          brand: product.brand?.name,
        },
      ];
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  const totalPrice = items.reduce((acc, i) => acc + i.sellingPrice * i.quantity, 0);

  const totalMrp = items.reduce((acc, i) => acc + (i.mrp || i.sellingPrice) * i.quantity, 0);

  const totalSavings = Math.max(0, totalMrp - totalPrice);

  const estimatedMonthlyEmi =
    totalPrice >= 5000 ? Math.round(totalPrice / 12) : null;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        totalMrp,
        totalSavings,
        estimatedMonthlyEmi,
        isCartDrawerOpen,
        openCart: () => setIsCartDrawerOpen(true),
        closeCart: () => setIsCartDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
