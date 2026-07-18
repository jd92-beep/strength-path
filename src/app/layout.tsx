import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Strength Path — Get stronger, step by step",
    template: "%s · Strength Path",
  },
  description:
    "Mobile-first workout coach: progressive strength paths, body-part training, and 1,300+ exercises with step-by-step teaching.",
  applicationName: "Strength Path",
  authors: [{ name: "Strength Path" }],
  openGraph: {
    title: "Strength Path",
    description: "Guided strength training from first push-up to barbell base.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#141a2a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
