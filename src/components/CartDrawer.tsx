import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Send, Copy, Check, ArrowRight } from 'lucide-react';
import { CartItem, OrderForm, StoreProfile } from '../types';
import { formatRupiah, createWhatsAppOrderText, createWhatsAppUrl } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  storeProfile: StoreProfile;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  storeProfile,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [form, setForm] = useState<OrderForm>({
    customerName: '',
    phone: '',
    address: '',
    paymentMethod: 'Transfer Bank',
    notes: ''
  });

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const message = createWhatsAppOrderText(cart, form, storeProfile);
    const url = createWhatsAppUrl(storeProfile.whatsapp, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyOrderText = () => {
    if (cart.length === 0) return;
    const message = createWhatsAppOrderText(cart, form, storeProfile);
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h2 className="font-bold text-base text-stone-900">
              Keranjang Belanja ({totalQuantity})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Keranjang"
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Cart Items & Checkout Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-7 h-7 stroke-1" />
              </div>
              <p className="text-stone-800 font-medium text-sm">Keranjang Anda masih kosong</p>
              <p className="text-stone-500 text-xs max-w-xs mx-auto">
                Silakan pilih barang yang Anda sukai dari etalase untuk ditambahkan ke keranjang.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <span>Lihat Etalase Toko</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Itemized List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                  <span>Daftar Barang</span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Kosongkan
                  </button>
                </div>

                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-3 p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 items-center"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover bg-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-mono">
                        {product.sku}
                      </p>
                      <p className="text-xs font-bold text-stone-900 tabular-nums mt-0.5">
                        {formatRupiah(product.price * quantity)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center border border-stone-300 rounded-md bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-stone-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          disabled={quantity >= product.stock}
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer ml-1"
                        title="Hapus dari keranjang"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Details Form */}
              <form onSubmit={handleSendWhatsApp} className="pt-4 border-t border-stone-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Data Pemesan & Pengiriman
                </h3>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Pratama"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 08123456789"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Alamat Lengkap & Kota Tujuan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Alamat jalan, kelurahan, kecamatan, kota & kode pos..."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white cursor-pointer"
                  >
                    <option value="Transfer Bank">Transfer Bank (BCA / Mandiri / BRI)</option>
                    <option value="QRIS">QRIS (Semua E-Wallet & Mobile Banking)</option>
                    <option value="COD (Bayar di Tempat)">COD (Bayar di Tempat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Catatan untuk Penjual (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Packing kado, minta gilingan kasar, dsb."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                  />
                </div>
              </form>
            </>
          )}
        </div>

        {/* Drawer Footer: Subtotal and WhatsApp CTA */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600">Total Belanja (Belum ongkir)</span>
              <span className="text-lg font-extrabold text-stone-900 tabular-nums">
                {formatRupiah(subtotal)}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesanan via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyOrderText}
                className="w-full py-2 px-3 border border-stone-300 hover:bg-stone-200/50 text-stone-700 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Teks Pesanan Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>Salin Format Teks Pesanan</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-stone-500 text-center">
              Pemesanan akan langsung diteruskan ke WhatsApp resmi toko: <strong>+{storeProfile.whatsapp}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
