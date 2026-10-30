import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, Check, ShieldCheck, Truck, Package } from 'lucide-react';
import { Product, StoreProfile } from '../types';
import { formatRupiah, createWhatsAppUrl } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  storeProfile: StoreProfile;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  storeProfile,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const maxStock = product.stock;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 700);
  };

  const handleDirectWhatsApp = () => {
    const directMessage = `Halo ${storeProfile.name}, saya tertarik untuk memesan barang ini langsung:\n\n` +
      `• *${product.name}*\n` +
      `• Jumlah: ${quantity} ${product.unit || 'pcs'}\n` +
      `• Harga Satuan: ${formatRupiah(product.price)}\n` +
      `• Total: *${formatRupiah(product.price * quantity)}*\n` +
      `• Kode SKU: ${product.sku}\n\n` +
      `Apakah barang ini masih ready dan bisa dikirim hari ini? Terima kasih!`;

    const url = createWhatsAppUrl(storeProfile.whatsapp, directMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Detail"
          className="absolute top-3.5 right-3.5 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/80 hover:bg-white rounded-full shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative bg-stone-100 aspect-square md:aspect-auto h-full min-h-[320px] flex items-center justify-center overflow-hidden">
            {!imageError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="p-6 text-center text-stone-400">
                <Package className="w-12 h-12 mx-auto mb-2 text-stone-400" />
                <span className="text-sm font-medium text-stone-600">{product.name}</span>
              </div>
            )}

            {/* Subtle floating tag */}
            <div className="absolute bottom-3 left-3 bg-stone-900/80 text-white text-xs px-2.5 py-1 rounded backdrop-blur-xs">
              SKU: <span className="font-mono">{product.sku}</span>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Stock Indicator */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium tracking-wide uppercase">
                  {product.category}
                </span>
                <span className={`font-medium ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {isOutOfStock ? 'Stok Habis' : `Tersedia: ${product.stock} ${product.unit || 'unit'}`}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug">
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
                {product.unit && (
                  <span className="text-xs text-stone-500">
                    / {product.unit}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="border-t border-stone-100 pt-3 text-stone-600 text-sm leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Highlights / Features */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-semibold text-stone-800">Spesifikasi & Keunggulan:</p>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Purchase Controls */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-700">Jumlah Pesanan:</span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                  <button
                    type="button"
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-stone-700 hover:bg-stone-200 disabled:opacity-40 transition-colors cursor-pointer text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs sm:text-sm font-semibold tabular-nums text-stone-900 min-w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= maxStock || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                    className="px-3 py-1 text-stone-700 hover:bg-stone-200 disabled:opacity-40 transition-colors cursor-pointer text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Berhasil Ditambah</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Tambah Keranjang</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleDirectWhatsApp}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pesan Cepat via WA</span>
                </button>
              </div>

              {/* Micro guarantee */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" /> Respon Cepat Toko
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-stone-400" /> Pengemasan Aman
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
