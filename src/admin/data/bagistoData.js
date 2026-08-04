export const invoices = [
  { id: "INV-2401", orderId: "ORD-7842", customer: "Priya Sharma", date: "2026-07-28", amount: 1125500, status: "Paid" },
  { id: "INV-2398", orderId: "ORD-7839", customer: "Ananya Mehra", date: "2026-07-27", amount: 220500, status: "Partial" },
  { id: "INV-2390", orderId: "ORD-7831", customer: "Kavita Reddy", date: "2026-07-25", amount: 474100, status: "Paid" },
  { id: "INV-2382", orderId: "ORD-7805", customer: "Meera Iyer", date: "2026-07-18", amount: 1009100, status: "Paid" },
];

export const shipments = [
  { id: "SHP-901", orderId: "ORD-7839", customer: "Ananya Mehra", carrier: "BlueDart", tracking: "BD99887766", date: "2026-07-28", status: "In Transit" },
  { id: "SHP-890", orderId: "ORD-7831", customer: "Kavita Reddy", carrier: "Delhivery", tracking: "DL55443322", date: "2026-07-26", status: "Delivered" },
  { id: "SHP-875", orderId: "ORD-7805", customer: "Meera Iyer", carrier: "DTDC", tracking: "DT11223344", date: "2026-07-19", status: "Delivered" },
];

export const refunds = [
  { id: "REF-112", orderId: "ORD-7812", customer: "Riya Malhotra", date: "2026-07-21", amount: 367350, reason: "Customer cancelled", status: "Refunded" },
];

export const transactions = [
  { id: "TXN-5501", orderId: "ORD-7842", gateway: "Razorpay", method: "UPI", amount: 1125500, date: "2026-07-28", status: "Success" },
  { id: "TXN-5490", orderId: "ORD-7839", gateway: "Razorpay", method: "Card", amount: 220500, date: "2026-07-27", status: "Success" },
  { id: "TXN-5475", orderId: "ORD-7831", gateway: "Bank Transfer", method: "NEFT", amount: 474100, date: "2026-07-25", status: "Success" },
  { id: "TXN-5450", orderId: "ORD-7812", gateway: "Razorpay", method: "UPI", amount: 367350, date: "2026-07-21", status: "Refunded" },
];

export const attributes = [
  { id: "attr-1", code: "gold_purity", name: "Gold Purity", type: "Select", required: true, values: "18KT, 22KT" },
  { id: "attr-2", code: "gold_weight", name: "Gold Weight", type: "Text", required: true, values: "—" },
  { id: "attr-3", code: "polki_weight", name: "Polki Weight", type: "Text", required: false, values: "—" },
  { id: "attr-4", code: "diamond_quality", name: "Diamond Quality", type: "Select", required: false, values: "VVS-VS, VS-SI" },
  { id: "attr-5", code: "certification", name: "Certification", type: "Select", required: true, values: "SGL, BIS, IGI" },
  { id: "attr-6", code: "occasion", name: "Occasion", type: "Multiselect", required: false, values: "Bridal, Party, Everyday" },
];

export const inventory = [
  { id: "dn00366", name: "Amiel Polki And Diamond Choker", sku: "dn00366", source: "Mumbai WH", qty: 2, reserved: 1, status: "In Stock" },
  { id: "er00122", name: "Royal Polki Chandbalis", sku: "er00122", source: "Jaipur WH", qty: 5, reserved: 0, status: "In Stock" },
  { id: "rg00912", name: "Classic Polki Cocktail Ring", sku: "rg00912", source: "Jaipur WH", qty: 8, reserved: 2, status: "In Stock" },
  { id: "tn30123", name: "Alyssa Polki Necklace", sku: "tn30123", source: "Mumbai WH", qty: 0, reserved: 0, status: "Out of Stock" },
  { id: "br00501", name: "Kundan Polki Kara Bracelets", sku: "br00501", source: "Delhi WH", qty: 3, reserved: 1, status: "Low Stock" },
];

