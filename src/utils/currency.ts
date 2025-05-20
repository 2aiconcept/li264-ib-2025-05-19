export const formatCurrency = (
  value: number,
  currency: string = "EUR",
  locale: string = "fr-FR"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};
// Exemples d'utilisation:
// formatCurrency(1234.56);                     // "1 234,56 €" (par défaut)
// formatCurrency(1234.56, "USD", "en-US");     // "$1,234.56" (dollar américain)
// formatCurrency(1234.56, "GBP", "en-GB");     // "£1,234.56" (livre sterling)
// formatCurrency(1234.56, "JPY", "ja-JP");     // "￥1,235" (yen japonais)
