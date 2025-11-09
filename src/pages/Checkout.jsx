import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { motion } from 'framer-motion'

function FakePayment({ onPaid, method, amount }){
  const [tx, setTx] = useState(null)
  const pay = ()=>{
    const fake = method.slice(0,3).toUpperCase() + '-' + Math.random().toString(36).slice(2,12)
    setTx(fake)
  }
  return (
    <div className="space-y-3">
      <div className="bg-gray-800 p-4 rounded">
        <div className="text-sm">Send {amount} USD equivalent to:</div>
        <div className="mt-2 font-mono text-sm bg-black p-3 rounded">{method} address: <span className="text-green-400">1A2bFakeAddrXYZ</span></div>
      </div>
      {!tx ? (
        <button onClick={pay} className="btn-primary">Simulate Payment</button>
      ):(
        <div className="space-y-2">
          <div className="text-green-400">Payment detected — TX ID:</div>
          <div className="font-mono bg-black p-3 rounded">{tx}</div>
        <button onClick={()=>onPaid(tx)} className="px-4 py-2 rounded bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Confirm Order</button>
        </div>
      )}
    </div>
  )
}

export default function Checkout({ navigate }) {
  const { total, cart } = useCart()
  const [method, setMethod] = useState('BTC')
  const [paid, setPaid] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const handlePaid = (tx)=>{
    setOrderId('ORD-' + Math.random().toString(36).slice(2,10).toUpperCase())
    setPaid(true)
  }

  if(!cart.length) return <div className="text-center py-20">Cart empty</div>

  return (
    <div>
      {paid ? (
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="bg-gradient-to-br from-zpurple/8 to-zpink/8 p-8 rounded text-center card-glass">
          <h2 className="text-2xl font-bold text-green-400">Payment successful</h2>
          <p className="mt-2">Order ID: <span className="font-mono">{orderId}</span></p>
          <div className="mt-4">
            <button onClick={()=>navigate('dashboard')} className="btn-primary">Go to Dashboard</button>
          </div>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold">Choose payment method</h3>
            <div className="mt-4 flex gap-2">
              {['BTC','ETH','LTC','USDT-TRC20'].map(m=>(
                <button key={m} onClick={()=>setMethod(m)} className={`px-3 py-2 rounded ${method===m? 'bg-gradient-to-br from-zpurple to-zpink text-black':'bg-gray-800'}`}>{m}</button>
              ))}
            </div>

            <div className="mt-6">
              <FakePayment method={method} amount={total.toFixed(2)} onPaid={(tx)=>handlePaid(tx)} />
            </div>
          </div>

          <aside className="p-6 bg-gradient-to-br from-zpurple/6 to-zpink/6 rounded card-glass">
            <h4 className="font-bold">Order Summary</h4>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-gray-300"><span>Items</span><span>{cart.length}</span></div>
              <div className="flex justify-between text-gray-300"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
