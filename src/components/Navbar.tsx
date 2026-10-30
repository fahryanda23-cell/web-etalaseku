import React from 'react';
import { ShoppingBag, Settings, Store } from 'lucide-react';
import { StoreProfile } from '../types';

interface NavbarProps {
  storeProfile: StoreProfile;
  totalCartItems: number;
  isAdminLoggedIn: boolean;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  storeProfile,
  totalCartItems,
  isAdminLoggedIn,
  onOpenCart,
  onOpenAdmin,
  onNavigateSection
}) => {
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<any>(null);

  const handleBrandClick = () => {
    onNavigateSection('katalog');
    clickCountRef.current += 1;
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      onOpenAdmin();
    } else {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1200);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-stone-200">
      {/* Top micro announcement */}
      {storeProfile.announcement && (
        <div className="bg-stone-900 text-stone-100 text-xs py-1.5 px-4 text-center tracking-wide font-normal flex items-center justify-center gap-2">
          <span>{storeProfile.announcement}</span>
        </div>
      )}

      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark with secret owner trigger */}
        <button
          onClick={handleBrandClick}
          className="text-left font-bold text-xl tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-amber-800 transition-colors flex items-center gap-2.5 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-stone-900 text-amber-100 flex items-center justify-center font-serif text-lg font-bold">
            {storeProfile.name.charAt(0)}
          </span>
          <span>{storeProfile.name}</span>
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigateSection('katalog')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Katalog Produk
          </button>
          <button
            onClick={() => onNavigateSection('unggulan')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Pilihan Unggulan
          </button>
          <button
            onClick={() => onNavigateSection('cara-pesan')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cara Pemesanan
          </button>
          <button
            onClick={() => onNavigateSection('kontak')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Informasi Toko
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Only visible to verified admin */}
          {isAdminLoggedIn && (
            <button
              onClick={onOpenAdmin}
              title="Panel Kelola Toko"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Kelola Toko</span>
            </button>
          )}

          <button
            onClick={onOpenCart}
            aria-label="Keranjang Belanja"
            className="relative inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>Keranjang</span>
            <span className="tabular-nums bg-amber-400 text-stone-950 font-bold px-1.5 py-0.2 rounded text-[11px]">
              {totalCartItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
