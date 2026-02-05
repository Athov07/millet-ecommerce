const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateInvoice = (order) => {
  const invoiceDir = path.join(__dirname, "../invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

  const filePath = path.join(invoiceDir, `invoice-${order._id}.pdf`);
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  /* ---------- HEADER ---------- */
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("Millet E-Commerce", { align: "center" });

  doc
    .fontSize(12)
    .font("Helvetica")
    .text("Invoice", { align: "center" });

  doc.moveDown(2);

  /* ---------- INVOICE META ---------- */
  const topY = doc.y;

  doc
    .fontSize(10)
    .text(`Invoice ID: ${order._id}`, 50, topY)
    .text(`Date: ${new Date(order.createdAt).toDateString()}`, 50, topY + 15)
    .text(`Payment Status: ${order.paymentStatus}`, 50, topY + 30);

  doc.moveDown(4);

  /* ---------- CUSTOMER DETAILS ---------- */
  doc.fontSize(12).font("Helvetica-Bold").text("Bill To");

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(order.shippingAddress.fullName)
    .text(order.shippingAddress.phone)
    .text(`${order.shippingAddress.street}, ${order.shippingAddress.city}`)
    .text(`${order.shippingAddress.state} - ${order.shippingAddress.pincode}`);

  doc.moveDown(2);

  /* ---------- TABLE HEADER ---------- */
  const tableTop = doc.y;
  const srX = 50;
  const itemX = 90;
  const qtyX = 350;
  const priceX = 430;

  doc.font("Helvetica-Bold").fontSize(11);

  doc
    .text("Sr No", srX, tableTop)
    .text("Item", itemX, tableTop)
    .text("Qty", qtyX, tableTop)
    .text("Price", priceX, tableTop);

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  /* ---------- TABLE ROWS ---------- */
  doc.font("Helvetica").fontSize(10);
  let y = tableTop + 25;
  let itemsTotal = 0;

  order.items.forEach((item, index) => {
    const productName = item.product ? item.product.name : "Product removed";
    const itemTotal = item.price * item.quantity;
    itemsTotal += itemTotal;

    doc
      .text(index + 1, srX, y)
      .text(productName, itemX, y, { width: 240 })
      .text(item.quantity.toString(), qtyX, y)
      .text(`₹${itemTotal}`, priceX, y);

    y += 20;
  });

  doc.moveDown(2);

  /* ---------- TOTALS ---------- */
  const deliveryCharge = order.deliveryCharge || 0;
  const grandTotal = itemsTotal + deliveryCharge;

  doc
    .font("Helvetica")
    .fontSize(11)
    .text(`Items Total: ₹${itemsTotal}`, 350, y + 10, { align: "right" })
    .text(`Delivery Charges: ₹${deliveryCharge}`, 350, y + 30, {
      align: "right",
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(`Grand Total: ₹${grandTotal}`, 350, y + 55, {
      align: "right",
    });

  doc.moveDown(4);

  /* ---------- FOOTER ---------- */
  doc
    .fontSize(9)
    .font("Helvetica")
    .text(
      "Thank you for shopping with Millet E-Commerce!",
      { align: "center" }
    );

  doc.end();

  return filePath;
};
