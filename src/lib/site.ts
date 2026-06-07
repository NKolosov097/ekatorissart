// Static, locale-independent site config. Translatable strings live in
// src/i18n/messages/{locale}.json.

type NavKey = "shop" | "about" | "contact"

interface NavItem {
  href: string
  key: NavKey
}

interface SiteConfig {
  name: string
  url: string
  artistName: string
  email: string
  instagram: string
  defaultCurrency: string
  nav: ReadonlyArray<NavItem>
}

export const site: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Ekatoris Art",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  artistName: "Ekatorissart",
  email: "ekatorissart@outlook.com",
  instagram: "https://instagram.com/ekatorissart",
  defaultCurrency: "USD",
  nav: [
    { href: "/shop", key: "shop" },
    { href: "/about", key: "about" },
    { href: "/contact", key: "contact" },
  ],
}
