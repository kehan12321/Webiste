import React from 'react'
import { useCart } from '../context/CartContext'
import { motion } from 'framer-motion'
import brandIcon from '../assets/zaliant3d.png'

export default function Header({ onNavigate, openCart }) {
  const { totalItems, isLoggedIn } = useCart()
  return (
    <motion.header initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} className="header-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={()=>onNavigate('home')}>
          <div className="w-11 h-11 bg-gradient-to-br from-zpurple to-zpink rounded-md flex items-center justify-center">
            <img src={brandIcon} alt="brand" className="w-7 h-7" />
          </div>
          <div>
            <div className="text-lg font-orbitron font-extrabold text-white">ZALIANT</div>
            <div className="text-xs text-gray-400">Performance Tools</div>
          </div>
        </div>

        <nav className="hidden md:flex gap-6">
          <button onClick={()=>onNavigate('store')} className='text-gray-300 hover:text-white'>Store</button>
          <button onClick={()=>onNavigate('dashboard')} className='text-gray-300 hover:text-white'>Dashboard</button>
          <button onClick={()=>onNavigate('support')} className='text-gray-300 hover:text-white'>Support</button>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={openCart} className="relative text-gray-300 hover:text-white p-2">
            Cart
            {totalItems>0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>}
          </button>
          <button onClick={()=>onNavigate('login')} className="bg-gradient-to-br from-zpurple to-zpink text-black px-3 py-2 rounded-lg font-bold">{isLoggedIn? 'Profile':'Login'}</button>
        </div>
      </div>
    </motion.header>
  )
}
