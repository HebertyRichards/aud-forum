import type { Metadata, Viewport } from "next";
import Header from "@/templates/Header";
import Footer from "@/templates/Footer";
import "./globals.css";
import { AuthProvider } from "@/services/auth";
import { UserActivityTracker } from "@/services/activity";
import { Providers } from "./providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <div className="min-h-screen bg-slate-900">
            <AuthProvider>
              <UserActivityTracker />
              <Header />
              <Providers>{children}</Providers>
              <Footer />
            </AuthProvider>
          </div>
      </body>
    </html>
  );
}
