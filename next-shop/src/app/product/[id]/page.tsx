import Link from "next/link";

async function fetchProduct(id: string) {
  try {
    // Try product by id endpoint first
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products/${encodeURIComponent(id)}`, { next: { revalidate: 120 } })
    if (res.ok) return await res.json()
  } catch {}
  try {
    // Fallback: fetch list and find item
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products`, { next: { revalidate: 120 } })
    if (!res.ok) return null
    const list = await res.json()
    return Array.isArray(list) ? list.find((p: any) => (p.id === id || p.slug === id || p.title === id)) : null
  } catch { return null }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id)
  if (!product) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-gray-600 mt-2">We couldn't locate this item.</p>
        <Link href="/store" className="mt-4 inline-block px-3 py-1 bg-gray-200 rounded">Back to Store</Link>
      </div>
    )
  }
  return (
    <div>
      <div className="h-48 bg-gray-800 rounded flex items-center justify-center mb-6">ICON</div>
      <h1 className="text-3xl font-bold mb-2">{product.title || product.name}</h1>
      <p className="text-gray-500 mb-4">{product.long || product.description || product.short}</p>
      <div className="flex items-center gap-4">
        <div className="text-2xl font-extrabold text-purple-600">${(product.price ?? 0).toFixed ? product.price.toFixed(2) : product.price}</div>
        <Link href="/store" className="px-3 py-1 bg-gray-700 rounded text-white">Back</Link>
        <Link href="/cart" className="px-3 py-1 bg-purple-600 rounded text-white">Add & View Cart</Link>
      </div>
    </div>
  )
}

