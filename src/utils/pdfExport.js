import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Export a table of rows to PDF
 */
export function exportTablePdf({
  title,
  subtitle = "",
  headers,
  rows,
  filename,
}) {
  const doc = new jsPDF({ orientation: rows[0]?.length > 5 ? "landscape" : "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFillColor(15, 13, 11);
  doc.rect(0, 0, pageW, 28, "F");
  doc.setTextColor(198, 166, 100);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title || "Export", 14, 18);

  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  if (subtitle) doc.text(subtitle, 14, 36);
  doc.text(`Generated ${new Date().toLocaleString("en-IN")}`, 14, subtitle ? 42 : 36);

  autoTable(doc, {
    startY: subtitle ? 48 : 42,
    head: [headers],
    body: rows,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: {
      fillColor: [15, 13, 11],
      textColor: [198, 166, 100],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [251, 248, 243] },
    margin: { left: 14, right: 14 },
  });

  const name = filename || `${(title || "export").toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.pdf`;
  doc.save(name);
}

function formatInr(n) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);
  } catch {
    return `₹${n}`;
  }
}

/**
 * Full tax invoice PDF — order + invoice + business settings + split/tax/shipping.
 * @param {object} order
 * @param {object} [opts]
 * @param {object} [opts.business] from useSettingsStore.business
 * @param {object} [opts.invoice] optional Invoice row { invoiceNumber, date, status, amount }
 * @param {object} [opts.commerce] tax notes
 */
