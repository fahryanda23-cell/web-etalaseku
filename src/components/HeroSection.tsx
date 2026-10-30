import React from 'react';
import { Search, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { StoreProfile } from '../types';
import { STOREFRONT_HERO_IMAGE } from '../data/sampleProducts';

interface HeroSectionProps {
  storeProfile: StoreProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  storeProfile,
  searchQuery,
  onSearchChange,
  onExploreClick
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Store copy & quick search */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
                Katalog Resmi & Etalase Toko
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Koleksi Produk Pilihan untuk Kebutuhan Anda
              </h1>
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Jelajahi etalase barang berkualitas langsung dari toko kami. Cek ketersediaan stok secara real-time dan pesan langsung via WhatsApp dengan mudah.
              </p>
            </div>

            {/* Integrated Search Bar */}
            <div className="relative max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-stone-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari nama barang, jenis, atau kode SKU..."
                className="block w-full pl-10 pr-24 py-3 bg-white border border-stone-300 rounded-xl text-sm placeholder-stone-400 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 shadow-xs transition-colors"
              />
              <button
                type="button"
                onClick={onExploreClick}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cari
              </button>
            </div>

            {/* Trust Markers without pills or pulsing dots */}
            <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center gap-6 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span>100% Kualitas Terjamin</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Order Cepat via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-stone-700" />
                <span>Kirim Seluruh Indonesia</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Anchor */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-200 aspect-[16/10]">
              <img
                src={STOREFRONT_HERO_IMAGE}
                alt="Suasana Toko dan Etalase Barang"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white p-3 backdrop-blur-xs bg-stone-900/40 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-light text-stone-200">Kunjungan Toko Fisik</p>
                  <p className="text-sm font-semibold">{storeProfile.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-light text-stone-200">Jam Operasional</p>
                  <p className="text-xs font-medium">{storeProfile.workingHours}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
