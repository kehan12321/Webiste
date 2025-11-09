export default function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
        <p>© {new Date().getFullYear()} EasyBro. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="/support" className="hover:text-blue-600">Support</a>
          <a href="/login" className="hover:text-blue-600">Login</a>
        </div>
      </div>
    </footer>
  );
}

