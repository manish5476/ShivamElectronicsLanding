import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import type { Product } from '../types/electronics';
import { useAuth } from './AuthContext';

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

const GUEST_CART_KEY = 'shivam_cart_guest_v1';
const LEGACY_CART_KEY = 'shivam_cart_items_v1';

export const getCustomerCartKey = (customerId: string) => `shivam_cart_user_${customerId}_v1`;

function loadCartItemsForIdentity(userId: string | null): CartItem[] {
  try {
    const key = userId ? getCustomerCartKey(userId) : GUEST_CART_KEY;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }

    // Clean up legacy single-cart key if present
    if (!userId) {
      const legacy = localStorage.getItem(LEGACY_CART_KEY);
      if (legacy) {
        localStorage.removeItem(LEGACY_CART_KEY);
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(parsed));
          return parsed;
        }
      }
    }
  } catch {
    // ignore
  }
  return [];
}

function saveCartItemsForIdentity(userId: string | null, items: CartItem[]) {
  try {
    const key = userId ? getCustomerCartKey(userId) : GUEST_CART_KEY;
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { customer } = useAuth();
  const currentUserId = customer?.id || null;

  // Track the active user ID to manage transition boundaries (Guest -> User, User -> Logout, User A -> User B)
  const activeUserIdRef = useRef<string | null>(currentUserId);

  const [items, setItems] = useState<CartItem[]>(() => {
    return loadCartItemsForIdentity(currentUserId);
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync state whenever customer changes (Log In, Log Out, Switch User)
  useEffect(() => {
    const prevUserId = activeUserIdRef.current;
    const newUserId = customer?.id || null;

    if (prevUserId === newUserId) return;

    // 1. Customer Logged Out (was User A, now null)
    if (prevUserId && !newUserId) {
      // Save User A's current items safely to their personal user key
      saveCartItemsForIdentity(prevUserId, items);

      // Clean slate for the logged out / guest session
      saveCartItemsForIdentity(null, []);
      setItems([]);
      activeUserIdRef.current = null;
      return;
    }

    // 2. Customer Logged In (was guest null, now User A)
    if (!prevUserId && newUserId) {
      const guestItems = items;
      const userSavedItems = loadCartItemsForIdentity(newUserId);

      let resolvedItems: CartItem[];
      // If guest had added items right before signing in, merge them with the user's account cart
      if (guestItems.length > 0) {
        const itemMap = new Map<string, CartItem>();
        userSavedItems.forEach(item => itemMap.set(item.productId, { ...item }));
        guestItems.forEach(item => {
          if (itemMap.has(item.productId)) {
            const existing = itemMap.get(item.productId)!;
            itemMap.set(item.productId, {
              ...existing,
              quantity: existing.quantity + item.quantity,
            });
          } else {
            itemMap.set(item.productId, { ...item });
          }
        });
        resolvedItems = Array.from(itemMap.values());
        // Clean out guest storage after merge
        saveCartItemsForIdentity(null, []);
      } else {
        resolvedItems = userSavedItems;
      }

      saveCartItemsForIdentity(newUserId, resolvedItems);
      setItems(resolvedItems);
      activeUserIdRef.current = newUserId;
      return;
    }

    // 3. User Switch (User A -> User B)
    if (prevUserId && newUserId && prevUserId !== newUserId) {
      saveCartItemsForIdentity(prevUserId, items);
      const userBItems = loadCartItemsForIdentity(newUserId);
      setItems(userBItems);
      activeUserIdRef.current = newUserId;
      return;
    }
  }, [customer?.id]);

  // Persist items whenever items list changes
  useEffect(() => {
    saveCartItemsForIdentity(activeUserIdRef.current, items);
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
    saveCartItemsForIdentity(activeUserIdRef.current, []);
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
