import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';

// Enhanced Components
import EnhancedProductCard from './components/EnhancedProductCard';
import CartDrawer from './components/CartDrawer';
import { EnhancedCartProvider, useEnhancedCart } from './context/EnhancedCartContext';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { useClient } from './context/ClientContext';

// Utils
import { cn, readBodySafe, extractError } from './lib/utils';

// Icons
import { ShoppingCart, User, Menu, X, Package, Shield, Zap, PackageCheck, Sparkles, Sun, Moon, BadgeCheck, Play } from 'lucide-react';
import ParticlesBackground from './components/ParticlesBackground';
import brandIcon from './assets/zaliant3d.png';
import FireParticles from './components/FireParticles';
import valPrivateBox from './assets/valprivatebox-Niy4jamt.png';
import permSpooferBox from './assets/permspooferbox-BC45mtpn.png';

// Create a client
const queryClient = new QueryClient();

// API base for server calls (supports deployed frontend with remote backend)
const API_BASE = import.meta.env?.VITE_API_URL || '';
const api = (path) => (API_BASE ? `${API_BASE}${path}` : path);

// Enhanced Product Data (trimmed to two products)
const enhancedProducts = [
  {
    id: "valorant-private",
    title: "Valorant Pro",
    short: "Included vanguard bypass low ban chance",
    long: [
      "Information:",
      "- VANGUARD EMULATOR (Bypass Vanguard Anticheat) + INTERNAL CHEAT INCLUDED",
      "- POPUP BYPASS (Bypass tpm/secureboot/hvci error)",
      "- FULL SUPPORT WIN 10/11",
      "- WORKS ON HVCI ON/OFF",
      "- CUSTOM BUILDS FOR ALL USERS",
      "",
      "Features:",
      "Aimbot:",
      "- Enable Aimbot",
      "- Silent Aim [Hold]",
      "- Visible Check",
      "- Recoil Control",
      "- Draw FOV",
      "- FOV Value adjustment",
      "- Smooth aiming controls",
      "- Bone selection (Head, Neck, Chest)",
      "- FOV Color customization",
      "- Customizable keybinds",
      "",
      "Visuals:",
      "- 2D Box ESP",
      "- 3D Box ESP",
      "- Corner Box",
      "- Vis Check [ESP]",
      "- Skeleton display",
      "- Agent icon",
      "- Health Bar",
      "- Snapline",
      "- Weapon Info",
      "- Material customization for hands and weapons",
      "- SpikeInfo",
      "- Wireframe on Enemy/Hand/Gun",
      "- Material options for hands and weapons",
      "",
      "Chams:",
      "- Chams ESP",
      "- Visible Chams",
      "- Rainbow Chams [Only Enemy]",
      "- Rainbow Chams [All Entity]",
      "- Intensity adjustment",
      "- RGB color customization",
      "",
      "Exploits:",
      "- No Spread",
      "- Skip Tutorial",
      "- Unlock ALL",
      "- Bunny Hop",
      "- Big Gun customization",
      "- Big Gun 3D perspective",
      "- Big Gun Wireframe",
      "- 3D FOV Changer with value adjustment",
      "- ThirdPerson mode with distance control",
      "- Spin Bot with speed adjustment",
    ],
    notice: "Please use our products responsibly. We are not responsible for any bans or consequences that may result from using our software. Use at your own risk.",
    price: 74.99,
    tag: "Most Popular",
    rating: 4.9,
    reviews: 1200,
    features: ["Aimbot", "RCS", "ESP"],
    plans: [
      { label: "3 Days", price: 14.99 },
      { label: "1 Week", price: 34.99 },
      { label: "1 Month", price: 74.99, popular: true },
      { label: "Lifetime", price: 149.99 },
    ],
  },
  {
    id: "spoofer-permanent",
    title: "Permanent HWID Spoofer",
    short: "Permanent hardware ID spoofing solution",
    long: [
      "Features:",
      "- Permanent HWID spoofing",
      "- Works with Windows 10-11",
      "- Works with Intel-Amd",
      "- Works with all anti-cheats",
      "- Works with all motherboards (both locked & unlocked)",
      "- Included TPM Bypass for Valorant",
      "- Supports all major games",
      "- Easy one-click operation",
      "- No traces left behind",
      "- Lifetime updates",
    ],
    notice: "Please use our products responsibly. We are not responsible for any bans or consequences that may result from using our software. Use at your own risk.",
    price: 39.99,
    tag: "Spoofer",
    rating: 4.8,
    reviews: 987,
    features: ["Windows 10/11", "Intel/AMD", "TPM Bypass"],
    plans: [
      { label: "Onetime", price: 14.99 },
      { label: "Lifetime", price: 39.99, popular: true },
    ],
  },
];

