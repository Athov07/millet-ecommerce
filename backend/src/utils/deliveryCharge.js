module.exports.calculateDeliveryCharge = (subtotal) => {
  if (subtotal >= 500) return 0;
  return 50;
};
