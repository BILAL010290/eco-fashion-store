export const formatPrice = (price) => {
  const formatter = new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatted = formatter.format(price);
  // Remplacer le format par défaut par notre format personnalisé
  return formatted.replace('MAD', 'DHS').trim();
};
