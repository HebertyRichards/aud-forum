import Image from "next/image";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("pages.about");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 font-sans text-center text-white">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <Image
            src="/about.png"
            alt="Logo da Família Auditore"
            width={420}
            height={420}
            className="w-48 md:w-64 h-auto mx-auto rounded-full shadow-lg"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("title")}</h1>
        <p className="text-lg md:text-xl leading-relaxed text-justify">
          {t("description1")}
          <br />
          <br />
          {t("description2")}
        </p>
      </div>
    </main>
  );
}
