import type { Metadata } from "next";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletContextProvider";

export const metadata: Metadata = {
  title: "Token Minter - Create Gorbagana SPL Tokens",
  description: "Easy-to-use SPL Token-2022 creation service on Gorbagana. Create your own tokens with just a few clicks.",
  keywords: ["Gorbagana", "GOR", "SPL Token", "Token-2022", "Cryptocurrency", "Blockchain"],
  authors: [{ name: "cyouindream", url: "https://x.com/cyouindream" }],
  openGraph: {
    title: "Token Minter - Create Gorbagana SPL Tokens",
    description: "Create your own SPL Token-2022 on Gorbagana blockchain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
