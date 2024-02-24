export default function generateOrderUniqueId() {
  const timestamp = String(Date.now());
  const randomPart = Math.random().toFixed(4).slice(-4);
  const combinedValue = timestamp + randomPart;

  const uniqueId = typeof BigInt === 'function' ? BigInt(combinedValue) : Number(combinedValue);

  return uniqueId.toString(36).toUpperCase();
}
