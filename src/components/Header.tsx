import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { site } from "@/lib/site";
import { CartButton } from "./CartButton";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const t = useTranslations("nav");
  return (
    <header className="border-b border-line bg-bone">
      <div className="container-wide flex items-center justify-between py-6">
        <Link href="/" className="font-serif text-2xl md:text-3xl tracking-wide">
          {site.artistName}
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-widest text-ink hover:text-accent transition"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <LocaleSwitcher />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
