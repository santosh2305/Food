const env = import.meta.env;
const localAsset = (value: string | undefined) =>
  value && /^\/assets\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp)$/.test(value) ? value : '';
export const business = {
  name: 'Shanvis kitchen',
  tagline: 'Home Made Food, Andhra Style',
  phone: '8147988709',
  whatsapp: '918147988709',
  location: 'Across Bangalore',
  hours: '24/7',
  minimum: 30000,
  freeDeliveryThreshold: 30000,
  qrPath: localAsset(env.VITE_UPI_QR_PATH),
  merchantName: 'Divya',
  cashEnabled: env.VITE_ENABLE_COD === 'true',
  pickupEnabled: env.VITE_ENABLE_PAY_ON_PICKUP === 'true',
  pickupAddress: env.VITE_PICKUP_ADDRESS || '',
};
export const money = (paise: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: paise % 100 ? 2 : 0,
  }).format(paise / 100);
