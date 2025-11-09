import React, { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function Cart({ navigate }) {
  const { cart, updateQuantity, removeFromCart, subtotal, discount, total, promoCode, setPromoCode, PROMO_CODES } = useCart()
  const [promoInput, setPromoInput] = useState(promoCode||'')
  const [msg, setMsg] = useState('')

  const applyPromo = ()=> {
    const code = promoInput.toUpperCase()
    if(PROMO_CODES[code] !== undefined){ setPromoCode(code); setMsg(`Applied ${code}`) } else { setMsg('Invalid code') }
  }

  if(!cart.length) return <div className="text-center py-20"><h2 className="text-3xl">Your Cart is Empty</h2></div>

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {cart.map(it=>(
          <div key={it.id} className="p-4 bg-gray-900 rounded flex items-center justify-between">
            <div>
              <div className="font-bold">{it.title}</div>
              <div className="text-gray-400">${it.price.toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded">
                <button onClick={()=>updateQuantity(it.id, it.quantity-1)} className="px-3">-</button>
                <div className="px-3">{it.quantity}</div>
                <button onClick={()=>updateQuantity(it.id, it.quantity+1)} className="px-3">+</button>
              </div>
              <div className="font-bold text-red-400">${(it.price*it.quantity).toFixed(2)}</div>
              <button onClick={()=>removeFromCart(it.id)} className="text-red-500">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <aside className="p-6 bg-gradient-to-br from-zpurple/6 to-zpink/6 rounded card-glass">
        <h3 className="font-bold text-xl">Order Summary</h3>
        <div className="mt-4">
          <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-red-400"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
          <div className="flex justify-between font-extrabold text-zpurple text-2xl border-t border-zpurple/30 pt-3"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>

        <div className="mt-4">
          <label className="text-sm">Promo code</label>
          <div className="flex gap-2 mt-2">
            <input value={promoInput} onChange={(e)=>setPromoInput(e.target.value)} className="bg-gray-800 p-2 rounded w-full" placeholder="ZALIANT20" />
            <button onClick={applyPromo} className="px-4 py-2 bg-red-600 rounded">Apply</button>
          </div>
          {msg && <div className="mt-2 text-sm text-gray-300">{msg}</div>}
        </div>

        <div className="mt-6 space-y-2">
          <button onClick={()=>navigate('checkout')} className="w-full btn-primary">Proceed to Checkout</button>
          <button onClick={()=>navigate('giftcard')} className="w-full px-4 py-2 bg-gray-800 rounded">Redeem Gift Card</button>
        </div>
      </aside>
    </div>
  )
}
