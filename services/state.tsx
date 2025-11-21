
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(() => {
    const saved = localStorage.getItem('frs_selected_branch');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<Cart>(() => {
    const saved = localStorage.getItem('frs_cart');
    return saved ? JSON.parse(saved) : { items: [], branchId: null };
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('frs_user_profile');
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      cuit: '',
      businessName: '',
      isWholesale: false
    };
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (selectedBranch) {
      localStorage.setItem('frs_selected_branch', JSON.stringify(selectedBranch));
      if (cart.items.length === 0) {
        setCart(prev => ({ ...prev, branchId: selectedBranch.id }));
      }
    }
  }, [selectedBranch]);

  useEffect(() => {
    localStorage.setItem('frs_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('frs_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const selectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    if (cart.items.length > 0 && cart.branchId !== branch.id) {
      // Silent clear or logic here if needed, currently handling in UI or previous logic
      setCart({ items: [], branchId: branch.id });
    } else {
       setCart(prev => ({ ...prev, branchId: branch.id }));
    }
  };

  const addToCart = (product: Product, quantity: number) => {
    if (!selectedBranch) {
      return;
    }

    setCart(prev => {
      const existingItem = prev.items.find(i => i.productId === product.id);
      let newItems;
      if (existingItem) {
        newItems = prev.items.map(i => 
          i.productId === product.id 
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        );
      } else {
        newItems = [...prev.items, {
          productId: product.id,
          quantity,
          unit: product.unit,
          price: product.price,
          name: product.name,
          image: product.image
        }];
      }
      return { ...prev, items: newItems, branchId: selectedBranch.id };
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(i => i.productId !== productId)
    }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => ({
      ...prev,
      items: prev.items.map(i => i.productId === productId ? { ...i, quantity } : i)
    }));
  };

  const clearCart = () => {
    setCart(prev => ({ ...prev, items: [] }));
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...data }));
  };

  return (
    <StateContext.Provider value={{
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
      updateUserProfile
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a StateProvider');
  }
  return context;
};
