import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/templates/Header";
import Footer from "@/templates/Footer";
import "./globals.css";
import { AuthProvider } from "@/providers/auth";
import { OnlineUserProvider } from "@/providers/online";
import { Providers } from "@/providers/providers";
import { routing, Locale } from "@/i18n/routing";

export const metadata: Metadata = {
  title: {
    default: "Auditore Family",
    template: "Auditore Family - %s",
  },
  description:
    "Fórum da Família Auditore, venha conhecer a nossa comunidade e nossa família",
  openGraph: {
    title: "Auditore Family",
    description:
      "Fórum da Família Auditore, venha conhecer a nossa comunidade e nossa família",
    siteName: "Auditore Family",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  keywords: [
    "Auditore",
    "Auditore Samp",
    "gta samp",
    "brasil play shox",
    "aizen auditore",
    "krauzim auditore",
    "auditore family",
  ],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  category: "gaming",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale: requestedLocale } = await params;

  const locale: Locale = routing.locales.includes(requestedLocale as Locale)
    ? (requestedLocale as Locale)
    : routing.defaultLocale;

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <div className="min-h-screen bg-slate-900">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <AuthProvider>
                <OnlineUserProvider>
                  <Header />
                  {children}
                  <Footer />
                </OnlineUserProvider>
              </AuthProvider>
            </Providers>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}

