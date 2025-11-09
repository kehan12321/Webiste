'use client'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type CartItem = {
  id: string
  title?: string
  price: number
  quantity: number
  tag?: string
  short?: string
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem: (id: string) => void
  clear: () => void
  subtotal: number
  giftCardCode: string | null
  promoCode: string | null
  setGiftCardCode: (code: string | null) => void
  setPromoCode: (code: string | null) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [giftCardCode, setGiftCardCode] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('cart')
    if (raw) {
      try {
        const data = JSON.parse(raw)
        setItems(Array.isArray(data.items) ? data.items : [])
        setGiftCardCode(data.giftCardCode ?? null)
        setPromoCode(data.promoCode ?? null)
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items, giftCardCode, promoCode }))
  }, [items, giftCardCode, promoCode])

  const addItem = (item: Omit<CartItem, 'quantity'>, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + qty } : p))
      }
      return [...prev, { ...item, quantity: qty }]
    })
  }

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id))
  const clear = () => setItems([])

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])

  const value = {
    items,
    addItem,
    removeItem,
    clear,
    subtotal,
    giftCardCode,
    promoCode,
    setGiftCardCode,
    setPromoCode,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

