import React, { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function GiftCard({ navigate }) {
  const { setPromoCode } = useCart()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const handle = ()=>{
    const c = code.trim().toUpperCase()
    if(c==='GIFT100'){ setPromoCode('ZALIANT20'); setMsg('Applied ZALIANT20 as gift!') } else setMsg('Invalid gift code')
  }
  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-br from-zpurple/6 to-zpink/6 rounded card-glass">
      <h3 className="text-xl font-bold">Redeem Gift Card</h3>
      <div className="mt-4">
        <input value={code} onChange={(e)=>setCode(e.target.value)} className="w-full p-2 bg-gray-800 rounded" placeholder="Enter gift code e.g., GIFT100" />
        <div className="mt-3 flex gap-2">
          <button onClick={handle} className="btn-primary">Redeem</button>
          <button onClick={()=>navigate('store')} className="px-3 py-2 bg-gray-800 rounded">Back</button>
        </div>
        {msg && <div className="mt-3 text-gray-300">{msg}</div>}
      </div>
    </div>
  )
}
