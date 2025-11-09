import React, { useState, useEffect } from 'react'
import products from '../data/products'
import { useCart } from '../context/CartContext'
import BrandBadge from '../components/BrandBadge'

export default function Product({ productId, navigate }) {
  const product = products.find(p=>p.id===productId)
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)

  useEffect(()=>{ if(!product) { const t=setTimeout(()=>navigate('store'),700); return ()=>clearTimeout(t) } },[product,navigate])

  if(!product) return <div className="text-white">Product not found</div>

  return (
    <div className="grid lg:grid-cols-3 gap-8 bg-gradient-to-br from-zpurple/6 to-zpink/6 p-6 rounded card-glass">
      <div className="bg-gray-800 p-6 rounded flex items-center justify-center relative overflow-hidden">
        <BrandBadge />
        <div className="text-gray-300">{product.id.toUpperCase()}</div>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <span className={`px-3 py-1 rounded ${product.tag==='Best Value' ? 'bg-red-600':'bg-zpurple/80'} text-black`}>{product.tag}</span>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-gray-400">{product.short}</p>
        <div className="flex items-center gap-6">
          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zpurple to-zpink">${product.price.toFixed(2)}</div>
          <div className="flex items-center border rounded">
            <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="px-3">-</button>
            <div className="px-4">{qty}</div>
            <button onClick={()=>setQty(q=>q+1)} className="px-3">+</button>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={()=>{ addToCart(product, qty); navigate('cart') }} className="btn-primary px-6">Buy Now</button>
          <button onClick={()=>addToCart(product, qty)} className="px-4 py-2 bg-gray-800 rounded">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}
