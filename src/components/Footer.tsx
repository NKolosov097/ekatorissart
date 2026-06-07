import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { site } from "@/lib/site";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="mt-24 border-t border-line bg-bone">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="font-serif text-xl">{site.artistName}</div>
          <p className="mt-3 text-sm text-muted max-w-xs">{t("tagline")}</p>
        </div>

        <div>
          <div className="eyebrow mb-4">{t("explore")}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shop" className="link-quiet">
                {tNav("shop")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="link-quiet">
                {tNav("about")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="link-quiet">
                {tNav("contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">{t("studio")}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="link-quiet">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-wide flex flex-col gap-2 py-6 text-xs text-muted md:flex-row md:justify-between">
          <span>{t("rights", { year: new Date().getFullYear(), artist: site.artistName })}</span>
          <span>{t("made")}</span>
        </div>
      </div>
    </footer>
  );
}
