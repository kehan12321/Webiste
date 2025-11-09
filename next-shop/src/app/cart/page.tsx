'use client'
import { useCart } from '../../context/CartContext'

export default function CartPage() {
  const { items, removeItem, clear, subtotal } = useCart()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="border rounded p-4 flex items-start justify-between">
              <div>
                <h3 className="font-medium">{i.title ?? i.id}</h3>
                <p className="text-sm text-gray-600">{i.short}</p>
                <p className="mt-2">${i.price.toFixed(2)} × {i.quantity}</p>
              </div>
              <button className="text-red-600 hover:underline" onClick={() => removeItem(i.id)}>Remove</button>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-lg font-semibold">Subtotal</p>
            <p className="text-lg font-semibold">${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex gap-3">
            <a href="/checkout" className="bg-black text-white px-4 py-2 rounded">Checkout</a>
            <button onClick={clear} className="border px-4 py-2 rounded">Clear Cart</button>
          </div>
        </div>
      )}
    </div>
  )
}

