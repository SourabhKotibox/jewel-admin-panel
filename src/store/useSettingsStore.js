import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Stable public URL for the default brand logo (always works in Vite) */
export const DEFAULT_LOGO = new URL("../assets/images/logo.png", import.meta.url).href;

export const defaultSettings = {
  business: {
    businessName: "Madhu Jewellery",
    legalName: "Madhu Jewellery Private Limited",
    tagline: "Handcrafted luxury for every celebration",
    supportEmail: "care@madhujewellery.com",
    supportPhone: "+91 96195 87978",
    whatsapp: "919619587978",
    whatsappMessage: "Hey, I have a query about Madhu jewellery.",
    address: "190 Turner Road, Bandra West, Mumbai 400050",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400050",
    gstin: "",
    timezone: "Asia/Kolkata",
    currency: "INR",
    locale: "en",
    storefrontLogo: "",
    storefrontLogoHeight: 88,
    storefrontLogoMobileHeight: 72,
    adminLogo: "",
    adminLogoHeight: 48,
    favicon: "",
    socials: {
      instagram: "https://www.instagram.com/madhujewellery",
      facebook: "https://www.facebook.com/MadhuJewellery",
      youtube: "https://www.youtube.com/@madhubykaranjohar",
      twitter: "",
      pinterest: "",
      linkedin: "",
      website: "https://madhujewellery.com",
    },
  },
  credentials: {
    name: "Madhu Admin",
    email: "admin@madhujewellery.com",
    role: "Super Admin",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
  mail: {
    driver: "smtp",
    host: "smtp.gmail.com",
    port: "587",
    encryption: "tls",
    username: "",
    password: "",
    fromName: "Madhu Jewellery",
    fromEmail: "noreply@madhujewellery.com",
    replyTo: "care@madhujewellery.com",
    orderPlaced: true,
    orderShipped: true,
    orderDelivered: true,
    welcomeEmail: true,
    newsletter: true,
    lowStockAlert: true,
    adminAlertEmail: "admin@madhujewellery.com",
  },
  general: {
    storeName: "Madhu Jewellery",
    tagline: "Handcrafted luxury for every celebration",
    supportEmail: "care@madhujewellery.com",
    supportPhone: "+91 96195 87978",
    whatsapp: "919619587978",
    timezone: "Asia/Kolkata",
    defaultLocale: "en",
    currency: "INR",
    weightUnit: "gms",
  },
  commerce: {
    freeShippingThreshold: 200000,
    flatShippingRate: 250,
    taxNote: "Inclusive of all taxes",
    taxRate: 3,
    enableGst: true,
    gstin: "",
    inventorySource: "default",
    lowStockThreshold: 5,
    allowBackorders: false,
  },
  payments: {
    cashOnDelivery: {
      enabled: true,
      title: "Cash on Delivery",
      description: "Pay when your jewellery is delivered",
      minOrder: 0,
      maxOrder: 500000,
    },
    razorpay: {
      enabled: true,
      title: "Razorpay",
      description: "Cards, UPI, Netbanking & Wallets",
      keyId: "",
      keySecret: "",
      webhookSecret: "",
      testMode: true,
    },
    stripe: {
      enabled: false,
      title: "Stripe",
      description: "International cards",
      publishableKey: "",
      secretKey: "",
      webhookSecret: "",
      testMode: true,
    },
    payu: {
      enabled: false,
      title: "PayU",
      description: "Indian payment gateway",
      merchantKey: "",
      merchantSalt: "",
      testMode: true,
    },
    paypal: {
      enabled: false,
      title: "PayPal",
      description: "Pay with PayPal",
      clientId: "",
      secret: "",
      sandbox: true,
    },
    bankTransfer: {
      enabled: true,
      title: "Bank Transfer / NEFT",
      description: "Transfer to our account and share UTR",
      accountName: "Madhu Jewellery Pvt Ltd",
      accountNumber: "",
      ifsc: "",
      bankName: "",
    },
    partialPayment: {
      enabled: true,
      title: "Partial Advance",
      description: "Pay advance now, balance on delivery",
      advancePercent: 30,
    },
  },
  shipping: {
    methods: [
      { id: "standard", title: "Standard Insured Shipping", enabled: true, rate: 250, eta: "5–7 business days" },
      { id: "express", title: "Express Shipping", enabled: true, rate: 750, eta: "2–3 business days" },
      { id: "international", title: "International Shipping", enabled: true, rate: 3500, eta: "7–14 business days" },
      { id: "store_pickup", title: "Store Pickup", enabled: true, rate: 0, eta: "Same day" },
    ],
    shiprocket: {
      enabled: false,
      email: "",
      password: "",
      token: "",
      pickupLocation: "Primary",
    },
  },
  notifications: {
    orderPlacedEmail: true,
    orderShippedEmail: true,
    orderDeliveredEmail: true,
    lowStockAlert: true,
    adminEmail: "admin@madhujewellery.com",
    smsEnabled: false,
  },
  /** INR per gram — drives market-priced products */
  metalRates: {
    gold24kPerGram: 7500,
    silver925PerGram: 110,
    platinum950PerGram: 3400,
    defaultMakingPercent: 12,
    defaultWastagePercent: 0,
    defaultMakingFlat: 0,
    note: "Rates in INR per gram. Gold purity (22K/18K…) is derived from 24K.",
    updatedAt: "",
  },
};

function deepMerge(base, overlay) {
  if (!overlay || typeof overlay !== "object") return structuredClone(base);
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const key of Object.keys(overlay)) {
    const bv = base?.[key];
    const ov = overlay[key];
    if (ov && typeof ov === "object" && !Array.isArray(ov) && bv && typeof bv === "object" && !Array.isArray(bv)) {
      out[key] = deepMerge(bv, ov);
    } else if (ov !== undefined) {
      out[key] = ov;
    }
  }
  return out;
}

