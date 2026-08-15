/** Shared configs for list + separate edit pages */

import { Link } from "react-router-dom";
import { formatPrice, adminCustomers, adminOrders, categoryStrip, products, testimonials } from "../data/adminData";
import {
  invoices,
  shipments,
  refunds,
  transactions,
  attributes,
  inventory,
  coupons,
  campaigns,
  reviews,
  subscribers,
  cmsPages,
  adminUsers,
} from "../data/bagistoData";
import { Star, BookOpen, Percent, Shield } from "lucide-react";
import { assetUrl } from "../../api/client";

function thumbSrc(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

export const entityConfigs = {
  inventory: {
    title: "Inventory",
    singular: "Inventory",
    basePath: "/admin/inventory",
    idPrefix: "invt",
    seed: inventory,
    searchKeys: ["name", "sku", "source", "productId", "variantSku"],
    filters: ["All", "In Stock", "Low Stock", "Out of Stock"],
    filterKey: "status",
    description: "Warehouse stock — auto-synced when you save products with variants.",
    fields: [
      { key: "name", label: "Product Name", required: true, full: true },
      { key: "sku", label: "SKU", required: true },
      { key: "productId", label: "Product SKU / ID" },
      { key: "variantSku", label: "Variant SKU" },
      { key: "source", label: "Warehouse / Source", required: true },
      { key: "qty", label: "Quantity", type: "number", required: true },
      { key: "reserved", label: "Reserved", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["In Stock", "Low Stock", "Out of Stock"] },
    ],
    columns: [
      { key: "name", label: "Product", render: (r) => <span className="font-medium">{r.name}</span> },
      { key: "sku", label: "SKU", hide: "sm", render: (r) => <span className="font-mono text-xs">{r.sku}</span> },
      { key: "source", label: "Source", hide: "md" },
      { key: "qty", label: "Qty" },
      { key: "reserved", label: "Reserved", hide: "lg" },
      { key: "status", label: "Status", badge: true },
    ],
  },
  invoices: {
    title: "Invoices",
    singular: "Invoice",
    basePath: "/admin/invoices",
    idPrefix: "inv",
    seed: invoices,
    searchKeys: ["id", "orderId", "customer"],
    filters: ["All", "Paid", "Partial", "Pending"],
    filterKey: "status",
    fields: [
      { key: "id", label: "Invoice ID", required: true },
      { key: "orderId", label: "Order ID", required: true },
      { key: "customer", label: "Customer", required: true },
      { key: "date", label: "Date", required: true },
      { key: "amount", label: "Amount (INR)", type: "number", required: true },
      { key: "status", label: "Status", type: "select", options: ["Paid", "Partial", "Pending"] },
    ],
    columns: [
      { key: "id", label: "Invoice", render: (r) => <span className="font-medium">{r.id}</span> },
      { key: "orderId", label: "Order", hide: "sm" },
      { key: "customer", label: "Customer" },
      { key: "date", label: "Date", hide: "md" },
      { key: "status", label: "Status", badge: true },
      { key: "amount", label: "Amount", align: "right", render: (r) => formatPrice(Number(r.amount) || 0) },
    ],
  },
  shipments: {
    title: "Shipments",
    singular: "Shipment",
    basePath: "/admin/shipments",
    idPrefix: "shp",
    seed: shipments,
    searchKeys: ["id", "orderId", "customer", "tracking"],
    filters: ["All", "In Transit", "Delivered", "Pending"],
    filterKey: "status",
    fields: [
      { key: "id", label: "Shipment ID", required: true },
      { key: "orderId", label: "Order ID", required: true },
      { key: "customer", label: "Customer", required: true },
      { key: "carrier", label: "Carrier", required: true },
      { key: "tracking", label: "Tracking No." },
      { key: "date", label: "Date" },
      { key: "status", label: "Status", type: "select", options: ["Pending", "In Transit", "Delivered"] },
    ],
    columns: [
      { key: "id", label: "Shipment", render: (r) => <span className="font-medium">{r.id}</span> },
      { key: "orderId", label: "Order", hide: "sm" },
      { key: "customer", label: "Customer" },
      { key: "carrier", label: "Carrier", hide: "md" },
      { key: "tracking", label: "Tracking", hide: "lg", render: (r) => <span className="font-mono text-xs">{r.tracking}</span> },
      { key: "status", label: "Status", badge: true },
    ],
  },
  refunds: {
    title: "Refunds",
    singular: "Refund",
    basePath: "/admin/refunds",
    idPrefix: "ref",
    seed: refunds,
    searchKeys: ["id", "orderId", "customer"],
    fields: [
      { key: "id", label: "Refund ID", required: true },
      { key: "orderId", label: "Order ID", required: true },
      { key: "customer", label: "Customer", required: true },
      { key: "date", label: "Date" },
      { key: "amount", label: "Amount (INR)", type: "number", required: true },
      { key: "reason", label: "Reason", full: true },
      { key: "status", label: "Status", type: "select", options: ["Pending", "Refunded", "Rejected"] },
    ],
    columns: [
      { key: "id", label: "Refund", render: (r) => <span className="font-medium">{r.id}</span> },
      { key: "orderId", label: "Order" },
      { key: "customer", label: "Customer" },
      { key: "reason", label: "Reason", hide: "md" },
      { key: "status", label: "Status", badge: true },
      { key: "amount", label: "Amount", align: "right", render: (r) => formatPrice(Number(r.amount) || 0) },
    ],
  },
  transactions: {
    title: "Transactions",
    singular: "Transaction",
    basePath: "/admin/transactions",
    idPrefix: "txn",
    seed: transactions,
    searchKeys: ["id", "orderId", "gateway"],
    filters: ["All", "Success", "Refunded", "Failed"],
    filterKey: "status",
    fields: [
      { key: "id", label: "Txn ID", required: true },
      { key: "orderId", label: "Order ID", required: true },
      { key: "gateway", label: "Gateway", type: "select", options: ["Razorpay", "Stripe", "PayU", "PayPal", "Bank Transfer", "COD"] },
      { key: "method", label: "Method" },
      { key: "amount", label: "Amount (INR)", type: "number", required: true },
      { key: "date", label: "Date" },
      { key: "status", label: "Status", type: "select", options: ["Success", "Failed", "Refunded", "Pending"] },
    ],
    columns: [
      { key: "id", label: "Txn", render: (r) => <span className="font-medium font-mono text-xs">{r.id}</span> },
      { key: "orderId", label: "Order" },
      { key: "gateway", label: "Gateway", hide: "sm" },
      { key: "method", label: "Method", hide: "md" },
      { key: "date", label: "Date", hide: "lg" },
      { key: "status", label: "Status", badge: true },
      { key: "amount", label: "Amount", align: "right", render: (r) => formatPrice(Number(r.amount) || 0) },
    ],
  },
  attributes: {
    title: "Attributes",
    singular: "Attribute",
    basePath: "/admin/attributes",
    idPrefix: "attr",
    seed: attributes,
    searchKeys: ["code", "name", "type", "group"],
    description:
      "Catalogue attribute definitions (metal, purity, ring size, necklace length…). Assign to categories to drive the product form.",
    fields: [
      { key: "code", label: "Code", required: true },
      { key: "name", label: "Name", required: true },
      {
        key: "type",
        label: "Type",
        type: "select",
        options: ["Text", "Select", "Multiselect", "Boolean", "Price", "Number"],
      },
      {
        key: "group",
        label: "Group",
        type: "select",
        options: ["metal", "stone", "sizing", "style", "specs", "general"],
      },
      { key: "values", label: "Options (comma separated)", full: true },
      { key: "required", label: "Required", type: "checkbox", checkLabel: "Required field" },
      {
        key: "usedForVariants",
        label: "Used for variants",
        type: "checkbox",
        checkLabel: "Size / option variants (stock per value)",
      },
      { key: "status", label: "Status", type: "select", options: ["Active", "Draft"] },
    ],
    columns: [
      { key: "name", label: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
      { key: "code", label: "Code", render: (r) => <span className="font-mono text-xs break-all">{r.code}</span> },
      { key: "type", label: "Type", hide: "sm" },
      { key: "group", label: "Group", hide: "md" },
      { key: "required", label: "Required", hide: "md", render: (r) => (r.required ? "Yes" : "No") },
      {
        key: "values",
        label: "Options",
        hide: "lg",
        render: (r) => (
          <span className="text-xs text-noir/60 line-clamp-2 break-words" title={r.values}>
            {r.values || "—"}
          </span>
        ),
      },
    ],
  },
  customers: {
    title: "Customers",
    singular: "Customer",
    basePath: "/admin/customers",
    idPrefix: "cus",
    seed: adminCustomers,
    searchKeys: ["name", "email", "city", "id", "phone"],
    fields: [
      { key: "id", label: "Customer ID", required: true },
      { key: "name", label: "Full Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Phone", required: true },
      { key: "city", label: "City" },
      { key: "orders", label: "Orders", type: "number" },
      { key: "spent", label: "Lifetime Spend (INR)", type: "number" },
      { key: "joined", label: "Joined Date" },
    ],
    columns: [
      {
        key: "name",
        label: "Customer",
        render: (c) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-noir text-champagne flex items-center justify-center text-[11px] font-semibold shrink-0">
              {(c.name || "?")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-noir">{c.name}</p>
              <p className="text-xs text-noir/40 truncate">{c.email}</p>
            </div>
          </div>
        ),
      },
      { key: "phone", label: "Phone", hide: "md" },
      { key: "city", label: "City", hide: "lg" },
      { key: "orders", label: "Orders" },
      { key: "spent", label: "Lifetime Spend", align: "right", render: (c) => formatPrice(Number(c.spent) || 0) },
      { key: "joined", label: "Joined", hide: "sm", align: "right" },
    ],
  },
  coupons: {
    title: "Coupons",
    singular: "Coupon",
    basePath: "/admin/coupons",
    idPrefix: "cp",
    seed: coupons,
    searchKeys: ["code", "name", "type"],
    filters: ["All", "Active", "Expired", "Draft"],
    filterKey: "status",
    fields: [
      { key: "code", label: "Coupon Code", required: true },
      { key: "name", label: "Display name", full: true },
      {
        key: "type",
        label: "Type",
        type: "select",
        options: ["Percent", "Fixed", "FreeShipping", "BuyXGetY", "Custom"],
      },
      { key: "value", label: "Value (% or ₹)", type: "number", required: true },
      { key: "maxDiscount", label: "Max discount cap (₹, optional)", type: "number" },
      { key: "minOrder", label: "Min Order (INR)", type: "number" },
      { key: "buyQty", label: "Buy qty (BuyXGetY)", type: "number" },
      { key: "getQty", label: "Get qty (BuyXGetY)", type: "number" },
      { key: "customFormula", label: "Custom formula (e.g. flat:500)", full: true },
      { key: "usage", label: "Times Used", type: "number" },
      { key: "limit", label: "Usage Limit", type: "number" },
      { key: "ends", label: "Ends On (YYYY-MM-DD)" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Expired", "Draft"] },
    ],
    columns: [
      { key: "code", label: "Code", render: (r) => <span className="font-mono font-medium text-champagne-dark">{r.code}</span> },
      { key: "name", label: "Name", hide: "sm" },
      { key: "type", label: "Type", hide: "sm" },
      {
        key: "value",
        label: "Value",
        render: (r) =>
          r.type === "Percent" || r.type === "Custom" || r.type === "BuyXGetY"
            ? `${r.value}%`
            : r.type === "FreeShipping"
            ? "Free ship"
            : formatPrice(Number(r.value) || 0),
      },
      { key: "usage", label: "Used", hide: "md", render: (r) => `${r.usage}/${r.limit}` },
      { key: "ends", label: "Ends", hide: "lg" },
      { key: "status", label: "Status", badge: true },
    ],
  },
  campaigns: {
    title: "Campaigns",
    singular: "Campaign",
    basePath: "/admin/campaigns",
    idPrefix: "cmp",
    seed: campaigns,
    searchKeys: ["name", "channel", "audience", "subject"],
    filters: ["All", "Sent", "Scheduled", "Draft"],
    filterKey: "status",
    description:
      "Create draft campaigns, then open a campaign and use Send Campaign to deliver to the selected audience.",
    fields: [
      { key: "name", label: "Campaign Name", required: true, full: true },
      { key: "channel", label: "Channel", type: "select", options: ["Email", "SMS", "WhatsApp", "Push"] },
      {
        key: "audience",
        label: "Audience",
        type: "select",
        options: ["All customers", "Newsletter subscribers", "VIP (spent ≥ ₹1L)"],
      },
      { key: "subject", label: "Subject / title", required: true, full: true },
      { key: "body", label: "Message body", type: "textarea", full: true, rows: 6, required: true },
      { key: "image", label: "Campaign image", full: true, type: "image" },
      { key: "scheduledAt", label: "Schedule date (YYYY-MM-DD)" },
      { key: "sent", label: "Sent Count", type: "number" },
      { key: "openRate", label: "Open Rate" },
      { key: "date", label: "Date" },
      { key: "status", label: "Status", type: "select", options: ["Draft", "Scheduled", "Sent"] },
    ],
    columns: [
      { key: "name", label: "Campaign", render: (r) => <span className="font-medium">{r.name}</span> },
      { key: "channel", label: "Channel", hide: "sm" },
      { key: "audience", label: "Audience", hide: "md" },
      { key: "sent", label: "Sent", hide: "lg" },
      { key: "openRate", label: "Open", hide: "lg" },
      { key: "status", label: "Status", badge: true },
    ],
  },
  reviews: {
    title: "Reviews",
    singular: "Review",
    basePath: "/admin/reviews",
    idPrefix: "rv",
    seed: reviews,
    searchKeys: ["product", "customer", "title"],
    filters: ["All", "Approved", "Pending"],
    filterKey: "status",
    fields: [
      { key: "product", label: "Product", required: true, full: true },
      { key: "customer", label: "Customer", required: true },
      { key: "rating", label: "Rating (1-5)", type: "number", required: true },
      { key: "title", label: "Title", required: true },
      { key: "body", label: "Review Body", type: "textarea", full: true, required: true },
      { key: "date", label: "Date" },
      { key: "status", label: "Status", type: "select", options: ["Pending", "Approved", "Rejected"] },
    ],
    columns: [
      {
        key: "product",
        label: "Product",
        render: (r) => (
          <div>
            <p className="font-medium text-noir">{r.product}</p>
            <p className="text-xs text-noir/40">{r.customer}</p>
          </div>
        ),
      },
      {
        key: "rating",
        label: "Rating",
        render: (r) => (
          <span className="inline-flex items-center gap-1 text-champagne-dark">
            <Star size={12} fill="currentColor" /> {r.rating}
          </span>
        ),
      },
      { key: "title", label: "Title", hide: "md" },
      { key: "date", label: "Date", hide: "lg" },
      { key: "status", label: "Status", badge: true },
    ],
  },
  newsletter: {
    title: "Subscribers",
    singular: "Subscriber",
    basePath: "/admin/newsletter",
    idPrefix: "ns",
    seed: subscribers,
    searchKeys: ["email", "name"],
    filters: ["All", "Subscribed", "Unsubscribed"],
    filterKey: "status",
    fields: [
      { key: "email", label: "Email", required: true },
      { key: "name", label: "Name" },
      { key: "date", label: "Joined" },
      { key: "status", label: "Status", type: "select", options: ["Subscribed", "Unsubscribed"] },
    ],
    columns: [
      { key: "email", label: "Email", render: (r) => <span className="font-medium">{r.email}</span> },
      { key: "name", label: "Name", hide: "sm" },
      { key: "date", label: "Joined", hide: "md" },
      { key: "status", label: "Status", badge: true },
    ],
  },
  "cms-pages": {
    title: "CMS Pages",
    singular: "CMS Page",
    basePath: "/admin/cms-pages",
    idPrefix: "pg",
    seed: cmsPages.map((p) => ({ ...p, body: p.body || `# ${p.title}\n\nEdit this content.` })),
    searchKeys: ["title", "slug"],
    filters: ["All", "Published", "Draft"],
    filterKey: "status",
    description: "Static policy and content pages. Set SEO meta for search engines.",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "status", label: "Status", type: "select", options: ["Published", "Draft"] },
      { key: "updated", label: "Updated" },
      { key: "metaTitle", label: "SEO Meta Title", full: true },
      { key: "metaDescription", label: "SEO Meta Description", type: "textarea", full: true, rows: 2 },
      { key: "metaKeywords", label: "SEO Keywords (comma separated)", full: true },
      { key: "body", label: "Page Body", type: "richtext", full: true, required: true },
    ],
    columns: [
      { key: "title", label: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
      { key: "slug", label: "Slug", hide: "sm", render: (r) => <span className="font-mono text-xs">/{r.slug}</span> },
      { key: "updated", label: "Updated", hide: "md" },
      { key: "status", label: "Status", badge: true },
    ],
  },
  "dynamic-pages": {
    title: "Dynamic Pages",
    singular: "Page",
    basePath: "/admin/dynamic-pages",
    idPrefix: "dp",
    seed: [
      { id: "dp-1", title: "Privacy Policy", slug: "privacy-policy", status: "Published", updated: "2026-06-01", body: "Your privacy matters…" },
      { id: "dp-2", title: "Terms & Conditions", slug: "terms-conditions", status: "Published", updated: "2026-06-01", body: "By using this site…" },
      { id: "dp-3", title: "Shipping Policy", slug: "shipping-policy", status: "Published", updated: "2026-05-12", body: "We offer insured shipping…" },
      { id: "dp-4", title: "FAQs", slug: "faqs", status: "Published", updated: "2026-07-01", body: "Frequently asked questions…" },
      { id: "dp-5", title: "Franchise Enquiry", slug: "franchise", status: "Draft", updated: "2026-07-15", body: "Partner with Madhu…" },
      { id: "dp-6", title: "Care Guide", slug: "jewellery-care", status: "Published", updated: "2026-07-20", body: "How to care for Polki…" },
    ],
    searchKeys: ["title", "slug"],
    filters: ["All", "Published", "Draft"],
    filterKey: "status",
    description: "Create, edit and delete CMS pages. Set SEO meta for search engines.",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "status", label: "Status", type: "select", options: ["Published", "Draft"] },
      { key: "updated", label: "Updated" },
      { key: "metaTitle", label: "SEO Meta Title", full: true },
      { key: "metaDescription", label: "SEO Meta Description", type: "textarea", full: true, rows: 2 },
      { key: "metaKeywords", label: "SEO Keywords (comma separated)", full: true },
      { key: "body", label: "Page Body", type: "richtext", full: true, required: true },
    ],
    columns: [
      { key: "title", label: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
      { key: "slug", label: "Slug", hide: "sm", render: (r) => <span className="font-mono text-xs">/{r.slug}</span> },
      { key: "updated", label: "Updated", hide: "md" },
      { key: "status", label: "Status", badge: true },
    ],
  },
  faqs: {
    title: "FAQs",
    singular: "FAQ",
    basePath: "/admin/faqs",
    idPrefix: "faq",
    seed: [
      {
        id: 1,
        q: "Do you offer worldwide shipping?",
        a: "<p>Yes. We offer complimentary insured shipping outside India on orders above INR 200,000. Domestic deliveries are tracked and fully insured.</p>",
        status: "Published",
      },
      {
        id: 2,
        q: "Are diamonds certified?",
        a: "<p>All diamonds are SGL certified, and gold is BIS hallmarked. Certificates ship with your order.</p>",
        status: "Published",
      },
      {
        id: 3,
        q: "Can I customise bridal sets?",
        a: "<p>Yes — book a private consultation via WhatsApp or a store visit. Our atelier can tailor weight, stones, and motifs.</p>",
        status: "Draft",
      },
    ],
    searchKeys: ["q", "a"],
    filters: ["All", "Published", "Draft"],
    filterKey: "status",
    description: "Published FAQs appear on the storefront /faq page (also linked in the footer).",
    fields: [
      { key: "q", label: "Question", required: true, full: true },
      { key: "a", label: "Answer", type: "richtext", required: true, full: true },
      { key: "status", label: "Status", type: "select", options: ["Published", "Draft"] },
    ],
    columns: [
      { key: "q", label: "Question", render: (r) => <span className="font-medium">{r.q}</span> },
      { key: "a", label: "Answer", hide: "md", render: (r) => <span className="text-noir/60 line-clamp-1">{String(r.a || "").replace(/<[^>]+>/g, " ")}</span> },
      { key: "status", label: "Status", badge: true },
    ],
  },
  blog: {
    title: "Blog Posts",
    singular: "Blog Post",
    basePath: "/admin/blog",
    idPrefix: "blog",
    seed: [],
    searchKeys: ["title", "slug", "metaKeywords"],
    filters: ["All", "Published", "Draft"],
    filterKey: "status",
    description:
      "Published posts appear on /blog. Use the rich editor for H2/H3 headings and fill SEO meta for each post.",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "date", label: "Date" },
      { key: "status", label: "Status", type: "select", options: ["Published", "Draft"] },
      { key: "cover", label: "Cover image", full: true, type: "image" },
      { key: "excerpt", label: "Short excerpt (listing card)", type: "textarea", full: true, rows: 2 },
      { key: "metaTitle", label: "SEO Meta Title", full: true },
      { key: "metaDescription", label: "SEO Meta Description", type: "textarea", full: true, rows: 2 },
      { key: "metaKeywords", label: "SEO Keywords (comma separated)", full: true },
      { key: "body", label: "Content (use headings for sections)", type: "richtext", full: true, required: true },
    ],
    columns: [
      { key: "title", label: "Title", render: (r) => <span className="font-medium flex items-center gap-2"><BookOpen size={14} className="text-champagne-dark" />{r.title}</span> },
      { key: "slug", label: "Slug", hide: "sm", render: (r) => <span className="font-mono text-xs">/{r.slug}</span> },
      { key: "date", label: "Date", hide: "md" },
      { key: "status", label: "Status", badge: true },
    ],
  },
  taxes: {
    title: "Tax Rates",
    singular: "Tax Rate",
    basePath: "/admin/taxes",
    idPrefix: "tax",
    description:
      "Create GST, IGST, VAT, Zero-rated or Custom rates. Checkout uses the highest-priority Active tax matching the customer country (India by default).",
    seed: [],
    searchKeys: ["name", "country", "type"],
    filters: ["All", "Active", "Draft"],
    filterKey: "status",
    fields: [
      { key: "name", label: "Tax Name", required: true },
      {
        key: "type",
        label: "Tax type",
        type: "select",
        options: ["GST", "CGST", "SGST", "IGST", "VAT", "Zero", "Custom"],
        required: true,
      },
      { key: "rate", label: "Rate label (e.g. 3%)", required: true },
      { key: "rateValue", label: "Numeric % for checkout", type: "number", required: true },
      { key: "country", label: "Region / Country", required: true },
      { key: "state", label: "State (optional scope)" },
      { key: "priority", label: "Priority (higher wins)", type: "number" },
      {
        key: "inclusive",
        label: "Inclusive pricing",
        type: "checkbox",
        checkLabel: "Prices already include this tax (no extra at checkout)",
      },
      { key: "status", label: "Status", type: "select", options: ["Active", "Draft"] },
    ],
    columns: [
      {
        key: "name",
        label: "Name",
        render: (r) => (
          <span className="font-medium flex items-center gap-2">
            <Percent size={14} className="text-champagne-dark" />
            {r.name}
          </span>
        ),
      },
      { key: "type", label: "Type", hide: "sm" },
      { key: "rate", label: "Rate" },
      { key: "country", label: "Region", hide: "md" },
      { key: "priority", label: "Priority", hide: "lg" },
      { key: "status", label: "Status", badge: true },
    ],
  },
  roles: {
    title: "Roles",
    singular: "Role",
    basePath: "/admin/roles",
    idPrefix: "role",
    seed: [
      { id: 1, name: "Super Admin", users: 1, permissions: "All", status: "Active" },
      { id: 2, name: "Store Manager", users: 3, permissions: "Catalog, Orders, Stores", status: "Active" },
      { id: 3, name: "Sales", users: 5, permissions: "Orders, Customers", status: "Active" },
      { id: 4, name: "Content Editor", users: 2, permissions: "CMS, Blog, Media", status: "Active" },
    ],
    searchKeys: ["name", "permissions"],
    fields: [
      { key: "name", label: "Role Name", required: true },
      { key: "users", label: "Users Count", type: "number" },
      { key: "permissions", label: "Permissions", required: true, full: true },
      { key: "status", label: "Status", type: "select", options: ["Active", "Draft"] },
    ],
    columns: [
      { key: "name", label: "Role", render: (r) => <span className="font-medium flex items-center gap-2"><Shield size={14} className="text-champagne-dark" />{r.name}</span> },
      { key: "users", label: "Users", hide: "sm" },
      { key: "permissions", label: "Permissions", hide: "md" },
      { key: "status", label: "Status", badge: true },
    ],
  },
  users: {
    title: "Admin Users",
    singular: "Admin User",
    basePath: "/admin/users",
    idPrefix: "u",
    seed: adminUsers,
    searchKeys: ["name", "email", "role"],
    fields: [
      { key: "name", label: "Full Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "password", label: "Password", type: "password", required: true },
      { key: "role", label: "Role", type: "select", options: ["Super Admin", "Store Manager", "Sales", "Content Editor", "admin", "superadmin", "manager", "sales", "editor"] },
      { key: "phone", label: "Phone" },
      { key: "avatar", label: "Avatar", full: true, type: "image" },
      { key: "joined", label: "Joined Date" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Draft"] },
    ],
    columns: [
      {
        key: "name",
        label: "User",
        render: (r) => (
          <div>
            <p className="font-medium">{r.name}</p>
            <p className="text-xs text-noir/40">{r.email}</p>
          </div>
        ),
      },
      { key: "role", label: "Role", hide: "sm" },
      { key: "joined", label: "Joined", hide: "md" },
      { key: "status", label: "Status", badge: true },
    ],
  },
  categories: {
    title: "Categories",
    singular: "Category",
    basePath: "/admin/categories",
    idPrefix: "cat",
    description:
      "Jewellery types with attribute sets. Product add form adapts to the selected category (rings → sizes, necklaces → lengths).",
    seed: categoryStrip.map((c, i) => ({
      ...c,
      id: `cat-${i + 1}`,
      productCount:
        products.filter(
          (p) =>
            p.category.toLowerCase().includes(c.name.toLowerCase().slice(0, -1)) ||
            p.category === c.name
        ).length || 3,
    })),
    searchKeys: ["name", "slug", "jewelryType"],
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "slug", label: "Slug", required: true },
      {
        key: "jewelryType",
        label: "Jewellery type",
        type: "select",
        optionsApi: "/jewelry-types",
        optionsLabel: "name",
        optionsValue: "slug",
      },
      {
        key: "attributeCodes",
        label: "Attribute codes (comma-separated)",
        full: true,
      },
      {
        key: "variantAttribute",
        label: "Variant attribute code (e.g. ring_size)",
      },
      { key: "img", label: "Category image", full: true, type: "image" },
      { key: "productCount", label: "Product Count", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Draft"] },
    ],
    columns: [
      {
        key: "name",
        label: "Category",
        render: (r) => (
          <div className="flex items-center gap-3">
            {r.img ? (
              <img src={thumbSrc(r.img)} alt="" className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-noir/5" />
            )}
            <span className="font-medium">{r.name}</span>
          </div>
        ),
      },
      { key: "slug", label: "Slug", hide: "sm", render: (r) => <span className="font-mono text-xs">{r.slug}</span> },
      { key: "productCount", label: "Products", hide: "md" },
    ],
  },
  "jewelry-types": {
    title: "Jewellery Types",
    singular: "Jewellery Type",
    basePath: "/admin/jewelry-types",
    idPrefix: "jtype",
    description:
      "Manage jewellery type values. These appear as selectable options in the Category and Product forms.",
    seed: [],
    searchKeys: ["name", "slug"],
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "status", label: "Status", type: "select", options: ["Active", "Draft"] },
    ],
    columns: [
      {
        key: "name",
        label: "Name",
        render: (r) => <span className="font-medium">{r.name}</span>,
      },
      {
        key: "slug",
        label: "Slug",
        hide: "sm",
        render: (r) => <span className="font-mono text-xs">{r.slug}</span>,
      },
      { key: "status", label: "Status", badge: true },
    ],
  },
  stores: {
    title: "Stores",
    singular: "Store",
    basePath: "/admin/stores",
    idPrefix: "store",
    /** Empty seed — always load live list from API so add/delete uses real Mongo IDs */
    seed: [],
    description:
      "Add, edit, or delete boutique locations. Changes appear on the live /stores page (and Home store locator) after save. Page titles/labels are edited under CMS → Page Content → Stores.",
    searchKeys: ["city", "state", "address"],
    fields: [
      { key: "city", label: "City", required: true },
      { key: "state", label: "State", required: true },
      { key: "address", label: "Address", required: true, full: true, type: "textarea", rows: 2 },
      { key: "hours", label: "Hours", full: true },
      { key: "phone", label: "Phone" },
      { key: "mapUrl", label: "Google Maps URL", full: true },
      { key: "img", label: "Store image", full: true, type: "image" },
    ],
    columns: [
      {
        key: "img",
        label: "Photo",
        render: (r) =>
          r.img ? (
            <img
              src={thumbSrc(r.img)}
              alt=""
              className="w-12 h-12 rounded-lg object-cover bg-stone-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-stone-100" />
          ),
      },
      {
        key: "city",
        label: "Location",
        render: (r) => (
          <div>
            <p className="font-medium">{r.city}</p>
            <p className="text-xs text-noir/40">{r.state}</p>
          </div>
        ),
      },
      { key: "address", label: "Address", hide: "sm" },
      { key: "phone", label: "Phone", hide: "md" },
      { key: "hours", label: "Hours", hide: "lg" },
    ],
  },
  testimonials: {
    title: "Testimonials",
    singular: "Testimonial",
    basePath: "/admin/testimonials",
    idPrefix: "t",
    description: "Curate client stories shown on the homepage.",
    seed: testimonials.map((t, i) => ({ ...t, id: `t-${i + 1}` })),
    searchKeys: ["name", "location", "text"],
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "location", label: "Location", required: true },
      { key: "text", label: "Quote", type: "textarea", required: true, full: true },
      { key: "img", label: "Photo", full: true, type: "image" },
    ],
    columns: [
      {
        key: "name",
        label: "Client",
        render: (r) => (
          <div className="flex items-center gap-3">
            {r.img ? (
              <img src={thumbSrc(r.img)} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : null}
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-xs text-noir/40">{r.location}</p>
            </div>
          </div>
        ),
      },
      { key: "text", label: "Quote", hide: "sm", render: (r) => <span className="line-clamp-1 text-noir/60">{r.text}</span> },
    ],
  },
  orders: {
    title: "Orders",
    singular: "Order",
    basePath: "/admin/orders",
    idPrefix: "ORD",
    editPath: (id) => `/admin/orders/${id}/edit`,
    seed: adminOrders,
    searchKeys: ["id", "customer", "email"],
    filters: ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    filterKey: "status",
    fields: [
      { key: "id", label: "Order ID", required: true },
      { key: "customer", label: "Customer", required: true },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "date", label: "Date" },
      { key: "status", label: "Status", type: "select", options: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] },
      { key: "payment", label: "Payment Status", type: "select", options: ["Pending", "Paid", "Partial", "Refunded"] },
      { key: "paymentMethod", label: "Payment Method" },
      { key: "paymentId", label: "Payment ID" },
      { key: "awb", label: "AWB / Tracking" },
      { key: "courier", label: "Courier" },
      { key: "total", label: "Total (INR)", type: "number", required: true },
      { key: "shipping", label: "Shipping (INR)", type: "number" },
      { key: "address", label: "Address", type: "textarea", full: true },
    ],
    columns: [
      {
        key: "id",
        label: "Order",
        render: (r) => (
          <Link to={`/admin/orders/${r.id}`} className="font-medium text-champagne-dark hover:underline">
            {r.id || r.orderNumber}
          </Link>
        ),
      },
      { key: "customer", label: "Customer" },
      { key: "date", label: "Date", hide: "sm" },
      { key: "status", label: "Status", badge: true },
      {
        key: "payment",
        label: "Payment",
        badge: true,
        hide: "md",
      },
      {
        key: "paymentMethod",
        label: "Gateway",
        hide: "lg",
        render: (r) => (
          <span className="text-xs text-noir/55">{r.paymentLabel || r.paymentMethod || "—"}</span>
        ),
      },
      { key: "total", label: "Total", align: "right", render: (r) => formatPrice(Number(r.total) || 0) },
    ],
  },
  media: {
    title: "Media Library",
    singular: "Media",
    basePath: "/admin/media",
    idPrefix: "media",
    seed: [
      { id: 1, name: "hero-bridal.jpg", url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=400", type: "Image", size: "1.2 MB", used: "Home Hero" },
      { id: 2, name: "logo.png", url: "", type: "Image", size: "44 KB", used: "Brand" },
      { id: 3, name: "amiel-choker.jpg", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400", type: "Image", size: "890 KB", used: "Product" },
      { id: 4, name: "store-bandra.jpg", url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=400", type: "Image", size: "1.1 MB", used: "Stores" },
    ],
    searchKeys: ["name", "used", "type"],
    fields: [
      { key: "name", label: "File Name", required: true },
      { key: "type", label: "Type", type: "select", options: ["Image", "Video", "Document"] },
      { key: "url", label: "File / image", full: true, type: "image" },
      { key: "size", label: "Size" },
      { key: "used", label: "Used In" },
    ],
    columns: [
      {
        key: "name",
        label: "File",
        render: (r) => (
          <div className="flex items-center gap-3">
            {r.url ? (
              <img src={thumbSrc(r.url)} alt="" className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-noir/5" />
            )}
            <span className="font-medium">{r.name}</span>
          </div>
        ),
      },
      { key: "type", label: "Type", hide: "sm" },
      { key: "size", label: "Size", hide: "md" },
      { key: "used", label: "Used In", hide: "lg" },
    ],
  },
};
