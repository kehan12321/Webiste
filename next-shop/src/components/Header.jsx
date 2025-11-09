'use client'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="/" className="font-semibold text-lg">EasyBro</a>
        <nav className="flex gap-4 text-sm">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/store" className="hover:text-blue-600">Store</a>
          <a href="/cart" className="hover:text-blue-600">Cart</a>
          <a href="/support" className="hover:text-blue-600">Support</a>
        </nav>
      </div>
    </header>
  );
}

