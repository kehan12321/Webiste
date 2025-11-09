import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        )
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_PROMO_CODE':
      return { ...state, promoCode: action.payload };

    case 'ADD_TO_WISHLIST':
      const isAlreadyInWishlist = state.wishlist.some(item => item.id === action.payload.id);
      if (!isAlreadyInWishlist) {
        toast.success('Added to wishlist!');
        return {
          ...state,
          wishlist: [...state.wishlist, action.payload]
        };
      }
      toast('Already in wishlist');
      return state;

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

const PROMO_CODES = {
  ZALIANT20: 0.2,
  MAXPERF: 0.1,
  CRYPTO10: 0.1,
  BETTERSHOP: 0.15,
};

export const EnhancedCartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    wishlist: [],
    promoCode: '',
    loading: false,
    error: null,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('better-shop-cart');
    const savedWishlist = localStorage.getItem('better-shop-wishlist');
    
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        cartData.items.forEach(item => {
          dispatch({ type: 'ADD_TO_CART', payload: item });
        });
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }

    if (savedWishlist) {
      try {
        const wishlistData = JSON.parse(savedWishlist);
        wishlistData.forEach(item => {
          dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
        });
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('better-shop-cart', JSON.stringify({ items: state.items }));
  }, [state.items]);

  useEffect(() => {
    localStorage.setItem('better-shop-wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
    toast.success(`${product.title} added to cart!`);
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const addToWishlist = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    toast.success('Removed from wishlist');
  };

  const setPromoCode = (code) => {
    dispatch({ type: 'SET_PROMO_CODE', payload: code });
  };

  // Calculations
  const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountRate = PROMO_CODES[state.promoCode?.toUpperCase()] || 0;
  const discount = subtotal * discountRate;
  const total = subtotal - discount;
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items: state.items,
    wishlist: state.wishlist,
    promoCode: state.promoCode,
    loading: state.loading,
    error: state.error,
    subtotal,
    discount,
    total,
    totalItems,
    discountRate,
    PROMO_CODES,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    setPromoCode,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useEnhancedCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useEnhancedCart must be used within EnhancedCartProvider');
  }
  return context;
};