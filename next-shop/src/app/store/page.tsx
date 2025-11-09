import ProductGrid from "../../components/ProductGrid";

export default async function StorePage() {
  let products: any[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products`, { next: { revalidate: 60 } });
    if (res.ok) products = await res.json();
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Store</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products available. Ensure backend is running.</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