const useSettingsStore = create(
  persist(
    (set) => ({
      ...structuredClone(defaultSettings),

      updateBusiness: (data) => set((s) => ({ business: { ...s.business, ...data } })),
      updateSocial: (key, value) =>
        set((s) => ({
          business: {
            ...s.business,
            socials: { ...s.business.socials, [key]: value },
          },
        })),
      updateCredentials: (data) => set((s) => ({ credentials: { ...s.credentials, ...data } })),
      updateMail: (data) => set((s) => ({ mail: { ...s.mail, ...data } })),
      updateGeneral: (data) => set((s) => ({ general: { ...s.general, ...data } })),
      updateCommerce: (data) => set((s) => ({ commerce: { ...s.commerce, ...data } })),
      updateNotifications: (data) =>
        set((s) => ({ notifications: { ...s.notifications, ...data } })),
      updateMetalRates: (data) =>
        set((s) => ({ metalRates: { ...s.metalRates, ...data } })),
      updatePayment: (gateway, data) =>
        set((s) => ({
          payments: {
            ...s.payments,
            [gateway]: { ...s.payments[gateway], ...data },
          },
        })),
      togglePayment: (gateway) =>
        set((s) => ({
          payments: {
            ...s.payments,
            [gateway]: {
              ...s.payments[gateway],
              enabled: !s.payments[gateway].enabled,
            },
          },
        })),
      updateShippingMethod: (id, data) =>
        set((s) => ({
          shipping: {
            ...s.shipping,
            methods: s.shipping.methods.map((m) =>
              m.id === id ? { ...m, ...data } : m
            ),
          },
        })),
      updateShiprocket: (data) =>
        set((s) => ({
          shipping: {
            ...s.shipping,
            shiprocket: { ...(s.shipping.shiprocket || {}), ...data },
          },
        })),
      resetSettings: () => set(structuredClone(defaultSettings)),
    }),
    {
      name: "madhu-admin-settings-v4",
      merge: (persisted, current) => deepMerge(current, persisted),
    }
  )
);

/** Resolve logo URL — empty stored value falls back to default asset */
export function resolveLogo(url) {
  if (url && typeof url === "string" && url.trim()) return url;
  return DEFAULT_LOGO;
}

export default useSettingsStore;
