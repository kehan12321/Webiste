import React from 'react'
import { motion } from 'framer-motion'
import BrandBadge from './BrandBadge'

export default function ProductCard({ product, onAdd, onView }) {
  return (
    <motion.article whileHover={{ scale: 1.02 }} className="product-tilt card-glass rounded-xl border border-gray-800 p-4">
      <div className="h-40 bg-gradient-to-br from-zpurple/10 to-zpink/8 rounded flex items-center justify-center mb-4 animate-float relative overflow-hidden">
        <BrandBadge />
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zpurple to-zpink flex items-center justify-center text-black font-bold">{product.title.split(' ')[0].slice(0,2).toUpperCase()}</div>
      </div>
      <h3 className="text-xl font-bold text-white">{product.title}</h3>
      <p className="text-gray-400 text-sm mt-2">{product.short}</p>
      <div className="flex items-center justify-between mt-4">
        <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zpurple to-zpink">${product.price.toFixed(2)}</div>
        <div className="flex gap-2">
          <button onClick={()=>onAdd(product)} className="btn-primary">Add</button>
          <button onClick={()=>onView(product.id)} className="px-3 py-1 bg-gray-800 rounded text-white">View</button>
        </div>
      </div>
    </motion.article>
  )
}
