export function formatTaka(amount: number): string {
  return `\u09F3${amount.toLocaleString("en-US")}`;
}

export function generateOrderNumber(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `YUM-${n}`;
}
