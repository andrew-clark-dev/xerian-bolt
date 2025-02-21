export const formatPrice = (price: number | null | undefined): string => {
  if (!price) {
    return '-';
  }
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(price / 100);
};