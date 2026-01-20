import { Link } from "@/i18n/navigation";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { version } from "../../package.json";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const AUTHOR = "HebertyRichards";

  return (
    <footer className="border-t border-slate-700 mt-12 bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/header.png"
                  alt="Footer Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </Link>
              <div>
                <h3 className="text-xl font-bold">{t("auditore")}</h3>
                <p className="text-sm text-gray-300">{t("since")}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {t("slogan")}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-blue-500 transition-colors text-sm"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/members-list"
                  className="text-gray-300 hover:text-blue-500 transition-colors text-sm"
                >
                  {t("membersList")}
                </Link>
              </li>
              <li>
                <Link
                  href="/topics"
                  className="text-gray-300 hover:text-blue-500 transition-colors text-sm"
                >
                  {t("categories")}
                </Link>
              </li>
              <li>
                <Link
                  href="/topics/subscribes"
                  className="text-gray-300 hover:text-blue-500 transition-colors text-sm"
                >
                  {t("recruitment")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("categories")}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/topics/downloads"
                  className="text-gray-300 hover:text-blue-500 transition-colors text-sm"
                >
                  {t("downloads")}
                </Link>
              </li>
              <li>
                <Link
                  href="/topics/general-discussions"
                  className="text-gray-300 hover:text-blue-500 transition-colors text-sm"
                >
                  {t("generalDiscussions")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-blue-500 transition-colors text-sm"
                >
                  {t("familyHistory")}
                </Link>
              </li>
              <li>
                <Link
                  href="/topics/manuals"
                  className="text-gray-300 hover:text-blue-500 transition-colors text-sm"
                >
                  {t("manuals")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} {t("auditore")}. {t("allRightsReserved")} <span className="text-gray-600 ml-2">v{version}</span></p>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>
              {t("developedBy")}{" "}
              <span className="font-bold text-blue-500">{AUTHOR}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
