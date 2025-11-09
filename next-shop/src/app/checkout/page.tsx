'use client'
import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../../context/CartContext'

async function validateGiftCard(code: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/giftcards/validate?code=${encodeURIComponent(code)}`)
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

async function validatePromo(code: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/promotions/validate?code=${encodeURIComponent(code)}`)
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

async function placeOrder(payload: any, token?: string | null) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })
    return await res.json()
  } catch (e) { return { error: 'Network error' } }
}

export default function CheckoutPage() {
  const { items, subtotal, giftCardCode, promoCode, setGiftCardCode, setPromoCode, clear } = useCart()
  const [giftCardInput, setGiftCardInput] = useState(giftCardCode ?? '')
  const [promoInput, setPromoInput] = useState(promoCode ?? '')
  const [giftCardValue, setGiftCardValue] = useState<number>(0)
  const [promoPercent, setPromoPercent] = useState<number>(0)
  const [status, setStatus] = useState<string>('')

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const total = useMemo(() => {
    const afterGift = Math.max(0, subtotal - giftCardValue)
    const afterPromo = afterGift * (1 - promoPercent / 100)
    return Number(afterPromo.toFixed(2))
  }, [subtotal, giftCardValue, promoPercent])

  useEffect(() => {
    // attempt to load existing validations (optional)
  }, [])

  const onApplyGift = async () => {
    setStatus('Validating gift card...')
    const res = await validateGiftCard(giftCardInput)
    if (res && res.amount) {
      setGiftCardCode(giftCardInput)
      setGiftCardValue(Number(res.amount))
      setStatus(`Gift card applied: -$${Number(res.amount).toFixed(2)}`)
    } else {
      setStatus('Invalid gift card')
    }
  }

  const onApplyPromo = async () => {
    setStatus('Validating promo code...')
    const res = await validatePromo(promoInput)
    if (res && (res.discount || res.percent)) {
      const percent = Number(res.percent || res.discount)
      setPromoCode(promoInput)
      setPromoPercent(percent)
      setStatus(`Promo applied: -${percent}%`)
    } else {
      setStatus('Invalid promo code')
    }
  }

  const onPlaceOrder = async () => {
    setStatus('Placing order...')
    const payload = {
      items: items.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price })),
      giftCardCode: giftCardCode,
      promoCode: promoCode,
      subtotal,
      total,
    }
    const res = await placeOrder(payload, token)
    if (res && res.id) {
      clear()
      setGiftCardCode(null)
      setPromoCode(null)
      setStatus(`Order placed! #${res.id}`)
    } else {
      setStatus(res?.error || 'Order failed')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          <div className="border rounded p-4">
            <h2 className="font-semibold mb-3">Summary</h2>
            <div className="space-y-1">
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Gift card: -${giftCardValue.toFixed(2)}</p>
              <p>Promo: -{promoPercent}%</p>
              <p className="font-semibold">Total: ${total.toFixed(2)}</p>
            </div>
          </div>

          <div className="border rounded p-4 flex flex-col gap-3">
            <label className="font-medium">Gift card code</label>
            <div className="flex gap-2">
              <input className="border rounded px-2 py-1 flex-1" value={giftCardInput} onChange={(e) => setGiftCardInput(e.target.value)} placeholder="e.g. GFT-DEMO100" />
              <button onClick={onApplyGift} className="bg-black text-white px-3 py-1 rounded">Apply</button>
            </div>
          </div>

          <div className="border rounded p-4 flex flex-col gap-3">
            <label className="font-medium">Promo code</label>
            <div className="flex gap-2">
              <input className="border rounded px-2 py-1 flex-1" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="e.g. WELCOME10" />
              <button onClick={onApplyPromo} className="border px-3 py-1 rounded">Apply</button>
            </div>
          </div>

          <button onClick={onPlaceOrder} className="bg-green-600 text-white px-4 py-2 rounded">Place Order</button>
          {status && <p className="text-sm text-gray-600">{status}</p>}
        </div>
      )}
    </div>
  )
}

