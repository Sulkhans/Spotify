import type { Metadata } from "next";
import { Wix_Madefor_Text } from "next/font/google";
import { UserProvider } from "@/utils/context";
import "./globals.css";

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
      <body className={wix.className}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
