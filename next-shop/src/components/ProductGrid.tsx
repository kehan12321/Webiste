'use client'
import React from 'react'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'

export default function ProductGrid({ products }: { products: any[] }) {
  const { addItem } = useCart()
  const router = useRouter()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <div key={p.id || p.slug || p.title} className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:shadow-xl transition">
          <div className="h-40 bg-gray-800 rounded flex items-center justify-center mb-4">ICON</div>
          <h3 className="text-xl font-bold text-white">{p.title || p.name}</h3>
          <p className="text-gray-400 text-sm">{p.short || p.description}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="text-2xl font-extrabold text-purple-500">${(p.price ?? 0).toFixed ? p.price.toFixed(2) : p.price}</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  addItem({ id: p.id || p.slug || p.title, title: p.title || p.name, price: Number(p.price), tag: p.tag, short: p.short || p.description })
                  router.push('/cart')
                }}
                className="px-3 py-1 bg-purple-600 rounded text-white hover:bg-purple-700"
              >
                Add
              </button>
              <button
                onClick={() => router.push(`/product/${encodeURIComponent(p.id || p.slug || p.title)}`)}
                className="px-3 py-1 bg-gray-700 rounded text-white hover:bg-gray-600"
              >
                View
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
