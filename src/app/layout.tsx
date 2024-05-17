import type { Metadata } from "next";
import { Wix_Madefor_Text } from "next/font/google";
import "./globals.css";
import { LibraryProvider } from "@/context/libraryContext";

const wix = Wix_Madefor_Text({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Spotify",
  description:
    "Spotify is a digital music service that gives you access to millions of songs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </head>
      <LibraryProvider>
        <body className={wix.className}>{children}</body>
      </LibraryProvider>
    </html>
  );
}
