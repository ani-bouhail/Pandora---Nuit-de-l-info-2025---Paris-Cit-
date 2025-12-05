import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  title: "Pandora's Box - La Nuit de l'Info",
  description: "Retrouve la boite de Pandore...",
};

import { GameProvider } from "@/context/GameContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={cn(inter.variable, cinzel.variable, "font-sans antialiased bg-myth-dark text-myth-light overflow-x-hidden")}>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
