import React, { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function Login({ navigate }) {
  const { setIsLoggedIn } = useCart()
  const [isRegister, setIsRegister] = useState(false)
  const submit = (e)=>{ e.preventDefault(); setIsLoggedIn(true); navigate('dashboard') }
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md p-8 bg-gradient-to-br from-zpurple/6 to-zpink/6 rounded card-glass">
        <h2 className="text-2xl font-bold mb-4">{isRegister? 'Register':'Login'}</h2>
        <form onSubmit={submit} className="space-y-3">
          <input required className="w-full p-2 bg-gray-800 rounded" placeholder="Email" />
          <input required className="w-full p-2 bg-gray-800 rounded" placeholder="Password" type="password" />
          <button className="w-full btn-primary py-2 mt-2">{isRegister? 'Register':'Sign in'}</button>
        </form>
        <div className="mt-3 text-center">
          <button onClick={()=>setIsLoggedIn(true) } className="text-zpink">Quick login (mock)</button>
        </div>
      </div>
    </div>
  )
}
