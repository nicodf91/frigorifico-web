import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Branch, Cart, CartItem, Product, UserProfile } from '../types';

interface StateContextType {
  selectedBranch: Branch | null;
  selectBranch: (branch: Branch) => void;
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  userProfile: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => void;
}

const BRANCH_STORAGE_KEY = 'frs_selected_branch_v1';
const CART_STORAGE_KEY = 'frs_cart_v1';
const EMPTY_CART: Cart = { items: [], branchId: null };
const EMPTY_PROFILE: UserProfile = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  cuit: '',
  businessName: '',
  isWholesale: false,
};

function readStored<T>(key: string, validate: (value: unknown) => value is T, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable or full; the in-memory demo must keep working.
  }
}

function isBranch(value: unknown): value is Branch {
  if (!value || typeof value !== 'object') return false;
  const branch = value as Partial<Branch>;
  return typeof branch.id === 'string' && typeof branch.name === 'string' && typeof branch.phone === 'string';
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.productId === 'string' &&
    typeof item.quantity === 'number' &&
    Number.isFinite(item.quantity) &&
    item.quantity > 0 &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.name === 'string'
  );
}

function isCart(value: unknown): value is Cart {
  if (!value || typeof value !== 'object') return false;
  const cart = value as Partial<Cart>;
  return Array.isArray(cart.items) && cart.items.every(isCartItem) && (cart.branchId === null || typeof cart.branchId === 'string');
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(() =>
    readStored(BRANCH_STORAGE_KEY, isBranch, null),
  );
  const [cart, setCart] = useState<Cart>(() => readStored(CART_STORAGE_KEY, isCart, EMPTY_CART));
  // Personal data stays in memory only and disappears when the tab is reloaded.
  const [userProfile, setUserProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (selectedBranch) {
      writeStored(BRANCH_STORAGE_KEY, selectedBranch);
      if (cart.items.length === 0) {
        setCart((previous) => ({ ...previous, branchId: selectedBranch.id }));
      }
    }
  }, [selectedBranch, cart.items.length]);

  useEffect(() => {
    writeStored(CART_STORAGE_KEY, cart);
  }, [cart]);

  const selectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setCart((previous) =>
      previous.items.length > 0 && previous.branchId !== branch.id
        ? { items: [], branchId: branch.id }
        : { ...previous, branchId: branch.id },
    );
  };

  const addToCart = (product: Product, quantity: number) => {
    if (!selectedBranch || !Number.isFinite(quantity) || quantity <= 0) return;

    setCart((previous) => {
      const existingItem = previous.items.find((item) => item.productId === product.id);
      const items = existingItem
        ? previous.items.map((item) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          )
        : [
            ...previous.items,
            {
              productId: product.id,
              quantity,
              unit: product.unit,
              price: product.price,
              name: product.name,
              image: product.image,
            },
          ];
      return { ...previous, items, branchId: selectedBranch.id };
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((previous) => ({ ...previous, items: previous.items.filter((item) => item.productId !== productId) }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((previous) => ({
      ...previous,
      items: previous.items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    }));
  };

  const clearCart = () => setCart((previous) => ({ ...previous, items: [] }));
  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile((previous) => ({ ...previous, ...data }));
  };

  return (
    <StateContext.Provider
      value={{
        selectedBranch,
        selectBranch,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        userProfile,
        updateUserProfile,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(StateContext);
  if (context === undefined) throw new Error('useApp must be used within a StateProvider');
  return context;
};
