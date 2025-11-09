import React from 'react'
import { motion } from 'framer-motion'

export default function Hero({ onPrimary }) {
  return (
    <section className="relative overflow-hidden py-20">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="max-w-4xl mx-auto text-center">
        <span className="inline-block bg-red-900/30 px-3 py-1 text-xs text-red-300 rounded">Engineered for Esports</span>
        <h1 className="text-6xl font-orbitron font-extrabold mt-6 tracking-tighter leading-tight">
          Dominate <span className="bg-clip-text text-transparent bg-gradient-to-r from-zpurple to-zpink">Performance.</span>
        </h1>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">Cutting-edge performance packs, optimizations, and anti-ban tools for serious competitors.</p>
        <div className="mt-8 flex gap-4 justify-center">
          <button onClick={onPrimary} className="btn-primary px-6 py-3">Explore Store</button>
          <button onClick={()=>window.scrollTo({top:document.body.scrollHeight, behavior:'smooth'})} className="px-4 py-3 bg-gray-800 rounded">Check Compatibility</button>
        </div>
      </motion.div>
      <div className="glow-effect-hero pointer-events-none absolute inset-0 -z-10"></div>
    </section>
  )
}
