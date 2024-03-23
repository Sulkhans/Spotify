import type { Metadata } from "next";
import { Wix_Madefor_Text } from "next/font/google";
import "./globals.css";

const wix = Wix_Madefor_Text({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Spotify",
  description: "Next.js spotify clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/spotify.svg" />
      </head>
      <body className={wix.className}>{children}</body>
    </html>
  );
}
