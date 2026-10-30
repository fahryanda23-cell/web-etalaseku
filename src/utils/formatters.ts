import { CartItem, OrderForm, StoreProfile } from '../types';

export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
};

export const createWhatsAppOrderText = (
  cart: CartItem[],
  form: OrderForm,
  store: StoreProfile
): string => {
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const itemsList = cart
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name}\n   Jumlah: ${item.quantity} ${item.product.unit || 'pcs'} × ${formatRupiah(item.product.price)} = ${formatRupiah(item.product.price * item.quantity)} (Kode: ${item.product.sku})`
    )
    .join('\n\n');

  const message = `Halo *${store.name}*, saya ingin memesan barang dari etalase:\n\n` +
    `📦 *DAFTAR PESANAN (${totalItems} item):*\n` +
    `${itemsList}\n\n` +
    `💰 *TOTAL PEMBAYARAN:* *${formatRupiah(subtotal)}*\n\n` +
    `👤 *DATA PEMESAN:*\n` +
    `• Nama: ${form.customerName || '-'}\n` +
    `• No. HP/WA: ${form.phone || '-'}\n` +
    `• Alamat Kirim: ${form.address || '-'}\n` +
    `• Metode Pembayaran: ${form.paymentMethod}\n` +
    (form.notes ? `• Catatan: ${form.notes}\n` : '') +
    `\nMohon informasi ketersediaan stok & ongkir ke alamat saya ya. Terima kasih!`;

  return message;
};

export const createWhatsAppUrl = (
  phone: string,
  message: string
): string => {
  // Clean phone number: remove non-digits, replace leading '0' with '62'
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
