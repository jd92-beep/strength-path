import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Strength Path",
    template: "%s · Strength Path",
  },
  description:
    "Apple Fitness–inspired strength coach: form demos, pattern lessons, and guided workouts on your phone.",
  applicationName: "Strength Path",
  appleWebApp: {
    capable: true,
    title: "Strength Path",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Strength Path",
    description: "Learn form. Get stronger. Built for iPhone browsers.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased af-body">{children}</body>
    </html>
  );
}