// Enhanced Header Component
const EnhancedHeader = ({ cartItemCount, onCartClick, theme, toggleTheme, onNavigate, logoSrc, brandSubtitle, isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-8 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? theme === 'dark'
            ? "bg-gray-900/95 backdrop-blur-lg shadow-lg"
            : "bg-white/90 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => onNavigate?.('home')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              {logoSrc ? (
                <img src={logoSrc} alt="Zaliant" className="h-10 w-auto drop-shadow" />
              ) : (
                <div className={cn("w-10 h-10 bg-gradient-to-br from-[var(--zpurple)] to-[var(--zpink)] rounded-lg flex items-center justify-center")}> 
                  <Sparkles className={cn("w-6 h-6", theme === 'dark' ? "text-white" : "text-gray-900")} />
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className={cn("text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)]")}>zaliant</span>
                {brandSubtitle && (
                  <span className="metal-text text-lg hidden md:inline">{brandSubtitle}</span>
                )}
              </div>
            </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              {label:'Home', page:'home'},
              {label:'Store', page:'store'},
              {label:'Support', page:'support'},
              {label:'Dashboard', page:'dashboard'},
            ].map((item) => (
              <motion.button
                key={item.page}
                onClick={() => {
                  if (item.page === 'dashboard') {
                    isLoggedIn ? onNavigate?.('dashboard') : onNavigate?.('login');
                  } else {
                    onNavigate?.(item.page);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                className={cn("transition-colors font-medium",
                  theme === 'dark' ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black")}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={cn("p-2 transition-colors", theme === 'dark' ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black")}
            >
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('login')}
              className={cn("p-2 transition-colors", theme === 'dark' ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black")}
            >
              <User className="w-6 h-6" />
            </motion.button>

            {isLoggedIn && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className={cn("px-3 py-2 rounded border text-sm",
                  theme === 'dark' ? "border-white/20 text-gray-200 hover:bg-white/10" : "border-gray-300 text-gray-800 hover:bg-gray-200")}
              >
                Logout
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              className={cn("relative p-2 transition-colors", theme === 'dark' ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black")}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn("md:hidden p-2 transition-colors", theme === 'dark' ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black")}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={cn("md:hidden mt-3 rounded-lg border", theme === 'dark' ? "bg-gray-900/90 border-gray-800" : "bg-white/90 border-gray-200")}
            >
              <div className="flex flex-col py-2">
                {[
                  { label: 'Home', page: 'home' },
                  { label: 'Store', page: 'store' },
                  { label: 'Support', page: 'support' },
                  { label: 'Dashboard', page: 'dashboard' },
                ].map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (item.page === 'dashboard') {
                        isLoggedIn ? onNavigate?.('dashboard') : onNavigate?.('login');
                      } else {
                        onNavigate?.(item.page);
                      }
                    }}
                    className={cn(
                      "text-left px-4 py-3",
                      theme === 'dark' ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {item.label}
                  </button>
                ))}

                <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-800/40">
                  <button
                    onClick={toggleTheme}
                    className={cn("p-2 rounded", theme === 'dark' ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100")}
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); onNavigate?.('login'); }}
                    className={cn("p-2 rounded", theme === 'dark' ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100")}
                    aria-label="Login"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); onCartClick?.(); }}
                    className={cn("p-2 rounded relative", theme === 'dark' ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100")}
                    aria-label="Open cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

// Product Details (Enhanced)
const EnhancedProductPage = ({ productId, onBack, onBuy }) => {
  const { addToCart } = useEnhancedCart();
  const product = enhancedProducts.find(p => p.id === productId);
  const [selectedPlan, setSelectedPlan] = useState(() => {
    const plans = product?.plans || [];
    return plans.find(p => p.popular) || plans[0] || null;
  });
  if (!product) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">Product not found.</p>
          <Button onClick={onBack} className="mt-4 bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Back to Store</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Product image + Showcase */}
        <div className="p-6 rounded card-glass bg-black/40 border border-white/10">
          <div className="relative flex items-center justify-center">
            {(() => {
              const productImage = product.id === 'valorant-private' ? valPrivateBox : product.id === 'spoofer-permanent' ? permSpooferBox : valPrivateBox;
              return (
                <img src={productImage} alt={`${product.title} Box`} className="w-full max-h-[420px] object-contain rounded shadow-lg" />
              );
            })()}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full bg-black/40 border-[var(--zpurple)]/30 text-gray-200 hover:border-[var(--zpurple)]">
              <Play className="w-4 h-4 mr-2" />
              Watch Showcase
            </Button>
          </div>
        </div>
        {/* Right: Details + Plans */}
        <div className="lg:col-span-2 p-6 rounded card-glass bg-black/40 border border-white/10">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="mt-2 text-gray-400">{product.short}</div>
          {/* Plans */}
          {product.plans?.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-2">Choose Your Plan</div>
              <div className="space-y-3">
                {product.plans.map((pl, idx) => {
                  const isActive = selectedPlan?.label === pl.label;
                  const variant = {
                    ...product,
                    id: `${product.id}:${pl.label.toLowerCase().replace(/\s+/g,'-')}`,
                    title: `${product.title} — ${pl.label}`,
                    price: pl.price,
                  };
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedPlan(pl)}
                      className={cn(
                        "rounded border bg-black/40 p-4 cursor-pointer",
                        isActive ? "border-[var(--zpurple)]/60" : "border-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">{pl.label}</div>
                          {pl.popular && (
                            <span className="text-xs px-2 py-0.5 rounded bg-[var(--zpurple)]/20 text-[var(--zpurple)] border border-[var(--zpurple)]/40">Most Popular</span>
                          )}
                          <div className="ml-3 text-xs text-gray-400">Full access</div>
                        </div>
                        <div className="font-bold text-gray-200">${pl.price.toFixed(2)}</div>
                      </div>
                      <div className="mt-3">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(variant, 1);
                            onBuy?.();
                          }}
                          className="w-full bg-[var(--zpurple)] text-white"
                        >
                          Purchase {pl.label}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-4">
            <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)]">${(selectedPlan?.price ?? product.price).toFixed(2)}</div>
            <div className="text-sm text-gray-400">Rating: {product.rating} ({product.reviews} reviews)</div>
          </div>
          <div className="mt-6 space-y-3">
            {product.long.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "text-gray-300",
                  line.trim() === "" ? "h-2" : "",
                  /:\s*$/.test(line) ? "font-semibold mt-4" : "",
                  /^-\s/.test(line) ? "before:content-['•'] before:text-[var(--zpurple)] before:mr-2" : ""
                )}
              >
                {line.replace(/^-/,'').trim()}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => {
              const pl = selectedPlan;
              const variant = pl
                ? {
                    ...product,
                    id: `${product.id}:${pl.label.toLowerCase().replace(/\s+/g,'-')}`,
                    title: `${product.title} — ${pl.label}`,
                    price: pl.price,
                  }
                : product;
              addToCart(variant, 1);
              onBuy?.();
            }} className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">{selectedPlan ? `Purchase ${selectedPlan.label}` : 'Buy Now'}</Button>
            <Button variant="outline" onClick={() => {
              const pl = selectedPlan;
              const variant = pl
                ? {
                    ...product,
                    id: `${product.id}:${pl.label.toLowerCase().replace(/\s+/g,'-')}`,
                    title: `${product.title} — ${pl.label}`,
                    price: pl.price,
                  }
                : product;
              addToCart(variant, 1);
            }} className="border-[var(--zpurple)] text-[var(--zpurple)]">Add to Cart</Button>
          </div>
          {product.notice && (
            <div className="mt-6 p-4 rounded bg-[var(--zpurple)]/10 border border-[var(--zpurple)]/20">
              <div className="font-semibold mb-2">Important Notice</div>
              <div className="text-sm text-gray-300">{product.notice}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Cart Page (Enhanced)
const EnhancedCartPage = ({ onCheckout, onShop }) => {
  const { items, updateQuantity, removeFromCart, subtotal, discount, total, promoCode, setPromoCode, PROMO_CODES } = useEnhancedCart();
  const [promo, setPromo] = useState(promoCode || '');

  if (!items.length) {
    return (
      <section className="py-16 text-center">
          <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
          <Button onClick={onShop} className="mt-4 bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Go to Store</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map(it => (
            <div key={it.id} className="p-4 bg-gray-900 rounded flex items-center justify-between">
              <div>
                <div className="font-bold">{it.title}</div>
                <div className="text-gray-400">${it.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded">
                  <button onClick={() => updateQuantity(it.id, it.quantity - 1)} className="px-3">-</button>
                  <div className="px-3">{it.quantity}</div>
                  <button onClick={() => updateQuantity(it.id, it.quantity + 1)} className="px-3">+</button>
                </div>
                <div className="font-bold text-[var(--zpurple)]">${(it.price * it.quantity).toFixed(2)}</div>
                <button onClick={() => removeFromCart(it.id)} className="text-red-500">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="p-6 bg-gradient-to-br from-[var(--zpurple)]/10 to-[var(--zpink)]/10 rounded card-glass">
          <h3 className="font-bold text-xl">Order Summary</h3>
          <div className="mt-4">
            <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-red-400"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
            <div className="flex justify-between font-extrabold text-[var(--zpurple)] text-2xl border-t border-[var(--zpurple)]/30 pt-3"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <div className="mt-4">
            <label className="text-sm">Promo code</label>
            <div className="flex gap-2 mt-2">
              <input value={promo} onChange={(e)=>setPromo(e.target.value)} className="bg-gray-800 p-2 rounded w-full" placeholder="ZALIANT20" />
              <Button
                onClick={() => {
                  const code = promo.trim().toUpperCase();
                  if(!code) { toast('Enter a promo code'); return; }
                  if(PROMO_CODES[code]) {
                    setPromoCode(code);
                    toast.success(`Applied ${code} (${Math.round(PROMO_CODES[code]*100)}% off)`);
                  } else {
                    toast.error('Invalid code');
                  }
                }}
                className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white"
              >Apply</Button>
            </div>
            {promoCode && (
              <div className="mt-2 text-xs text-gray-400">Applied: {promoCode} ({PROMO_CODES[promoCode] ? Math.round(PROMO_CODES[promoCode]*100) : 0}% off)</div>
            )}
          </div>
          <div className="mt-6 space-y-2">
            <Button onClick={onCheckout} className="w-full bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Proceed to Checkout</Button>
            <Button variant="outline" onClick={onShop} className="w-full border-[var(--zpurple)] text-[var(--zpurple)]">Continue Shopping</Button>
          </div>
        </aside>
      </div>
    </section>
  );
};

// Checkout (Enhanced, crypto/demo)
const EnhancedCheckoutPage = ({ onSuccess }) => {
  const { items, total, clearCart } = useEnhancedCart();
  const { addOrder, getGiftCardBalance, applyGiftCard } = useClient();
  const [method, setMethod] = useState('BTC');
  const [tx, setTx] = useState('');
  const [giftCode, setGiftCode] = useState('');
  const [giftApplied, setGiftApplied] = useState(0);

  const canApplyGift = () => {
    // Make Apply available when any code is entered; validate on click
    return giftCode.trim().length > 0;
  };

  const applyGift = () => {
    const code = giftCode.trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a gift card code');
      return;
    }
    const bal = getGiftCardBalance(code);
    if (bal <= 0) {
      toast.error('Invalid gift card code or zero balance');
      setGiftApplied(0);
      return;
    }
    const used = Math.min(bal, total);
    setGiftApplied(used);
    toast.success(`Applied $${used.toFixed(2)} from ${code}`);
  };

  const payAndRecord = () => {
    const code = giftCode.trim().toUpperCase();
    if (giftApplied > 0 && code) {
      applyGiftCard(code, giftApplied);
    }
    addOrder({ items, total, paidWith: method, giftApplied, txId: method === 'Stripe' ? 'stripe_placeholder' : tx });
    clearCart();
    onSuccess();
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold">Choose payment method</h3>
          <div className="mt-4 flex gap-2">
            {['Stripe','BTC','ETH','USDT-TRC20'].map(m => (
              <button key={m} onClick={() => setMethod(m)} className={`px-3 py-2 rounded ${method===m? 'bg-gradient-to-br from-[var(--zpurple)] to-[var(--zpink)] text-black':'bg-gray-800 text-white'}`}>{m}</button>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {method === 'Stripe' ? (
              <div className="p-4 bg-gray-800 rounded text-gray-300">Stripe form placeholder — integrate later.</div>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-800 p-4 rounded text-sm">Send {total.toFixed(2)} USD equivalent via {method} to the address shown.</div>
                <input value={tx} onChange={(e)=>setTx(e.target.value)} placeholder="Paste TX ID" className="w-full p-2 bg-gray-800 rounded" />
                <Button disabled={!tx} onClick={payAndRecord} className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Confirm Order</Button>
              </div>
            )}
          </div>
        </div>

        <aside className="p-6 bg-gradient-to-br from-[var(--zpurple)]/10 to-[var(--zpink)]/10 rounded card-glass">
          <h4 className="font-bold">Order Summary</h4>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="mt-3">
              <label className="block text-sm mb-1">Gift Card Code</label>
              <div className="flex gap-2">
                <input value={giftCode} onChange={(e)=>setGiftCode(e.target.value)} placeholder="Try GFT-DEMO100" className="flex-1 p-2 bg-gray-800 rounded" />
                <Button onClick={applyGift} disabled={!canApplyGift()} className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Apply</Button>
              </div>
              {giftCode && (
                <div className="text-sm text-gray-400 mt-2">Balance: ${getGiftCardBalance(giftCode.trim().toUpperCase()).toFixed(2)} | Applied: ${giftApplied.toFixed(2)}</div>
              )}
            </div>
            <div className="flex justify-between text-white font-semibold"><span>Due</span><span>${Math.max(0, (total - giftApplied)).toFixed(2)}</span></div>
          </div>
        </aside>
      </div>
    </section>
  );
};

// Support
const EnhancedSupport = () => {
  const { state } = useClient();
  const hasOrders = (state?.orders?.length || 0) > 0;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold">Support</h2>
        {!hasOrders && (
          <div className="mt-4 rounded border border-yellow-600 bg-yellow-600/10 text-yellow-300 p-3 flex items-center justify-between">
            <span>Support requires at least one completed purchase. Complete an order first.</span>
            <Button variant="outline" disabled className="border-yellow-600 text-yellow-300">Complete an order first</Button>
          </div>
        )}
        <p className="mt-2 text-gray-300">Reach us on Discord: <a className="underline" href="https://discord.easybro.net" target="_blank" rel="noreferrer">invite</a></p>
        <p className="text-gray-400">Email: support@zaliant.services</p>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded card-glass bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-2">Payments</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Crypto accepted on site (BTC, ETH, USDT-TRC20).</li>
              <li>• Card payments available via Discord support ticket.</li>
              <li>• PayPal/CashApp/Binance Gift Cards not accepted for security.</li>
            </ul>
          </div>
          <div className="p-4 rounded card-glass bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-2">Refunds</h3>
            <p className="text-sm text-gray-300">Full refund within 7 days if a product does not function as intended.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Dashboard (client area)
const EnhancedDashboard = () => {
  const { state, addAddress, addPaymentMethod, createTicket } = useClient();
  const [addr, setAddr] = useState({ line1: '', city: '', country: '' });
  const [pm, setPm] = useState({ brand: '', last4: '' });
  const [ticket, setTicket] = useState({ subject: '', message: '' });
  const hasOrders = (state?.orders?.length || 0) > 0;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold">Client Area</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="p-4 rounded card-glass bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-2">Orders</h3>
            {state.orders.length === 0 ? (
              <div className="text-gray-400">No orders yet.</div>
            ) : (
              <div className="space-y-2 text-sm">
                {state.orders.map(o => (
                  <div key={o.id} className="p-2 rounded bg-gray-800/60">
                    <div className="flex justify-between"><span>{new Date(o.createdAt).toLocaleString()}</span><span className="font-mono">{o.txId}</span></div>
                    <div className="flex justify-between"><span>Method</span><span>{o.paidWith}</span></div>
                    <div className="flex justify-between"><span>Total</span><span>${o.total.toFixed(2)}</span></div>
                    {o.giftApplied > 0 && <div className="text-gray-300">Gift applied: ${o.giftApplied.toFixed(2)}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded card-glass bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-2">Gift Cards</h3>
            {Object.keys(state.giftCards).length === 0 ? (
              <div className="text-gray-400">No gift cards saved.</div>
            ) : (
              <div className="space-y-2 text-sm">
                {Object.entries(state.giftCards).map(([code, gc]) => (
                  <div key={code} className="p-2 rounded bg-gray-800/60 flex justify-between">
                    <span className="font-mono">{code}</span>
                    <span>${gc.balance.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded card-glass bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-2">Support Tickets</h3>
            {!hasOrders && (
              <div className="mb-3 rounded border border-yellow-600 bg-yellow-600/10 text-yellow-300 p-3">
                You need to purchase at least once to open tickets.
              </div>
            )}
            <div className="space-y-2">
              <input disabled={!hasOrders} value={ticket.subject} onChange={(e)=>setTicket(t=>({...t, subject:e.target.value}))} className="w-full p-2 bg-gray-800 rounded disabled:opacity-50" placeholder="Subject" />
              <textarea disabled={!hasOrders} value={ticket.message} onChange={(e)=>setTicket(t=>({...t, message:e.target.value}))} className="w-full p-2 bg-gray-800 rounded disabled:opacity-50" placeholder="Message" />
              <Button disabled={!hasOrders} onClick={()=>{ if(ticket.subject && hasOrders) { createTicket(ticket); setTicket({ subject:'', message:'' }); } }} className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Submit</Button>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              {state.tickets.map(t => (
                <div key={t.id} className="p-2 rounded bg-gray-800/60">
                  <div className="flex justify-between"><span>{t.subject}</span><span className="uppercase text-xs">{t.status}</span></div>
                  <div className="text-gray-400">{t.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded card-glass bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-2">Addresses</h3>
            <div className="space-y-2">
              <input value={addr.line1} onChange={(e)=>setAddr(a=>({...a, line1:e.target.value}))} className="w-full p-2 bg-gray-800 rounded" placeholder="Line 1" />
              <div className="grid grid-cols-2 gap-2">
                <input value={addr.city} onChange={(e)=>setAddr(a=>({...a, city:e.target.value}))} className="p-2 bg-gray-800 rounded" placeholder="City" />
                <input value={addr.country} onChange={(e)=>setAddr(a=>({...a, country:e.target.value}))} className="p-2 bg-gray-800 rounded" placeholder="Country" />
              </div>
              <Button onClick={()=>{ if(addr.line1) { addAddress(addr); setAddr({ line1:'', city:'', country:'' }); } }} className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Add Address</Button>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              {state.addresses.map(a => (
                <div key={a.id} className="p-2 rounded bg-gray-800/60">
                  <div>{a.line1}</div>
                  <div className="text-gray-400">{a.city}, {a.country}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded card-glass bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-2">Payment Methods</h3>
            <div className="space-y-2">
              <input value={pm.brand} onChange={(e)=>setPm(p=>({...p, brand:e.target.value}))} className="w-full p-2 bg-gray-800 rounded" placeholder="Brand (e.g., Visa)" />
              <input value={pm.last4} onChange={(e)=>setPm(p=>({...p, last4:e.target.value}))} className="w-full p-2 bg-gray-800 rounded" placeholder="Last 4 digits" />
              <Button onClick={()=>{ if(pm.brand && pm.last4) { addPaymentMethod(pm); setPm({ brand:'', last4:'' }); } }} className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Add Payment</Button>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              {state.paymentMethods.map(p => (
                <div key={p.id} className="p-2 rounded bg-gray-800/60 flex justify-between">
                  <span>{p.brand}</span>
                  <span>•••• {p.last4}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Access gate shown when not logged in
const AccessRequired = ({ onLogin, onRegister }) => (
  <section className="py-24">
    <div className="container mx-auto px-4">
      <div className="card-glass bg-black/50 border border-white/10 rounded p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Sign in required</h2>
        <p className="text-gray-300 mb-6">Please log in to access your client area.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={onLogin} className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Login</Button>
          <Button variant="outline" onClick={onRegister} className="border-[var(--zpurple)] text-[var(--zpurple)]">Create Account</Button>
        </div>
      </div>
    </div>
  </section>
);

// Auth
const EnhancedLogin = ({ onRegister, onSuccess }) => {
  const { setOrdersFromServer } = useClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const emailValid = (e) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(e);

  const doLogin = async () => {
    const e = email.trim();
    const p = password;
    if (!emailValid(e)) { toast.error('Enter a valid email'); return; }
    if (!p || p.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch(api('/api/auth/login'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: e, password: p })
      });
      const data = await readBodySafe(res);
      if (!res.ok || !data?.token) throw new Error(extractError(data, 'Login failed'));
      localStorage.setItem('auth_token', data.token);
      // Load orders for this account
      try {
        const or = await fetch(api('/api/orders'), { headers: { 'Authorization': `Bearer ${data.token}` } });
        if (or.ok) {
          const orders = await readBodySafe(or);
          if (Array.isArray(orders)) setOrdersFromServer(orders);
        }
      } catch {}
      toast.success('Welcome back');
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-md">
        <h2 className="text-2xl font-bold">Login</h2>
        <div className="mt-4 space-y-3">
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 bg-gray-800 rounded" />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 bg-gray-800 rounded" />
          <Button onClick={doLogin} disabled={loading} className="w-full bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <button onClick={onRegister} className="w-full px-4 py-2 bg-gray-800 rounded">Need an account? Register</button>
        </div>
      </div>
    </section>
  );
};

const EnhancedRegister = ({ onLogin, onSuccess }) => {
  const { setOrdersFromServer } = useClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const emailValid = (e) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(e);

  const doRegister = async () => {
    const e = email.trim();
    const p = password;
    if (!emailValid(e)) { toast.error('Enter a valid email'); return; }
    if (!p || p.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch(api('/api/auth/register'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: e, password: p })
      });
      const data = await readBodySafe(res);
      if (!res.ok) throw new Error(extractError(data, 'Registration failed'));
      // Do NOT auto-login after registration; send user to login page
      toast.success('Account created. Please login to continue.');
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-md">
        <h2 className="text-2xl font-bold">Register</h2>
        <div className="mt-4 space-y-3">
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 bg-gray-800 rounded" />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 bg-gray-800 rounded" />
          <Button onClick={doRegister} disabled={loading} className="w-full bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">{loading ? 'Creating...' : 'Create Account'}</Button>
          <button onClick={onLogin} className="w-full px-4 py-2 bg-gray-800 rounded">Have an account? Login</button>
        </div>
      </div>
    </section>
  );
};

// Gift Card (Enhanced)
const EnhancedGiftCard = ({ onBack }) => {
  const { purchaseGiftCard, addGiftCard, getGiftCardBalance } = useClient();
  const [purchaseAmount, setPurchaseAmount] = useState(50);
  const [generatedCode, setGeneratedCode] = useState('');

  const [redeemCode, setRedeemCode] = useState('');
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [msg, setMsg] = useState('');

  const handlePurchase = () => {
    const amt = Math.max(1, Number(purchaseAmount) || 0);
    const code = purchaseGiftCard(amt);
    setGeneratedCode(code);
    setMsg(`Purchased gift card ${code} with $${amt.toFixed(2)} balance.`);
  };

  const handleRedeem = () => {
    const code = redeemCode.trim().toUpperCase();
    const amt = Math.max(0, Number(redeemAmount) || 0);
    if (!code) { setMsg('Enter a gift card code'); return; }
    addGiftCard(code, amt);
    setMsg(`Redeemed ${code}. New balance: $${getGiftCardBalance(code).toFixed(2)}`);
  };
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-lg">
        <h3 className="text-xl font-bold">Gift Card</h3>
        <div className="mt-6 p-4 rounded bg-black/40 border border-white/10">
          <h4 className="font-semibold">Purchase</h4>
          <div className="mt-2 flex items-center gap-2">
            <select value={purchaseAmount} onChange={(e)=>setPurchaseAmount(Number(e.target.value))} className="p-2 bg-gray-800 rounded">
              {[25,50,100,200].map(a => <option key={a} value={a}>${a}</option>)}
            </select>
            <Button onClick={handlePurchase} className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Generate Code</Button>
          </div>
          {generatedCode && (
            <div className="mt-2 text-sm text-gray-300">Generated: <span className="font-mono">{generatedCode}</span> — Balance ${getGiftCardBalance(generatedCode).toFixed(2)}</div>
          )}
        </div>

        <div className="mt-6 p-4 rounded bg-black/40 border border-white/10">
          <h4 className="font-semibold">Redeem</h4>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input value={redeemCode} onChange={(e)=>setRedeemCode(e.target.value)} className="p-2 bg-gray-800 rounded col-span-2" placeholder="Enter gift code e.g., GFT-XXXXX" />
            <input type="number" value={redeemAmount} onChange={(e)=>setRedeemAmount(e.target.value)} className="p-2 bg-gray-800 rounded" placeholder="$ Amount" />
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={handleRedeem} className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white">Redeem</Button>
            <button onClick={onBack} className="px-3 py-2 bg-gray-800 rounded">Back</button>
          </div>
        </div>

        {msg && <div className="mt-3 text-gray-300">{msg}</div>}
      </div>
    </section>
  );
};

// Enhanced Hero Section
const EnhancedHero = ({ onPrimary }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--zpurple)]/20 via-gray-900 to-[var(--zpink)]/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--zpurple)]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--zpink)]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] mb-6">
            Zaliant Services
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Premium performance tools. Polished UI, smooth animations, and a real feel checkout system.
            Use the store to add products, or the dashboard to monitor orders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onPrimary} className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white px-8">
              Explore Store
            </Button>
            <Button size="lg" variant="outline" onClick={() => onPrimary?.('dashboard')} className="border-[var(--zpurple)] text-[var(--zpurple)] hover:bg-[color:rgba(123,60,255,0.12)]">
              Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
        >
          {[
            { icon: Zap, title: 'Performance', desc: 'Optimized tools for competitive play.' },
            { icon: Shield, title: 'Security', desc: 'Anti-ban & spoofer protections (demo).' },
            { icon: PackageCheck, title: 'Support', desc: '24/7 mock support via Discord.' },
          ].map((feature, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-[var(--zpurple)]" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Announcement Bar (sticky)
const AnnouncementBar = () => (
  <div className="fixed top-0 left-0 right-0 z-[60] w-full bg-black/60 border-b border-white/10">
    <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3 text-sm">
      <span className="text-gray-300">Join us on Discord!</span>
      <a href="https://discord.easybro.net" target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1 rounded-md text-black" style={{background: 'linear-gradient(90deg, var(--zpurple), var(--zpink))'}}>
        Invite Link
      </a>
      <span className="hidden sm:inline text-gray-500">Verified Seller · Premium Support</span>
    </div>
  </div>
);

// Trust Badges / Metrics
const TrustBadges = () => (
  <section className="py-10">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {label: 'Active subscriptions', value: '5K+'},
        {label: 'Orders processed', value: '13K+'},
        {label: 'Customer Reviews', value: '4.9★'},
      ].map((item, idx) => (
        <div key={idx} className="card-glass rounded-lg p-6 text-center shadow-z">
          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)]">
            {item.value}
          </div>
          <div className="mt-1 text-gray-300">{item.label}</div>
        </div>
      ))}
    </div>
  </section>
);

// Verified Seller badges row
const SellerBadgesRow = () => (
  <section className="py-6">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {[
          'Verified Seller',
          'Secure Payments',
          '24/7 Support',
          'Instant Delivery',
        ].map((label, idx) => (
          <div key={idx} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 border border-white/10">
            <BadgeCheck className="w-4 h-4 text-[var(--zpurple)]" />
            <span className="text-sm text-gray-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Reviews marquee
const ReviewsSection = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <h3 className="text-xl font-semibold mb-4">Trusted by competitive players</h3>
      <div className="marquee">
        <div className="marquee-track">
          {[
            '+rep woofer working 🦅 — Wawa Cat',
            '+rep elite plus — really elite — D.Hal',
            '+rep ezbro — reached immo 2 — Inbound',
            'Support answered in 2 minutes — Hyper',
            'Latency down 30% — Vox',
            'Spoofer lifetime worth it — Kuno',
          ].map((text, i) => (
            <span key={i} className="px-4 py-2 rounded bg-black/40 border border-white/10 whitespace-nowrap">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// FAQ Section
const FAQSection = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
      <div className="space-y-3">
        {[
          {q: 'What hardware do you support?', a: 'Intel & AMD CPUs, all motherboards; TPM 2.0, Core Isolation, Secure Boot supported.'},
          {q: 'Do you accept card payments?', a: 'Use Discord support for card payments; crypto accepted on site.'},
          {q: 'Refunds?', a: 'Full refund within 7 days if product does not function as intended.'},
        ].map((f, i) => (
          <details key={i} className="rounded-lg bg-black/40 border border-white/5">
            <summary className="cursor-pointer px-4 py-3 font-medium">{f.q}</summary>
            <div className="px-4 pb-4 text-gray-300">{f.a}</div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

// Enhanced Store Section
const EnhancedStore = ({ onViewProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['all', 'Security', 'Performance', 'Complete Suite'];

  const filteredProducts = enhancedProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.tag.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.short.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <section className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Premium Gaming Software
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our collection of advanced gaming tools designed for competitive players
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "capitalize",
                    selectedCategory === category && "bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)]"
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[var(--zpurple)]"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[var(--zpurple)]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <EnhancedProductCard product={product} onQuickView={() => onViewProduct?.(product.id)} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Separate component that can use the cart context
const AppContent = ({ currentPage, setCurrentPage, cartOpen, setCartOpen, isLoggedIn, setIsLoggedIn, theme, toggleTheme }) => {
  const { items } = useEnhancedCart();
  const { setOrdersFromServer } = useClient();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Guarded navigation: centralizes page changes and enforces auth on dashboard
  const navigateGuarded = (page) => {
    if (page === 'dashboard' && !isLoggedIn) {
      toast.error('Please log in to access Dashboard');
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  };

  // Logout handler: clears token and resets auth/UI state
  const handleLogout = () => {
    try {
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
      toast.success('Logged out');
      setCurrentPage('home');
    } catch (e) {
      toast.error('Failed to logout, please retry');
    }
  };

  // Global guard effect: intercept any route to dashboard when logged out
  useEffect(() => {
    if (currentPage === 'dashboard' && !isLoggedIn) {
      toast.error('Login required');
      setCurrentPage('login');
    }
  }, [currentPage, isLoggedIn, setCurrentPage]);

  // Listen for order sync broadcast from AppEnhanced restore
  useEffect(() => {
    const handler = (e) => {
      const orders = e.detail || [];
      setOrdersFromServer(orders);
    };
    window.addEventListener('zaliant_orders_sync', handler);
    return () => window.removeEventListener('zaliant_orders_sync', handler);
  }, [setOrdersFromServer]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <EnhancedHero onPrimary={() => setCurrentPage('store')} />
            <TrustBadges />
            <SellerBadgesRow />
            <ReviewsSection />
            <FAQSection />
            <EnhancedStore onViewProduct={(id) => { setSelectedProductId(id); setCurrentPage('product'); }} />
          </>
        );
      case 'store':
        return <EnhancedStore onViewProduct={(id) => { setSelectedProductId(id); setCurrentPage('product'); }} />;
      case 'product':
        return <EnhancedProductPage productId={selectedProductId} onBack={() => setCurrentPage('store')} onBuy={() => setCurrentPage('cart')} />;
      case 'cart':
        return <EnhancedCartPage onCheckout={() => setCurrentPage('checkout')} onShop={() => setCurrentPage('store')} />;
      case 'checkout':
        return <EnhancedCheckoutPage onSuccess={() => setCurrentPage('dashboard')} />;
      case 'support':
        return <EnhancedSupport />;
      case 'dashboard':
        return isLoggedIn ? (
          <EnhancedDashboard />
        ) : (
          <AccessRequired onLogin={() => setCurrentPage('login')} onRegister={() => setCurrentPage('register')} />
        );
      case 'login':
        return <EnhancedLogin onRegister={() => setCurrentPage('register')} onSuccess={() => { setIsLoggedIn(true); setCurrentPage('dashboard'); }} />;
      case 'register':
        return <EnhancedRegister onLogin={() => setCurrentPage('login')} onSuccess={() => { setCurrentPage('login'); }} />;
      case 'giftcard':
        return <EnhancedGiftCard onBack={() => setCurrentPage('store')} />;
      default:
        return (
          <>
            <EnhancedHero />
            <EnhancedStore />
          </>
        );
    }
  };

  return (
    <div className={cn("min-h-screen relative z-10", theme === 'dark' ? "app-bg-dark text-white" : "app-bg-light text-gray-900")}> 
      <AnnouncementBar />
      {/* Particle background */}
      <FireParticles />
      <EnhancedHeader 
        cartItemCount={cartItemCount} 
        onCartClick={() => setCartOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        onNavigate={navigateGuarded}
        logoSrc={brandIcon}
        brandSubtitle={"services"}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      
      <main className="pt-24 md:pt-32">
        {renderPage()}
      </main>

      <AnimatePresence>
        {cartOpen && (
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} navigate={navigateGuarded} />
        )}
      </AnimatePresence>

      {/* Enhanced Footer */}
      <footer className={cn("border-t py-12", theme === 'dark' ? "bg-gray-900 border-gray-800" : "bg-gray-100 border-gray-200")}> 
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--zpurple)] to-[var(--zpink)] rounded-lg flex items-center justify-center">
                  <Sparkles className={cn("w-5 h-5", theme === 'dark' ? "text-white" : "text-gray-900")} />
                </div>
                <span className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-gray-900")}>Zaliant Services</span>
              </div>
              <p className={cn(theme === 'dark' ? "text-gray-400" : "text-gray-600")}>Next‑generation AI security, performance optimization, and premium services.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className={cn("space-y-2", theme === 'dark' ? "text-gray-400" : "text-gray-600")}> 
                <li><a href="#" className="hover:text-white transition-colors">HWID Spoofer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Performance Suite</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Complete Bundle</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className={cn("space-y-2", theme === 'dark' ? "text-gray-400" : "text-gray-600")}> 
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className={cn("space-y-2", theme === 'dark' ? "text-gray-400" : "text-gray-600")}> 
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className={cn("border-t mt-8 pt-8 text-center", theme === 'dark' ? "border-gray-800 text-gray-400" : "border-gray-200 text-gray-600")}> 
            <p>&copy; 2025 Zaliant Services. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

// Main Enhanced App Component
const AppEnhanced = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Restore login state from saved token and validate with backend
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(api('/api/auth/me'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setIsLoggedIn(true);
          // Sync orders for cross-device dashboard
          try {
            const or = await fetch(api('/api/orders'), { headers: { 'Authorization': `Bearer ${token}` } });
            if (or.ok) {
              const orders = await readBodySafe(or);
              // AppContent renders below; use ClientContext inside AppContent rather than here
              // We'll dispatch via a window event and handle it in AppContent
              window.dispatchEvent(new CustomEvent('zaliant_orders_sync', { detail: orders }));
            }
          } catch {}
        } else {
          localStorage.removeItem('auth_token');
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Auth restore failed', err);
      }
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EnhancedCartProvider>
        <AppContent 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </EnhancedCartProvider>
    </QueryClientProvider>
  );
};

export default AppEnhanced;
