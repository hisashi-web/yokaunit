import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "YokaUnit - ユーザーの「あったらいいな」を実現するツール集",
    template: "%s | YokaUnit",
  },
  description: "SEO対策済みの便利なWebツールを多数公開中。あなたの「あったらいいな」も実現します。",
  keywords: ["Webツール", "無料ツール", "オンラインツール", "便利ツール", "YokaUnit"],
  authors: [{ name: "YokaUnit Team" }],
  creator: "YokaUnit",
  publisher: "YokaUnit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://yokaunit.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "YokaUnit - ユーザーの「あったらいいな」を実現するツール集",
    description: "SEO対策済みの便利なWebツールを多数公開中。あなたの「あったらいいな」も実現します。",
    url: "https://yokaunit.com",
    siteName: "YokaUnit",
    images: [
      {
        url: "/ogp/site-default.png",
        width: 1200,
        height: 630,
        alt: "YokaUnit - ユーザーの「あったらいいな」を実現するツール集",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YokaUnit - ユーザーの「あったらいいな」を実現するツール集",
    description: "SEO対策済みの便利なWebツールを多数公開中。あなたの「あったらいいな」も実現します。",
    images: ["/ogp/site-default.png"],
    creator: "@yokaunit",
    site: "@yokaunit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
