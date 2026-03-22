import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PatientNotes — Clinical Notes, Simplified",
  description:
    "Secure, AI-assisted clinical note-taking for modern healthcare providers.",
  icons: {
    icon: [
      // SVG first — modern browsers (Chrome 80+, Firefox 41+, Safari 12+)
      { url: "/favicon.svg", type: "image/svg+xml" },
      // PNG fallback
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
      // Legacy ICO — caught by any browser that ignores the above
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  themeColor: "#228B22",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
