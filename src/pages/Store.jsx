import React from 'react'
import products from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Store({ navigate, setProductId }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Zaliant Store</h2>
      <p className="text-gray-400 mb-6">Choose the right utility for your competitive needs.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(p=> <ProductCard key={p.id} product={p} onAdd={()=>{ setProductId(p.id); navigate('cart') }} onView={(id)=>{ setProductId(id); navigate('product') }} />)}
      </div>
    </div>
  )
}
