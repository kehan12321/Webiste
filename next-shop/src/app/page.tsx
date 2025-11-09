export default async function Home() {
  let products: any[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      products = await res.json();
    }
  } catch (e) {
    // Fallback silently if backend is not reachable
  }

  return (
    <div>
      <section className="text-center py-10">
        <h1 className="text-3xl font-bold">Welcome to EasyBro</h1>
        <p className="text-gray-600 mt-2">Secure tools and performance packs</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products available yet. Make sure the backend is running.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id || p.slug || p.title} className="border rounded-lg p-4 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-medium">{p.title || p.name}</h3>
                  {p.tag && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{p.tag}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">{p.short || p.description}</p>
                <p className="mt-4 text-lg font-semibold">${(p.price ?? 0).toFixed ? p.price.toFixed(2) : p.price}</p>
                <a href="/checkout" className="mt-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Buy</a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
