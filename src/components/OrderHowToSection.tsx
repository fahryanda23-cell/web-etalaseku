import React from 'react';
import { Search, ShoppingBag, MessageSquareText } from 'lucide-react';

export const OrderHowToSection: React.FC = () => {
  return (
    <section id="cara-pesan" className="py-14 sm:py-16 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            Panduan Berbelanja
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Cara Mudah Berbelanja di Etalase Toko Kami
          </h2>
          <p className="text-stone-500 text-sm">
            Proses pemesanan cepat dan transparan, langsung terhubung dengan admin toko kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-start space-y-3 p-6 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center justify-between w-full">
              <span className="font-serif text-2xl font-bold text-stone-300">01</span>
              <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Pilih Barang di Etalase
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Cari dan filter produk sesuai kebutuhan Anda. Lihat spesifikasi, ketersediaan stok, dan klik tombol detail untuk melihat informasi lengkap.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-start space-y-3 p-6 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center justify-between w-full">
              <span className="font-serif text-2xl font-bold text-stone-300">02</span>
              <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Cek Keranjang & Isi Data
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Masukkan jumlah barang ke keranjang belanja Anda. Masukkan nama lengkap, alamat tujuan pengiriman, dan pilihan metode pembayaran yang diinginkan.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-start space-y-3 p-6 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center justify-between w-full">
              <span className="font-serif text-2xl font-bold text-stone-300">03</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <MessageSquareText className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Kirim via WhatsApp Resmi
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Tekan tombol WhatsApp untuk mengirim rangkuman pesanan otomatis. Admin kami akan langsung merespon untuk konfirmasi total ongkir dan nomor resi pengiriman.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
