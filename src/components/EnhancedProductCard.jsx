import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { cn, formatPrice } from '../lib/utils';
import BrandBadge from './BrandBadge';
import { useEnhancedCart } from '../context/EnhancedCartContext';

const EnhancedProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useEnhancedCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCartClick = () => {
    addToCart(product);
    // Add toast notification here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-[var(--zpurple)]/20 to-[var(--zpink)]/20">
            <BrandBadge />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[var(--zpurple)]/20 to-[var(--zpink)]/20 rounded-full flex items-center justify-center">
                <PackageIcon className="w-12 h-12 text-[var(--zpurple)]" />
              </div>
            </div>
            
            {/* Product Tag */}
            {product.tag && (
              <div className="absolute top-2 left-2 z-10">
                <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white rounded-full">
                  {product.tag}
                </span>
              </div>
            )}

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <Button
                size="icon"
                variant="secondary"
                onClick={handleWishlistToggle}
                className={cn(
                  "rounded-full",
                  isWishlisted && "bg-red-500 text-white hover:bg-red-600"
                )}
              >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
              </Button>
              
              <Button
                size="icon"
                variant="secondary"
                onClick={() => onQuickView?.(product)}
                className="rounded-full"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-white group-hover:text-[var(--zpurple)] transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {product.short}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < 4 ? "text-yellow-400 fill-current" : "text-gray-600"
                  )}
                />
              ))}
              <span className="text-sm text-gray-400 ml-1">(4.8)</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)]">
            {formatPrice(product.price)}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => onQuickView?.(product)}
              variant="secondary"
              className="bg-gray-800 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>

            <Button
              onClick={handleAddToCartClick}
              className="bg-gradient-to-r from-[var(--zpurple)] to-[var(--zpink)] text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const PackageIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" />
    <path d="M7 16l4-4 4 4" />
    <path d="M7 8l4-4 4 4" />
  </svg>
);

export default EnhancedProductCard;
