import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { auth } from "@/lib/auth";
import { StructuredData, getOrganizationSchema, getWebSiteSchema } from "@/components/StructuredData";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "saif Your Complete ARC Raiders Companion",
    template: "%s | saif"
  },
  description: "Comprehensive guide for ARC Raiders including items database, traders, maps, marketplace, event timers, and latest strategies.",
  keywords: ["ARC Raiders", "saif", "game guide", "items", "traders", "marketplace", "maps", "quests", "gaming"],
  authors: [{ name: "saif Team" }],
  creator: "saif Team",
  publisher: "saif",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: ['en_US'],
    url: baseUrl,
    title: 'saif - Your Complete ARC Raiders Companion',
    description: 'Comprehensive guide for ARC Raiders including items database, traders, maps, marketplace, event timers, and latest strategies.',
    siteName: 'saif',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'ARC Raiders Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'saif - Your Complete ARC Raiders Companion',
    description: 'Comprehensive guide for ARC Raiders including items database, traders, maps, marketplace, event timers, and latest strategies.',
    images: [`${baseUrl}/og-image.jpg`],
    creator: '@saif',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ar" dir="rtl">
      <head>
        <StructuredData data={getOrganizationSchema(baseUrl)} />
        <StructuredData data={getWebSiteSchema(baseUrl)} />
      </head>
      <body
        className={`${cairo.variable} antialiased`}
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          minHeight: '100vh',
          fontFamily: 'var(--font-cairo)'
        }}
      >
        <SessionProvider session={session}>
          <ReactQueryProvider>
            <Navbar session={session} />
            <Sidebar />
            <main className="mr-14 mt-14">
              {children}
            </main>
            <div className="mr-14">
              <Footer />
            </div>
            <Toaster />
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