export const coupons = [
  { id: "cp-1", code: "BRIDAL10", type: "Percent", value: 10, minOrder: 200000, usage: 24, limit: 100, status: "Active", ends: "2026-12-31" },
  { id: "cp-2", code: "WELCOME5K", type: "Fixed", value: 5000, minOrder: 100000, usage: 89, limit: 500, status: "Active", ends: "2026-09-30" },
  { id: "cp-3", code: "POLKI15", type: "Percent", value: 15, minOrder: 500000, usage: 5, limit: 50, status: "Active", ends: "2026-08-15" },
  { id: "cp-4", code: "FESTIVE20", type: "Percent", value: 20, minOrder: 300000, usage: 120, limit: 120, status: "Expired", ends: "2026-01-15" },
];

export const campaigns = [
  { id: "cmp-1", name: "Bridal Trunk Show Invite", channel: "Email", audience: "VIP Brides", sent: 1200, openRate: "42%", status: "Sent", date: "2026-07-10" },
  { id: "cmp-2", name: "Monsoon Polki Edit", channel: "SMS", audience: "All Customers", sent: 5400, openRate: "68%", status: "Scheduled", date: "2026-08-05" },
  { id: "cmp-3", name: "Store Launch — Jaipur", channel: "WhatsApp", audience: "Rajasthan", sent: 890, openRate: "71%", status: "Draft", date: "—" },
];

export const reviews = [
  { id: "rv-1", product: "Amiel Polki And Diamond Choker", customer: "Priya Sharma", rating: 5, title: "Absolute heirloom", body: "The craftsmanship is unreal. Felt like royalty.", status: "Approved", date: "2026-07-20" },
  { id: "rv-2", product: "Royal Polki Chandbalis", customer: "Ananya Mehra", rating: 4, title: "Stunning", body: "Heavy but beautiful. Packaging was luxurious.", status: "Pending", date: "2026-07-26" },
  { id: "rv-3", product: "Norah Diamond Necklace", customer: "Kavita Reddy", rating: 5, title: "Perfect for reception", body: "Got so many compliments. Will order again.", status: "Approved", date: "2026-07-12" },
];

export const subscribers = [
  { id: "ns-1", email: "priya.sharma@email.com", name: "Priya Sharma", status: "Subscribed", date: "2026-01-12" },
  { id: "ns-2", email: "ananya.m@email.com", name: "Ananya Mehra", status: "Subscribed", date: "2026-03-08" },
  { id: "ns-3", email: "guest@example.com", name: "—", status: "Unsubscribed", date: "2026-05-22" },
  { id: "ns-4", email: "nisha.v@email.com", name: "Nisha Verma", status: "Subscribed", date: "2025-11-02" },
];

export const cmsPages = [
  { id: "pg-1", title: "Privacy Policy", slug: "privacy-policy", status: "Published", updated: "2026-06-01" },
  { id: "pg-2", title: "Terms & Conditions", slug: "terms-conditions", status: "Published", updated: "2026-06-01" },
  { id: "pg-3", title: "Shipping Policy", slug: "shipping-policy", status: "Published", updated: "2026-05-12" },
  { id: "pg-4", title: "FAQs", slug: "faqs", status: "Published", updated: "2026-07-01" },
  { id: "pg-5", title: "Franchise Enquiry", slug: "franchise", status: "Draft", updated: "2026-07-15" },
];

export const adminUsers = [
  { id: "u-1", name: "Madhu Admin", email: "admin@madhujewellery.com", role: "Super Admin", status: "Active" },
  { id: "u-2", name: "Store Manager", email: "manager@madhujewellery.com", role: "Store Manager", status: "Active" },
  { id: "u-3", name: "Sales Desk", email: "sales@madhujewellery.com", role: "Sales", status: "Active" },
];
