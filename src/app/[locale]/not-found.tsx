import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("pages.notFound");

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Alert
        variant="destructive"
        className="max-w-lg w-full bg-slate-800 border-slate-700"
      >
        <AlertTitle className="text-2xl font-bold">{t("title")}</AlertTitle>
        <AlertDescription className="mt-4">
          <p className="mb-4">{t("description")}</p>
          <Button
            asChild
            className="bg-slate-700 border border-slate-600 hover:bg-slate-600"
          >
            <Link href="/">{t("backHome")}</Link>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
