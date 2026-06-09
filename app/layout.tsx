import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KEssiFLIX",
  description: "Assista juntos — mesmo estando longe.",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "KEssiFLIX" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,          // Prevent iOS zoom on input focus
  userScalable: false,
  viewportFit: "cover",     // Allow content under notch/home indicator
  themeColor: "#09090b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full bg-zinc-950 text-white antialiased overscroll-none">
        {children}
      </body>
    </html>
  );
}
