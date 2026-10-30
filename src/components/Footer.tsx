import React from 'react';
import { Store, MessageCircle, MapPin, Clock, CreditCard } from 'lucide-react';
import { StoreProfile } from '../types';

interface FooterProps {
  storeProfile: StoreProfile;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ storeProfile, onOpenAdmin }) => {
  const footerClickRef = React.useRef(0);
  const footerTimerRef = React.useRef<any>(null);

  const handleFooterSecretClick = () => {
    footerClickRef.current += 1;
    if (footerClickRef.current >= 3) {
      footerClickRef.current = 0;
      if (footerTimerRef.current) clearTimeout(footerTimerRef.current);
      onOpenAdmin();
    } else {
      if (footerTimerRef.current) clearTimeout(footerTimerRef.current);
      footerTimerRef.current = setTimeout(() => {
        footerClickRef.current = 0;
      }, 1200);
    }
  };
  return (
    <footer id="kontak" className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-200 text-stone-950 flex items-center justify-center font-serif text-lg font-bold">
                {storeProfile.name.charAt(0)}
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                {storeProfile.name}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {storeProfile.tagline}
            </p>
            <p className="text-xs text-stone-400">
              Menyediakan berbagai produk berkualitas dengan pelayanan ramah dan pengiriman terpercaya.
            </p>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
              Layanan Toko
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>{storeProfile.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>{storeProfile.workingHours}</span>
              </div>
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>WA: +{storeProfile.whatsapp}</span>
              </div>
            </div>
          </div>

          {/* Payment & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
              Metode Pembayaran
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Menerima pembayaran melalui Transfer Antar Bank (BCA, Mandiri, BRI), QRIS, serta sistem COD untuk wilayah tertentu.
            </p>
            {storeProfile.bankInfo && (
              <div className="p-2.5 rounded-lg bg-stone-800/80 border border-stone-700/60 text-xs font-mono text-amber-100">
                {storeProfile.bankInfo}
              </div>
            )}
          </div>

          {/* Customer Service & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
              Layanan & Bantuan
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Butuh konsultasi produk, pesanan dalam jumlah besar (*custom bulk order*), atau kustomisasi? Hubungi admin via WhatsApp.
            </p>
            <div className="pt-1 text-xs text-stone-400 flex flex-col gap-1">
              <span>• Respon pesan dalam hitungan menit</span>
              <span>• Garansi tukar barang bila cacat kirim</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            <span 
              onClick={handleFooterSecretClick} 
              className="cursor-default select-none hover:text-stone-400 transition-colors"
              title=""
            >
              ©
            </span>{' '}
            {new Date().getFullYear()} {storeProfile.name}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <span>Etalase Produk Resmi</span>
            <span>·</span>
            <span>Pemesanan Langsung WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
