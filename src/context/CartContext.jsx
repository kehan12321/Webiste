import React, { createContext, useContext, useState, useMemo } from 'react'

const CartContext = createContext(null)
const PROMO_CODES = { ZALIANT20: 0.2, MAXPERF: 0.1, FREESHIP: 0 }

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [promoCode, setPromoCode] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const addToCart = (product, qty = 1) => {
    setCart(c => {
      const idx = c.findIndex(i=>i.id===product.id)
      if(idx>-1) return c.map((it,i)=> i===idx? {...it, quantity: it.quantity + qty} : it)
      return [...c, {...product, quantity: qty}]
    })
  }

  const updateQuantity = (id, q) => setCart(c=> c.map(it=> it.id===id? {...it, quantity: Math.max(1,q)}:it))
  const removeFromCart = (id) => setCart(c=> c.filter(i=>i.id!==id))

  const subtotal = useMemo(()=> cart.reduce((s,i)=> s + (i.price||0) * (i.quantity||1), 0), [cart])
  const discountRate = promoCode ? (PROMO_CODES[promoCode.toUpperCase()]||0) : 0
  const discount = subtotal * discountRate
  const total = subtotal - discount
  const totalItems = cart.reduce((s,i)=> s + (i.quantity||1), 0)

  return <CartContext.Provider value={{
    cart, addToCart, updateQuantity, removeFromCart,
    subtotal, discount, total, totalItems,
    promoCode, setPromoCode, PROMO_CODES,
    isLoggedIn, setIsLoggedIn
  }}>{children}</CartContext.Provider>
}

export const useCart = ()=> {
  const ctx = useContext(CartContext)
  if(!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
