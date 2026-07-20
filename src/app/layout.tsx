import type { Metadata, Viewport } from "next";
import { LocaleProvider } from "@/lib/locale";
import { NavTracker } from "@/components/NavTracker";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Strength Path",
    template: "%s · Strength Path",
  },
  description:
    "Strength coach with English + Cantonese coaching, form demos, and guided workouts.",
  applicationName: "Strength Path",
  appleWebApp: {
    capable: true,
    title: "Strength Path",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Strength Path",
    description: "Learn form. Get stronger. English + 粵語.",
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
    /* min-h only — never h-full, or the page locks to viewport height and clips */
    <html lang="en" className="min-h-full">
      <body className="min-h-full antialiased af-body">
        <LocaleProvider>
          <NavTracker />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
