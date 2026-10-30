/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { StoreManagerModal } from './components/StoreManagerModal';
import { OrderHowToSection } from './components/OrderHowToSection';
import { Footer } from './components/Footer';
import { Product, CartItem, StoreProfile } from './types';
import { INITIAL_PRODUCTS, DEFAULT_STORE_PROFILE, CATEGORIES } from './data/sampleProducts';
import { Sparkles, ShoppingBag, PackageX, CloudCheck } from 'lucide-react';
import { testFirestoreConnection } from './firebase';
import {
  subscribeToProducts,
  subscribeToStoreProfile,
  saveProductToFirestore,
  deleteProductFromFirestore,
  updateProductStockInFirestore,
  saveStoreProfileToFirestore,
  resetFirestoreToDefaults
} from './services/storeService';

const STORAGE_KEY_PRODUCTS = 'etalase_products_v1';
const STORAGE_KEY_STORE = 'etalase_store_v1';
const STORAGE_KEY_CART = 'etalase_cart_v1';

export default function App() {
  // Store Profile State with localStorage
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STORE);
      return saved ? JSON.parse(saved) : DEFAULT_STORE_PROFILE;
    } catch {
      return DEFAULT_STORE_PROFILE;
    }
  });

  // Products State with localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart State with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Produk');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStoreManagerOpen, setIsStoreManagerOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [quickToast, setQuickToast] = useState<string | null>(null);

  const catalogRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time Cloud Firestore database updates & test connection
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribeProducts = subscribeToProducts((cloudProducts) => {
      setProducts(cloudProducts);
    });

    const unsubscribeProfile = subscribeToStoreProfile((cloudProfile) => {
      setStoreProfile(cloudProfile);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeProfile();
    };
  }, []);

  // Sync cart to localStorage (cart is local per buyer)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Check URL query ?admin=true or hash #admin & register Alt+A shortcut
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || window.location.hash === '#admin') {
      setIsStoreManagerOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (or Option + A on Mac)
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsStoreManagerOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast trigger
  const showToast = (message: string) => {
    setQuickToast(message);
    setTimeout(() => setQuickToast(null), 2500);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevCart, { product, quantity: Math.min(product.stock, quantity) }];
    });
    showToast(`"${product.name}" ditambahkan ke keranjang`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const max = item.product.stock;
          return { ...item, quantity: Math.min(max, quantity) };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Reset defaults
  const handleResetDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setStoreProfile(DEFAULT_STORE_PROFILE);
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_STORE);
  };

  // Navigation smoothly
  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'katalog') {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'unggulan') {
      featuredRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter & Sort calculation
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'Semua Produk' && item.category !== selectedCategory) {
          return false;
        }
        // In-stock filter
        if (onlyInStock && item.stock <= 0) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(q);
          const matchSku = item.sku.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          return matchName || matchSku || matchCat || matchDesc;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        }
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name, 'id');
        return 0;
      });
  }, [products, selectedCategory, onlyInStock, searchQuery, sortBy]);

  // Featured Products slice
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured);
  }, [products]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-stone-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        storeProfile={storeProfile}
        totalCartItems={totalCartCount}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsStoreManagerOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Hero Showcase Section */}
      <HeroSection
        storeProfile={storeProfile}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExploreClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
        
        {/* SECTION 1: Featured Showcase (Koleksi Pilihan) */}
        {featuredProducts.length > 0 && !searchQuery && (
          <section ref={featuredRef} className="space-y-6">
            <div className="flex items-end justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Koleksi Paling Diminati</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                  Pilihan Unggulan Toko
                </h2>
              </div>
              <span className="text-xs text-stone-500 hidden sm:inline">
                Produk rekomendasi dengan mutu terbaik
              </span>
            </div>

            {/* Grid of Featured Items (3 Columns desktop per retail guidelines) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: Full Catalog Showcase (Etalase Lengkap) */}
        <section ref={catalogRef} id="katalog" className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
              Katalog Lengkap
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Etalase Semua Produk
              </h2>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-stone-600 hover:text-stone-900 underline cursor-pointer self-start sm:self-auto"
                >
                  Hapus filter pencarian: &ldquo;{searchQuery}&rdquo;
                </button>
              )}
            </div>
          </div>

          {/* Category Filter and Controls */}
          <CategoryFilter
            categories={CATEGORIES}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onlyInStock={onlyInStock}
            onToggleInStock={() => setOnlyInStock((v) => !v)}
            productCount={filteredProducts.length}
            totalCount={products.length}
          />

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 bg-stone-100/60 rounded-2xl border border-stone-200">
              <div className="w-14 h-14 mx-auto rounded-full bg-stone-200 flex items-center justify-center text-stone-400">
                <PackageX className="w-7 h-7 stroke-1" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Tidak ada barang yang sesuai
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau ubah filter kategori yang dipilih.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua Produk');
                  setOnlyInStock(false);
                }}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Tampilkan Semua Barang
              </button>
            </div>
          )}
        </section>

      </main>

      {/* Guide Section */}
      <OrderHowToSection />

      {/* Footer */}
      <Footer
        storeProfile={storeProfile}
        onOpenAdmin={() => setIsStoreManagerOpen(true)}
      />

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProduct}
        storeProfile={storeProfile}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        storeProfile={storeProfile}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Store Admin & Inventory Manager Modal */}
      <StoreManagerModal
        isOpen={isStoreManagerOpen}
        onClose={() => setIsStoreManagerOpen(false)}
        products={products}
        storeProfile={storeProfile}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogin={() => setIsAdminLoggedIn(true)}
        onAdminLogout={() => setIsAdminLoggedIn(false)}
        onSaveProduct={saveProductToFirestore}
        onDeleteProduct={deleteProductFromFirestore}
        onUpdateStock={updateProductStockInFirestore}
        onSaveProfile={saveStoreProfileToFirestore}
        onResetDefaults={resetFirestoreToDefaults}
      />

      {/* Floating Admin Control Pill (Only visible when admin is authenticated) */}
      {isAdminLoggedIn && (
        <aside className="fixed bottom-4 left-4 z-40 bg-stone-900/95 text-stone-100 text-xs px-3.5 py-2 rounded-xl shadow-xl border border-stone-700 flex items-center gap-3 backdrop-blur-xs">
          <span className="font-semibold text-amber-300">
            Mode Pemilik Toko
          </span>
          <button
            type="button"
            onClick={() => setIsStoreManagerOpen(true)}
            className="text-white hover:text-amber-200 underline cursor-pointer"
          >
            Buka Panel
          </button>
          <span className="text-stone-600">|</span>
          <button
            type="button"
            onClick={() => {
              setIsAdminLoggedIn(false);
              setIsStoreManagerOpen(false);
            }}
            className="text-stone-400 hover:text-rose-300 cursor-pointer"
          >
            Kunci & Keluar
          </button>
        </aside>
      )}

      {/* Floating Quick Toast Notification */}
      {quickToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-full shadow-lg border border-stone-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
          <span>{quickToast}</span>
        </div>
      )}
    </div>
  );
}
