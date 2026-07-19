import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Strength Path — Learn form, get stronger",
    template: "%s · Strength Path",
  },
  description:
    "Mobile React workout coach: pattern-based teaching, playable form demos, and guided strength sessions.",
  applicationName: "Strength Path",
  appleWebApp: {
    capable: true,
    title: "Strength Path",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Strength Path",
    description: "Learn movement patterns, watch form demos, train step by step.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1220",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
