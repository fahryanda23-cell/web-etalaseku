import { Product, StoreProfile } from '../types';

export const DEFAULT_STORE_PROFILE: StoreProfile = {
  name: 'Toko Selaras',
  tagline: 'Etalase & Katalog Produk Pilihan Nusantara',
  whatsapp: '6281234567890',
  location: 'Bandung & Jakarta, Indonesia',
  workingHours: 'Senin - Sabtu: 09.00 - 18.00 WIB',
  announcement: 'Bisa pesan langsung via WhatsApp · Gratis ongkir untuk pembelian di atas Rp 300.000',
  bankInfo: 'BCA: 873-091-2341 a.n Toko Selaras',
  adminPin: '1234'
};

export const STOREFRONT_HERO_IMAGE = '/src/assets/images/hero_retail_storefront_1793333118054.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Kopi Arabika Spesialti Gayo 250g',
    category: 'Kopi & Minuman',
    price: 95000,
    originalPrice: 110000,
    stock: 24,
    sku: 'KOP-GYO-250',
    imageUrl: '/src/assets/images/product_artisan_coffee_1793333118570.jpg',
    description: 'Biji kopi arabika pilihan dari dataran tinggi Aceh Gayo. Dipanggang profil medium roast dengan citarasa blueberry manis, aroma melati, dan aftertaste madu yang bersih. Cocok untuk manual brew Maupun V60.',
    features: ['100% Arabika Grade 1', 'Roasted Fresh Tiap Pekan', 'Tersedia Whole Beans / Gilingan'],
    isFeatured: true,
    unit: 'pouch 250g'
  },
  {
    id: 'prod-2',
    name: 'Cangkir Keramik Handmade Speckled 220ml',
    category: 'Keramik & Dapur',
    price: 135000,
    originalPrice: 150000,
    stock: 12,
    sku: 'CRM-SPK-220',
    imageUrl: '/src/assets/images/product_ceramic_mug_1793333119096.jpg',
    description: 'Cangkir keramik buatan tangan perajin lokal dengan glasir matte bertekstur bintik alami (speckled). Nyaman digenggam, tahan panas microwave dan aman untuk mesin cuci piring (food-grade).',
    features: ['Kapasitas 220 ml', 'Bahan Stoneware Lokal', 'Glasir Alami Food-Safe Bebas Timbal'],
    isFeatured: true,
    unit: 'pcs'
  },
  {
    id: 'prod-3',
    name: 'Kemeja Linen Santai Lengan Panjang - Sage Olive',
    category: 'Pakaian & Gaya Hidup',
    price: 285000,
    originalPrice: 320000,
    stock: 18,
    sku: 'FSH-LNN-OLV',
    imageUrl: '/src/assets/images/product_linen_shirt_1793333120477.jpg',
    description: 'Kemeja potongan santai relaxed-fit dari 100% serat linen alami yang adem dan breathable di iklim tropis. Jahitan presisi ganda dengan kancing batok kelapa alami yang ramah lingkungan.',
    features: ['100% Pure Organic Linen', 'Breathable & Cepat Kering', 'Kancing Natural Coconut Shell'],
    isFeatured: true,
    unit: 'pcs'
  },
  {
    id: 'prod-4',
    name: 'Lampu Meja Arsitektural Minimalis Matte Black',
    category: 'Dekorasi & Rumah',
    price: 380000,
    stock: 7,
    sku: 'LGT-MAT-BLK',
    imageUrl: '/src/assets/images/product_desk_lamp_1793333120605.jpg',
    description: 'Lampu meja industrial modern dengan engsel ganda yang fleksibel. Dibalut finishing matte black tahan gores dengan pencahayaan hangat hemat energi yang nyaman untuk membaca dan bekerja.',
    features: ['Sudut Pencahayaan Fleksibel 360°', 'Bahan Besi Solid Tahan Karat', 'Termasuk Bohlam LED Warm 3000K'],
    isFeatured: true,
    unit: 'unit'
  },
  {
    id: 'prod-5',
    name: 'Tumbler Termos Stainless Minimalis 500ml',
    category: 'Aksesoris & Gadget',
    price: 165000,
    originalPrice: 195000,
    stock: 35,
    sku: 'ACC-TMB-500',
    imageUrl: '/src/assets/images/product_tumbler_1793333191055.jpg',
    description: 'Botol minum insulasi vakum ganda berdinding ganda. Menjaga minuman tetap dingin hingga 24 jam atau panas hingga 12 jam tanpa kondensasi luar. Dilengkapi tutup ergonomis anti bocor.',
    features: ['Stainless Steel 304 Food Grade', 'Insulasi Dinding Ganda Vakum', 'Kapasitas 500ml Ergonomis'],
    isFeatured: false,
    unit: 'pcs'
  },
  {
    id: 'prod-6',
    name: 'Lilin Aromaterapi Kedelai Natural - Cendana & Nilam',
    category: 'Dekorasi & Rumah',
    price: 115000,
    stock: 19,
    sku: 'LIL-CDN-180',
    imageUrl: '/src/assets/images/product_candle_1793333191180.jpg',
    description: 'Lilin aromaterapi dari 100% soy wax alami dengan essential oil kayu cendana dan daun nilam murni. Menenangkan pikiran, mengurangi stres, dan mengharumkan ruangan hingga 40 jam pembakaran.',
    features: ['100% Soy Wax Alami Non-Toxic', 'Sumbu Kayu Crackling Natural', 'Waktu Bakar ~40 Jam'],
    isFeatured: false,
    unit: 'jar 180g'
  },
  {
    id: 'prod-7',
    name: 'Dompet Kartu Kulit Asli Pull-Up - Tan Cokelat',
    category: 'Aksesoris & Gadget',
    price: 175000,
    originalPrice: 210000,
    stock: 14,
    sku: 'WLT-KLT-TAN',
    imageUrl: '/src/assets/images/product_wallet_1793333191943.jpg',
    description: 'Cardholder ramping dari kulit sapi asli jenis pull-up leather lokal Jawa Timur yang akan menghasilkan patina semakin indah seiring pemakaian. Muat hingga 8 kartu dan uang tunai.',
    features: ['100% Kulit Sapi Asli Pull-Up', 'Handstitched dengan Benang Waxed', 'Profil Ramping Masuk Saku Depan'],
    isFeatured: false,
    unit: 'pcs'
  },
  {
    id: 'prod-8',
    name: 'Teh Putih Artisan Silver Needle Jawa Barat 45g',
    category: 'Kopi & Minuman',
    price: 120000,
    stock: 9,
    sku: 'TEH-SLV-045',
    imageUrl: '/src/assets/images/product_tea_1793333193247.jpg',
    description: 'Pucuk teh putih pilihan dari perkebunan pegunungan Pangalengan, Jawa Barat. Kaya antioksidan dengan rasa lembut, wangi bebungaan alami tanpa pahit atau astringensi.',
    features: ['Pucuk Jarum Perak Pilihan', 'Bebas Pestisida Sintetis', 'Rendah Kafein & Segar'],
    isFeatured: false,
    unit: 'jar 45g'
  }
];

export const CATEGORIES = [
  'Semua Produk',
  'Kopi & Minuman',
  'Keramik & Dapur',
  'Pakaian & Gaya Hidup',
  'Dekorasi & Rumah',
  'Aksesoris & Gadget'
];
