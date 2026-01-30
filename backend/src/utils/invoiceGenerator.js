const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateInvoice = (order) => {
  const invoiceDir = path.join(__dirname, "../invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

  const filePath = path.join(invoiceDir, `invoice-${order._id}.pdf`);
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Millet E-Commerce Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Invoice ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toDateString()}`);
  doc.text(`Payment Status: ${order.paymentStatus}`);
  doc.moveDown();

  doc.text("Customer Details:");
  doc.text(order.shippingAddress.fullName);
  doc.text(order.shippingAddress.phone);
  doc.text(
    `${order.shippingAddress.street}, ${order.shippingAddress.city}`
  );
  doc.text(
    `${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
  );
  doc.moveDown();

  doc.text("Items:");
  doc.moveDown(0.5);

  order.items.forEach((item, index) => {
  const productName = item.product
    ? item.product.name
    : "Product removed";

  doc.text(
    `${index + 1}. ${productName} | Qty: ${
      item.quantity
    } | ₹${item.price}`
  );
});


  doc.moveDown();
  doc.text(`Total Quantity: ${order.totalQuantity}`);
  doc.text(`Total Amount: ₹${order.totalPrice}`, { bold: true });

  doc.end();

  return filePath;
};
