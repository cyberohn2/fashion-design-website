export async function generateOrderNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);

  return `ORD-${Date.now()}-${random}`;
}
