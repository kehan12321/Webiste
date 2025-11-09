'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  const onLogin = async () => {
    setStatus('Logging in...')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token)
        setStatus('Logged in!')
      } else {
        setStatus(data?.message || 'Login failed')
      }
    } catch {
      setStatus('Network error')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <div className="max-w-sm space-y-3">
        <input className="border rounded px-3 py-2 w-full" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" className="border rounded px-3 py-2 w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={onLogin} className="bg-black text-white px-4 py-2 rounded">Login</button>
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  )
}