export function exportInvoicePdf(order, opts = {}) {
  const business = opts.business || {};
  const invoice = opts.invoice || {};
  const commerce = opts.commerce || {};
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const brand = business.businessName || business.legalName || "Madhu Jewellery";
  const orderId = order.orderNumber || order.id || "—";
  const invNo =
    invoice.invoiceNumber ||
    order.invoiceNumber ||
    `INV-${String(orderId).replace(/^ORD-?/i, "")}`;
  const date =
    invoice.date ||
    order.date ||
    (order.createdAt ? new Date(order.createdAt).toISOString().slice(0, 10) : "—");

  // Header
  doc.setFillColor(15, 13, 11);
  doc.rect(0, 0, pageW, 36, "F");
  doc.setTextColor(198, 166, 100);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(brand, 14, 16);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("TAX INVOICE", 14, 24);
  doc.text(business.tagline || "Handcrafted luxury", 14, 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(invNo, pageW - 14, 16, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Order ${orderId}`, pageW - 14, 22, { align: "right" });
  doc.text(`Date ${date}`, pageW - 14, 28, { align: "right" });

  // Seller / buyer
  doc.setTextColor(30, 30, 30);
  let y = 46;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("From (Seller)", 14, y);
  doc.text("Bill / Ship To", pageW / 2, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  y += 5;

  const sellerLines = [
    business.legalName || brand,
    business.address,
    [business.city, business.state, business.pincode].filter(Boolean).join(", "),
    business.country,
    business.gstin ? `GSTIN: ${business.gstin}` : commerce.gstin ? `GSTIN: ${commerce.gstin}` : "",
    business.supportEmail || "",
    business.supportPhone || "",
  ].filter(Boolean);

  const buyerLines = [
    order.customer || "Customer",
    order.email || "",
    order.phone || "",
    order.address || "",
  ].filter(Boolean);

  const leftBlock = doc.splitTextToSize(sellerLines.join("\n"), pageW / 2 - 20);
  const rightBlock = doc.splitTextToSize(buyerLines.join("\n"), pageW / 2 - 20);
  doc.text(leftBlock, 14, y);
  doc.text(rightBlock, pageW / 2, y);
  y += Math.max(leftBlock.length, rightBlock.length) * 4 + 8;

  // Meta row
  doc.setFontSize(8);
  const meta = [
    `Status: ${order.status || "—"}`,
    `Payment: ${order.payment || "—"} · ${order.paymentLabel || order.paymentMethod || "—"}`,
  ];
  if (order.paymentId) meta.push(`Txn: ${order.paymentId}`);
  if (order.razorpayOrderId) meta.push(`Razorpay: ${order.razorpayOrderId}`);
  if (order.couponCode) meta.push(`Coupon: ${order.couponCode}`);
  if (order.awb) meta.push(`AWB: ${order.awb}${order.courier ? ` (${order.courier})` : ""}`);
  const metaLines = doc.splitTextToSize(meta.join("  |  "), pageW - 28);
  doc.setTextColor(80, 80, 80);
  doc.text(metaLines, 14, y);
  y += metaLines.length * 4 + 6;

  // Line items
  const items = (order.items || []).map((it) => {
    const qty = Number(it.qty) || 1;
    const price = Number(it.price) || 0;
    const line = price * qty;
    const payNote =
      it.paymentType === "partial"
        ? `Split · adv ${formatInr(it.advanceAmount || 0)}`
        : "Full";
    return [
      it.name || it.productId || "Item",
      it.variantSku || "—",
      String(qty),
      formatInr(price),
      payNote,
      formatInr(line),
    ];
  });

  if (!items.length) {
    items.push(["Merchandise", "—", "1", formatInr(order.total || 0), "Full", formatInr(order.total || 0)]);
  }

  autoTable(doc, {
    startY: y,
    head: [["Item", "SKU / Size", "Qty", "Unit", "Pay", "Amount"]],
    body: items,
    headStyles: { fillColor: [15, 13, 11], textColor: [198, 166, 100], fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    columnStyles: {
      2: { halign: "center" },
      3: { halign: "right" },
      5: { halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  let finalY = doc.lastAutoTable?.finalY || y + 40;

  const subtotal =
    Number(order.subtotal) ||
    (order.items || []).reduce(
      (s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1),
      0
    );
  const discount = Number(order.discount) || 0;
  const shipping = Number(order.shipping) || 0;
  const tax = Number(order.tax) || 0;
  const total = Number(order.total) || subtotal - discount + shipping + tax;
  const advance = Number(order.advancePaid) || 0;
  const balance = Number(order.balanceDue) || 0;

  const totals = [
    ["Subtotal", formatInr(subtotal)],
  ];
  if (discount > 0) totals.push([`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`, `−${formatInr(discount)}`]);
  if (shipping > 0) totals.push(["Shipping", formatInr(shipping)]);
  else totals.push(["Shipping", "Complimentary"]);
  if (tax > 0) {
    totals.push([
      `Tax${order.taxLabel ? ` · ${order.taxLabel}` : commerce.taxNote ? ` · ${commerce.taxNote}` : ""}`,
      formatInr(tax),
    ]);
  }
  totals.push(["Grand Total", formatInr(total)]);
  if (order.paymentType === "partial" || advance > 0 || balance > 0) {
    totals.push(["Paid / Advance", formatInr(advance || (order.payment === "Paid" ? total : 0))]);
    totals.push(["Balance due", formatInr(balance)]);
  }

  autoTable(doc, {
    startY: finalY + 4,
    body: totals,
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: pageW - 100, right: 14 },
    didParseCell(data) {
      if (data.row.index === totals.length - (balance > 0 || advance > 0 ? 3 : 1)) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 11;
      }
    },
  });

  finalY = doc.lastAutoTable?.finalY || finalY + 40;

  doc.setTextColor(90, 90, 90);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  const notes = [
    "This is a computer-generated tax invoice.",
    commerce.taxNote || "Prices as per boutique policy; jewellery may include making charges.",
    "For support contact " +
      (business.supportEmail || "care@madhujewellery.com") +
      (business.supportPhone ? ` · ${business.supportPhone}` : ""),
    "Thank you for choosing " + brand + ".",
  ];
  doc.text(doc.splitTextToSize(notes.join("\n"), pageW - 28), 14, finalY + 12);

  doc.save(`invoice-${invNo}-${orderId}.pdf`);
}

/** Build PDF rows from object array using column keys */
export function rowsFromObjects(objects, keys) {
  return (objects || []).map((obj) =>
    keys.map((k) => {
      const v = obj[k];
      if (v == null) return "";
      if (typeof v === "boolean") return v ? "Yes" : "No";
      if (typeof v === "object") return JSON.stringify(v);
      return String(v);
    })
  );
}
