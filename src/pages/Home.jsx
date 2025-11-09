import React from 'react'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import products from '../data/products'

export default function Home({ navigate, setProductId }) {
  const featured = products.slice(0,3)
  return (
    <div className="space-y-16">
      <Hero onPrimary={()=>navigate('store')} />
      <section>
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map(p=> <ProductCard key={p.id} product={p} onAdd={()=>setProductId(p.id)} onView={(id)=>{ setProductId(id); navigate('product') }} />)}
        </div>
      </section>
    </div>
  )
}
