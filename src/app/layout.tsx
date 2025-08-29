import type { Metadata, Viewport } from "next";
import Header from "@/templates/Header";
import Footer from "@/templates/Footer";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/services/auth";
import { UserActivityTracker } from "@/services/activity";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gray-300 dark:bg-gray-900">
            <AuthProvider>
              <UserActivityTracker />
              <Header />
              {children}
              <Footer />
            </AuthProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
