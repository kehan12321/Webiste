import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useEnhancedCart } from '../context/EnhancedCartContext'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function CartDrawer({ open, onClose, navigate }) {
  const { items, updateQuantity, subtotal, discount, total, promoCode, setPromoCode, PROMO_CODES } = useEnhancedCart()
  const [promoInput, setPromoInput] = useState(promoCode || '')

  return (
    <>
      {/* Backdrop overlay with fade animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[10040] bg-black/40 backdrop-blur-[1px]"
        style={{ pointerEvents: open ? 'auto' : 'none' }}
        onClick={onClose}
      />
      <motion.aside
        initial={{ opacity: 0, x: 420 }}
        animate={{ opacity: open ? 1 : 0, x: open ? 0 : 420 }}
        exit={{ opacity: 0, x: 420 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-20 left-0 right-0 sm:left-auto sm:right-6 w-[95vw] sm:w-[420px] max-h-[70vh] sm:max-h-[80vh] bg-black/90 p-6 z-[10050] overflow-y-auto relative rounded-lg shadow-xl border border-white/10"
      >
      {/* Top-right close button */}
      <button
        aria-label="Close cart"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Your Cart</h3>
        </div>

        {!items.length ? (
          <div className="text-center text-gray-400 mt-20">Your cart is empty</div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
            {items.map(it=>(
              <div key={it.id} className="p-3 bg-gray-900 rounded flex items-center justify-between">
                <div>
                  <div className="font-bold">{it.title}</div>
                  <div className="text-gray-400">${it.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>updateQuantity(it.id, it.quantity-1)} className="px-2">-</button>
                  <div className="px-2">{it.quantity}</div>
                  <button onClick={()=>updateQuantity(it.id, it.quantity+1)} className="px-2">+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-gray-800 pt-4">
          <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-red-400"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
          <div className="flex justify-between font-extrabold text-zpurple text-2xl mt-3"><span>Total</span><span>${total.toFixed(2)}</span></div>

          {/* Promo code input */}
          <div className="mt-4">
            <label className="text-sm">Promo code</label>
            <div className="flex gap-2 mt-2">
              <input
                value={promoInput}
                onChange={(e)=>setPromoInput(e.target.value)}
                className="bg-gray-800 p-2 rounded w-full"
                placeholder="ZALIANT20"
              />
              <button
                onClick={()=> {
                  const code = promoInput.trim().toUpperCase()
                  if(!code) { toast('Enter a promo code'); return }
                  if(PROMO_CODES[code]) { setPromoCode(code); toast.success(`Applied ${code} (${Math.round(PROMO_CODES[code]*100)}% off)`) } else { toast.error('Invalid code') }
                }}
                className="btn-primary"
              >
                Apply
              </button>
            </div>
            {promoCode && (
              <div className="mt-2 text-xs text-gray-400">
                Applied: {promoCode} {PROMO_CODES[promoCode] ? `(${Math.round(PROMO_CODES[promoCode]*100)}% off)` : '(invalid)'}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <button onClick={()=>{ onClose(); navigate('checkout') }} className="w-full btn-primary">Checkout</button>
            <button onClick={()=>navigate('store')} className="w-full px-4 py-2 bg-gray-800 rounded">Continue shopping</button>
          </div>
        </div>
      </div>
    </motion.aside>
    </>
  )
}
