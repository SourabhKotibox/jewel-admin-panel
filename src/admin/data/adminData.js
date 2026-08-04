import { products, stores, testimonials, categoryStrip, formatPrice } from "../../data";

export { formatPrice };

export const adminOrders = [
  {
    id: "ORD-7842",
    customer: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    date: "2026-07-28",
    status: "Processing",
    payment: "Paid",
    paymentMethod: "UPI",
    items: [
      { productId: "dn00366", name: "Amiel Polki And Diamond Choker", qty: 1, price: 1125500 },
    ],
    total: 1125500,
    shipping: 0,
    address: "12 Palm Grove, Bandra West, Mumbai 400050",
  },
  {
    id: "ORD-7839",
    customer: "Ananya Mehra",
    email: "ananya.m@email.com",
    phone: "+91 98123 45678",
    date: "2026-07-27",
    status: "Shipped",
    payment: "Partial",
    paymentMethod: "Card",
    items: [
      { productId: "er00122", name: "Royal Polki Chandbalis", qty: 1, price: 520000 },
      { productId: "rg00912", name: "Classic Polki Cocktail Ring", qty: 1, price: 215000 },
    ],
    total: 735000,
    shipping: 0,
    address: "M-Block Market, Greater Kailash 1, New Delhi 110048",
  },
  {
    id: "ORD-7831",
    customer: "Kavita Reddy",
    email: "kavita.r@email.com",
    phone: "+91 91234 56789",
    date: "2026-07-25",
    status: "Delivered",
    payment: "Paid",
    paymentMethod: "Net Banking",
    items: [
      { productId: "tn30123", name: "Alyssa Polki Necklace", qty: 1, price: 474100 },
    ],
    total: 474100,
    shipping: 0,
    address: "SG Highway, Near Iscon Cross Road, Ahmedabad 380015",
  },
  {
    id: "ORD-7820",
    customer: "Sneha Kapoor",
    email: "sneha.k@email.com",
    phone: "+91 99887 66554",
    date: "2026-07-22",
    status: "Pending",
    payment: "Pending",
    paymentMethod: "Card",
    items: [
      { productId: "br00501", name: "Kundan Polki Kara Bracelets", qty: 1, price: 780000 },
    ],
    total: 780000,
    shipping: 0,
    address: "C-Scheme, Near Central Park, Jaipur 302001",
  },
  {
    id: "ORD-7812",
    customer: "Riya Malhotra",
    email: "riya.m@email.com",
    phone: "+91 97654 32109",
    date: "2026-07-20",
    status: "Cancelled",
    payment: "Refunded",
    paymentMethod: "UPI",
    items: [
      { productId: "dn00088", name: "Norah Diamond Necklace", qty: 1, price: 367100 },
    ],
    total: 367100,
    shipping: 250,
    address: "4, Woodburn Park Road, Elgin Rd, Kolkata 700020",
  },
  {
    id: "ORD-7805",
    customer: "Meera Iyer",
    email: "meera.iyer@email.com",
    phone: "+91 96543 21098",
    date: "2026-07-18",
    status: "Delivered",
    payment: "Paid",
    paymentMethod: "Wallet",
    items: [
      { productId: "on30079", name: "Reem Polki And Diamond Bead Pendant", qty: 1, price: 1009100 },
    ],
    total: 1009100,
    shipping: 0,
    address: "Channi Himat, Jammu, Jammu and Kashmir 180015",
  },
];

export const adminCustomers = [
  { id: "CUS-101", name: "Priya Sharma", email: "priya.sharma@email.com", phone: "+91 98765 43210", orders: 3, spent: 2450000, city: "Mumbai", joined: "2025-11-12" },
  { id: "CUS-102", name: "Ananya Mehra", email: "ananya.m@email.com", phone: "+91 98123 45678", orders: 2, spent: 980000, city: "New Delhi", joined: "2026-01-08" },
  { id: "CUS-103", name: "Kavita Reddy", email: "kavita.r@email.com", phone: "+91 91234 56789", orders: 5, spent: 3120000, city: "Ahmedabad", joined: "2025-08-22" },
  { id: "CUS-104", name: "Sneha Kapoor", email: "sneha.k@email.com", phone: "+91 99887 66554", orders: 1, spent: 780000, city: "Jaipur", joined: "2026-06-14" },
  { id: "CUS-105", name: "Riya Malhotra", email: "riya.m@email.com", phone: "+91 97654 32109", orders: 4, spent: 1890000, city: "Kolkata", joined: "2025-09-30" },
  { id: "CUS-106", name: "Meera Iyer", email: "meera.iyer@email.com", phone: "+91 96543 21098", orders: 2, spent: 1450000, city: "Jammu", joined: "2026-02-19" },
  { id: "CUS-107", name: "Ishita Banerjee", email: "ishita.b@email.com", phone: "+91 95432 10987", orders: 1, spent: 520000, city: "Surat", joined: "2026-07-01" },
  { id: "CUS-108", name: "Nisha Verma", email: "nisha.v@email.com", phone: "+91 94321 09876", orders: 6, spent: 4200000, city: "Chandigarh", joined: "2025-05-03" },
];

export const orderStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export const statusStyles = {
  Pending: "bg-amber-50 text-amber-800 border-amber-200",
  Processing: "bg-blue-50 text-blue-800 border-blue-200",
  Shipped: "bg-indigo-50 text-indigo-800 border-indigo-200",
  Delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-800 border-rose-200",
  Paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Partial: "bg-amber-50 text-amber-800 border-amber-200",
  Refunded: "bg-stone-100 text-noir/60 border-stone-200",
  Active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Draft: "bg-stone-100 text-noir/60 border-stone-200",
  "Ready to Ship": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Made to Order": "bg-champagne/10 text-champagne-dark border-champagne/30",
};

export const dashboardStats = {
  revenue: adminOrders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + o.total, 0),
  orders: adminOrders.length,
  products: products.length,
  customers: adminCustomers.length,
  stores: stores.length,
  pendingOrders: adminOrders.filter((o) => o.status === "Pending" || o.status === "Processing").length,
};

export { products, stores, testimonials, categoryStrip };
