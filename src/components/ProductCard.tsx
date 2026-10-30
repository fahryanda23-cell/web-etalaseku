import React, { useState } from 'react';
import { ShoppingBag, Eye, Check, Package } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart
}) => {
  const [imageError, setImageError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    onAddToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 900);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? 'opacity-60 grayscale' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-stone-400 bg-stone-100">
            <Package className="w-10 h-10 mb-2 stroke-1 text-stone-400" />
            <span className="text-xs font-medium text-stone-500">{product.name}</span>
          </div>
        )}

        {/* Quiet status badges (At most 1 subtle tag, no pill clusters) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.isFeatured && (
            <span className="bg-stone-900/90 text-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
              Pilihan
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-amber-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
              Hemat {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Stock tag */}
        <div className="absolute bottom-2.5 left-2.5">
          {isOutOfStock ? (
            <span className="bg-stone-900/80 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
              Habis
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-800/80 text-amber-100 text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
              Sisa {product.stock}
            </span>
          ) : null}
        </div>

        {/* Quick View overlay button */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            title="Lihat Detail Produk"
            className="p-2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 rounded-full shadow-sm backdrop-blur-xs transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata: quiet unboxed text with separator */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <span className="font-medium text-stone-600">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px]">{product.sku}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          {/* Brief specs / description teaser */}
          <p className="mt-1 text-xs text-stone-500 line-clamp-1">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">
                {formatRupiah(product.price)}
              </span>
              {product.unit && (
                <span className="text-[11px] text-stone-500 font-normal">
                  /{product.unit}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-95'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>+ Beli</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
