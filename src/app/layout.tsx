import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aster Dev",
  description: "Portfolio Website | Aster Dev | Supratim Chakraborty",
  openGraph: {
    title: "Aster Dev",
    description: "HI I'm Supratim Chakraborty aka Aster Dev & this is my Portfolio Website :)",
    url: "https://asterdev.vercel.app",
    siteName: "Asterdev",
    images: [
      {
        url: "https://asterdev.vercel.app/me.png",
        width: 1200,
        height: 630,
        alt: "Preview image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aster Dev",
    description: "Portfolio Website | Supratim Chakraborty",
    images: ["https://asterdev.vercel.app/me.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
