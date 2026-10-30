import React, { useState, useRef } from 'react';
import { 
  X, Plus, Edit2, Trash2, RotateCcw, Store, PackagePlus, ListCheck, Check, 
  Lock, KeyRound, LogOut, ShieldAlert, Upload, Camera, Image as ImageIcon, 
  FileImage, RefreshCw 
} from 'lucide-react';
import { Product, StoreProfile } from '../types';
import { formatRupiah } from '../utils/formatters';
import { CATEGORIES } from '../data/sampleProducts';
import { compressImageFile } from '../utils/imageCompressor';

interface StoreManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  storeProfile: StoreProfile;
  isAdminLoggedIn: boolean;
  onAdminLogin: () => void;
  onAdminLogout: () => void;
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onUpdateStock: (productId: string, newStock: number) => Promise<void>;
  onSaveProfile: (profile: StoreProfile) => Promise<void>;
  onResetDefaults: () => Promise<void>;
}

export const StoreManagerModal: React.FC<StoreManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  storeProfile,
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout,
  onSaveProduct,
  onDeleteProduct,
  onUpdateStock,
  onSaveProfile,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'settings'>('list');
  const [profileForm, setProfileForm] = useState<StoreProfile>({ ...storeProfile });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // PIN login state
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Change PIN state in settings
  const [newPin, setNewPin] = useState(storeProfile.adminPin || '1234');

  // New/Edit product form state
  const [prodForm, setProdForm] = useState<{
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    stock: number;
    sku: string;
    unit: string;
    imageUrl: string;
    description: string;
    featuresString: string;
    isFeatured: boolean;
  }>({
    name: '',
    category: 'Kopi & Minuman',
    price: 50000,
    originalPrice: 0,
    stock: 10,
    sku: 'PROD-' + Math.floor(100 + Math.random() * 900),
    unit: 'pcs',
    imageUrl: '/src/assets/images/product_artisan_coffee_1793333118570.jpg',
    description: '',
    featuresString: '',
    isFeatured: false
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [photoSourceMode, setPhotoSourceMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressedDataUrl = await compressImageFile(file);
      setProdForm((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
      showNotification('Foto berhasil diunggah langsung dari perangkat!');
    } catch (err) {
      console.error('Gagal memproses foto:', err);
      alert('Gagal membaca file foto. Pastikan format gambar valid (JPG, PNG, WebP).');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  if (!isOpen) return null;

  const currentPin = storeProfile.adminPin || '1234';

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin.trim() === currentPin) {
      setPinError('');
      setInputPin('');
      onAdminLogin();
      showNotification('Berhasil masuk sebagai Pemilik Toko');
    } else {
      setPinError('PIN salah! Silakan coba lagi.');
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      stock: prod.stock,
      sku: prod.sku,
      unit: prod.unit || 'pcs',
      imageUrl: prod.imageUrl,
      description: prod.description,
      featuresString: prod.features ? prod.features.join('\n') : '',
      isFeatured: prod.isFeatured || false
    });
    setActiveTab('add');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;

    const features = prodForm.featuresString
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : 'prod-' + Date.now(),
      name: prodForm.name.trim(),
      category: prodForm.category,
      price: Number(prodForm.price),
      originalPrice: prodForm.originalPrice ? Number(prodForm.originalPrice) : undefined,
      stock: Number(prodForm.stock),
      sku: prodForm.sku.trim() || 'SKU-' + Date.now().toString().slice(-4),
      unit: prodForm.unit || 'pcs',
      imageUrl: prodForm.imageUrl || '/src/assets/images/product_artisan_coffee_1793333118570.jpg',
      description: prodForm.description,
      features,
      isFeatured: prodForm.isFeatured
    };

    setIsDbLoading(true);
    onSaveProduct(productPayload)
      .then(() => {
        showNotification(
          editingProduct
            ? 'Produk berhasil diperbarui di database cloud!'
            : 'Produk baru berhasil disimpan ke database cloud!'
        );
        setEditingProduct(null);
        setActiveTab('list');
        setProdForm({
          name: '',
          category: 'Kopi & Minuman',
          price: 50000,
          originalPrice: 0,
          stock: 10,
          sku: 'PROD-' + Math.floor(100 + Math.random() * 900),
          unit: 'pcs',
          imageUrl: '/src/assets/images/product_artisan_coffee_1793333118570.jpg',
          description: '',
          featuresString: '',
          isFeatured: false
        });
      })
      .catch((err) => {
        console.error('Gagal menyimpan produk:', err);
        alert('Gagal menyimpan produk ke database. Silakan coba lagi.');
      })
      .finally(() => {
        setIsDbLoading(false);
      });
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus "${name}" dari database etalase?`)) {
      setIsDbLoading(true);
      onDeleteProduct(id)
        .then(() => {
          showNotification('Produk telah dihapus dari database.');
        })
        .catch((err) => {
          console.error('Gagal menghapus produk:', err);
          alert('Gagal menghapus produk dari database.');
        })
        .finally(() => {
          setIsDbLoading(false);
        });
    }
  };

  const handleUpdateStockQuick = (id: string, delta: number) => {
    const current = products.find((p) => p.id === id);
    if (!current) return;
    const newStock = Math.max(0, current.stock + delta);
    onUpdateStock(id, newStock).catch((err) => {
      console.error('Gagal mengubah stok:', err);
    });
  };

  const handleSaveStoreProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoreProfile = {
      ...profileForm,
      adminPin: newPin.trim() || '1234'
    };
    setIsDbLoading(true);
    onSaveProfile(updated)
      .then(() => {
        showNotification('Informasi toko & PIN berhasil disimpan ke database cloud!');
      })
      .catch((err) => {
        console.error('Gagal menyimpan profil:', err);
        alert('Gagal menyimpan ke database.');
      })
      .finally(() => {
        setIsDbLoading(false);
      });
  };

  // Image Presets for fast selection
  const imagePresets = [
    { label: 'Kopi Specialty', path: '/src/assets/images/product_artisan_coffee_1793333118570.jpg' },
    { label: 'Cangkir Keramik', path: '/src/assets/images/product_ceramic_mug_1793333119096.jpg' },
    { label: 'Kemeja Linen', path: '/src/assets/images/product_linen_shirt_1793333120477.jpg' },
    { label: 'Lampu Meja', path: '/src/assets/images/product_desk_lamp_1793333120605.jpg' },
    { label: 'Tumbler Stainless', path: '/src/assets/images/product_tumbler_1793333191055.jpg' },
    { label: 'Lilin Kedelai', path: '/src/assets/images/product_candle_1793333191180.jpg' },
    { label: 'Dompet Kulit', path: '/src/assets/images/product_wallet_1793333191943.jpg' },
    { label: 'Teh Artisan', path: '/src/assets/images/product_tea_1793333193247.jpg' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="font-bold text-lg text-stone-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-800" />
              <span>Kelola Etalase Toko</span>
              {isAdminLoggedIn ? (
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  Akses Terverifikasi
                </span>
              ) : (
                <span className="text-[11px] bg-stone-200 text-stone-700 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Terkunci PIN
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-500">
              {isAdminLoggedIn
                ? 'Atur produk, stok, profil toko, dan nomor WhatsApp resmi'
                : 'Akses khusus pemilik toko untuk mengedit katalog etalase'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  onAdminLogout();
                  showNotification('Akses admin dikunci kembali.');
                }}
                title="Kunci Akses / Logout"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kunci Akses</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Notification */}
        {notification && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* IF NOT LOGGED IN: SHOW PIN VERIFICATION SCREEN */}
        {!isAdminLoggedIn ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shadow-xs">
              <KeyRound className="w-8 h-8 stroke-1.5" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-stone-900">
                Akses Terbatas Pemilik Toko
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Halaman ini dilindungi PIN keamanan sehingga pengunjung atau pembeli biasa tidak dapat mengubah data, harga, maupun stok etalase.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="w-full space-y-4">
              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold text-stone-700">
                  Masukkan PIN Pemilik Toko:
                </label>
                <input
                  type="password"
                  maxLength={8}
                  autoFocus
                  required
                  placeholder="Ketik 4-digit PIN..."
                  value={inputPin}
                  onChange={(e) => {
                    setInputPin(e.target.value);
                    setPinError('');
                  }}
                  className="w-full px-4 py-2.5 text-center tracking-widest text-lg font-mono border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                />
                {pinError && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Buka Panel Kelola Toko
              </button>
            </form>

            <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-600 border border-stone-200 text-left w-full">
              <p className="font-semibold text-stone-800 mb-0.5">ℹ️ Catatan untuk Anda (Pemilik Toko):</p>
              <p>
                PIN bawaan awal adalah <strong className="font-mono text-stone-900">1234</strong>. Anda dapat mengganti PIN ini kapan saja di tab <em>Pengaturan Toko</em> setelah masuk.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex border-b border-stone-200 bg-stone-100/70 px-4 sm:px-6 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('list');
                  setEditingProduct(null);
                }}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'list'
                    ? 'border-stone-900 text-stone-900 bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <ListCheck className="w-4 h-4" />
                <span>Daftar Barang ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('add')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'add'
                    ? 'border-stone-900 text-stone-900 bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <PackagePlus className="w-4 h-4" />
                <span>{editingProduct ? 'Edit Barang' : '+ Tambah Barang Baru'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-stone-900 text-stone-900 bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Pengaturan Toko & Keamanan</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* TAB 1: PRODUCT LIST */}
              {activeTab === 'list' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">
                      Ubah stok barang secara cepat atau edit informasi detail produk
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setActiveTab('add');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Produk</span>
                    </button>
                  </div>

                  <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200">
                    {products.map((prod) => (
                      <div key={prod.id} className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white hover:bg-stone-50/60 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-stone-900 truncate">{prod.name}</h4>
                              {prod.isFeatured && (
                                <span className="text-[10px] bg-stone-900 text-amber-200 font-medium px-1.5 py-0.2 rounded">
                                  Unggulan
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-stone-500">
                              <span>{prod.category}</span>
                              <span>·</span>
                              <span className="font-mono text-[11px]">{prod.sku}</span>
                              <span>·</span>
                              <span className="font-semibold text-stone-800 tabular-nums">
                                {formatRupiah(prod.price)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stock management & Actions */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-stone-500">Stok:</span>
                            <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                              <button
                                type="button"
                                onClick={() => handleUpdateStockQuick(prod.id, -1)}
                                className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-200 rounded-l cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2.5 text-xs font-semibold tabular-nums text-stone-900">
                                {prod.stock}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateStockQuick(prod.id, 1)}
                                className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-200 rounded-r cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(prod)}
                              title="Edit Produk"
                              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              title="Hapus Produk"
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: ADD / EDIT PRODUCT */}
              {activeTab === 'add' && (
                <form onSubmit={handleSaveProduct} className="space-y-4 max-w-2xl">
                  <h3 className="text-sm font-bold text-stone-900">
                    {editingProduct ? `Edit Barang: ${editingProduct.name}` : 'Tambah Barang Baru ke Etalase'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Nama Barang <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kopi Arabika Lintong 250g"
                        value={prodForm.name}
                        onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Kategori Barang
                      </label>
                      <select
                        value={prodForm.category}
                        onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                      >
                        {CATEGORIES.filter((c) => c !== 'Semua Produk').map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Kode SKU / Barang
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: KOP-LNT-250"
                        value={prodForm.sku}
                        onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Harga Jual (Rp) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        required
                        value={prodForm.price}
                        onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Harga Coret / Asli (Opsional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="0 jika tidak ada promo"
                        value={prodForm.originalPrice || ''}
                        onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Jumlah Stok
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={prodForm.stock}
                        onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Satuan Barang
                      </label>
                      <input
                        type="text"
                        placeholder="pcs, unit, jar, bungkus"
                        value={prodForm.unit}
                        onChange={(e) => setProdForm({ ...prodForm, unit: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                  </div>

                  {/* Direct Photo Upload & Selection Module */}
                  <div className="space-y-3 pt-2 border-t border-stone-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-stone-800">
                        Foto Produk untuk Etalase <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-stone-500">
                        Bisa langsung upload dari galeri atau kamera HP
                      </span>
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Current Photo Preview & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-stone-300 bg-white shrink-0 shadow-xs">
                        {prodForm.imageUrl ? (
                          <img
                            src={prodForm.imageUrl}
                            alt="Preview Barang"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-white">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploading ? 'Memproses Foto...' : 'Pilih Foto dari HP / Komputer'}</span>
                          </button>

                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => {
                              if (fileInputRef.current) {
                                fileInputRef.current.setAttribute('capture', 'environment');
                                fileInputRef.current.click();
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5 text-stone-600" />
                            <span className="hidden sm:inline">Buka Kamera HP</span>
                            <span className="sm:hidden">Kamera</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Format: JPG, PNG, atau WebP. Gambar akan otomatis dioptimalkan agar ringan dan cepat terbuka di web.
                        </p>
                      </div>
                    </div>

                    {/* Secondary Options: Presets or Custom URL */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setPhotoSourceMode('preset')}
                          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                            photoSourceMode === 'preset'
                              ? 'bg-stone-200 text-stone-900 font-semibold'
                              : 'text-stone-500 hover:text-stone-800'
                          }`}
                        >
                          Pilihan dari Galeri Bawaan
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => setPhotoSourceMode('url')}
                          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                            photoSourceMode === 'url'
                              ? 'bg-stone-200 text-stone-900 font-semibold'
                              : 'text-stone-500 hover:text-stone-800'
                          }`}
                        >
                          Tempel Link URL Web
                        </button>
                      </div>

                      {photoSourceMode === 'preset' && (
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2 bg-stone-50 border border-stone-200 rounded-xl">
                          {imagePresets.map((img) => (
                            <button
                              key={img.path}
                              type="button"
                              onClick={() => setProdForm({ ...prodForm, imageUrl: img.path })}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                prodForm.imageUrl === img.path
                                  ? 'border-amber-600 scale-105 shadow-sm'
                                  : 'border-stone-200 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={img.path} alt={img.label} className="w-full h-full object-cover" />
                              {prodForm.imageUrl === img.path && (
                                <div className="absolute inset-0 bg-amber-900/30 flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {photoSourceMode === 'url' && (
                        <input
                          type="text"
                          placeholder="Tempel link URL gambar internet (https://...)"
                          value={prodForm.imageUrl}
                          onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Deskripsi Lengkap Barang
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Jelaskan detail barang, material, ukuran, atau rasa..."
                      value={prodForm.description}
                      onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Poin Keunggulan / Fitur (Satu baris per poin)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh:&#10;Bahan 100% Organik&#10;Tahan Suhu Panas & Dingin"
                      value={prodForm.featuresString}
                      onChange={(e) => setProdForm({ ...prodForm, featuresString: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={prodForm.isFeatured}
                      onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })}
                      className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                    />
                    <label htmlFor="isFeatured" className="text-xs font-medium text-stone-800 cursor-pointer">
                      Tandai sebagai Koleksi Unggulan (tampil di urutan teratas)
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={isDbLoading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-all"
                    >
                      {isDbLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>
                        {isDbLoading
                          ? 'Menyimpan ke Cloud...'
                          : editingProduct
                          ? 'Simpan Perubahan'
                          : 'Terbitkan ke Etalase'}
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={isDbLoading}
                      onClick={() => {
                        setEditingProduct(null);
                        setActiveTab('list');
                      }}
                      className="px-4 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: STORE PROFILE & PIN SECURITY */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <form onSubmit={handleSaveStoreProfile} className="space-y-4">
                    <h3 className="text-sm font-bold text-stone-900">
                      Pengaturan Identitas & Keamanan Toko
                    </h3>

                    {/* PIN Security Field */}
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                      <label className="block text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>PIN Keamanan Admin Toko (Untuk Mengunci Panel Ini)</span>
                      </label>
                      <input
                        type="text"
                        maxLength={8}
                        required
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="Contoh: 1234 atau 8899"
                        className="w-48 px-3 py-1.5 text-sm font-mono tracking-wider border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-900"
                      />
                      <p className="text-[11px] text-amber-800">
                        Hanya Anda yang mengetahui PIN ini agar pembeli atau orang lain tidak dapat merubah data toko.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Nama Toko
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Tagline / Slogan Toko
                      </label>
                      <input
                        type="text"
                        value={profileForm.tagline}
                        onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Nomor WhatsApp Penerima Pesanan (Format: 628xxx atau 08xxx) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 6281234567890"
                        value={profileForm.whatsapp}
                        onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">
                        Pesanan pembeli dari tombol WhatsApp akan langsung dikirim ke nomor ini.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Lokasi / Alamat Toko
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Jam Operasional Toko
                      </label>
                      <input
                        type="text"
                        value={profileForm.workingHours}
                        onChange={(e) => setProfileForm({ ...profileForm, workingHours: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Pengumuman Banner Atas (Promo / Info Pengiriman)
                      </label>
                      <input
                        type="text"
                        value={profileForm.announcement || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, announcement: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
                      >
                        Simpan Informasi Toko & PIN
                      </button>
                    </div>
                  </form>

                  {/* Data Reset Box */}
                  <div className="pt-6 border-t border-stone-200">
                    <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-amber-950">Kembalikan ke Contoh Data Bawaan</h4>
                        <p className="text-xs text-amber-800">
                          Reset seluruh daftar barang & profil toko ke data contoh semula.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin mereset seluruh data etalase ke pengaturan awal?')) {
                            onResetDefaults();
                            showNotification('Data etalase berhasil direset ke bawaan.');
                            onClose();
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-medium cursor-pointer shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Data Toko</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
