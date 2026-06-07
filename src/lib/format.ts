export function formatPrice(
  cents: number,
  currency = "USD",
  locale = "en",
): string {
  return new Intl.NumberFormat(localeToTag(locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDimensions(
  widthCm: number,
  heightCm: number,
  locale = "en",
): string {
  const widthIn = (widthCm / 2.54).toFixed(1);
  const heightIn = (heightCm / 2.54).toFixed(1);
  const nf = new Intl.NumberFormat(localeToTag(locale));
  return `${nf.format(widthCm)} × ${nf.format(heightCm)} cm  ·  ${widthIn} × ${heightIn} in`;
}

export function mediumLabel(medium: string, locale = "en"): string {
  const maps: Record<string, Record<string, string>> = {
    en: {
      OIL: "Oil",
      ACRYLIC: "Acrylic",
      WATERCOLOR: "Watercolor",
      GOUACHE: "Gouache",
      PASTEL: "Pastel",
      MIXED: "Mixed media",
    },
    ru: {
      OIL: "Масло",
      ACRYLIC: "Акрил",
      WATERCOLOR: "Акварель",
      GOUACHE: "Гуашь",
      PASTEL: "Пастель",
      MIXED: "Смешанная техника",
    },
    ar: {
      OIL: "زيت",
      ACRYLIC: "أكريليك",
      WATERCOLOR: "ألوان مائية",
      GOUACHE: "غواش",
      PASTEL: "باستيل",
      MIXED: "خامات مختلطة",
    },
  };
  return maps[locale]?.[medium] ?? maps.en[medium] ?? medium;
}

function localeToTag(locale: string): string {
  if (locale === "ru") return "ru-RU";
  if (locale === "ar") return "ar-SA";
  return "en-US";
}
