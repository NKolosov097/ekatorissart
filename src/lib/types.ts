export type ArtworkStatus = "AVAILABLE" | "SOLD";

export type ArtworkKind = "ORIGINAL" | "PRINT";

export type Medium =
  | "OIL"
  | "ACRYLIC"
  | "WATERCOLOR"
  | "GOUACHE"
  | "PASTEL"
  | "MIXED";

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: Medium;
  surface: string;
  widthCm: number;
  heightCm: number;
  priceCents: number;
  currency: string;
  status: ArtworkStatus;
  kind: ArtworkKind;
  description?: string;
  story?: string;
  tags: string[];
  primaryImage: string;
  images: string[];
  framed: boolean;
  featured: boolean;
  publishedAt: string | null;
}

export interface CartLine {
  artworkId: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  image: string;
}
