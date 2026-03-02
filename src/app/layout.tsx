import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { CartProvider } from "../hooks/useCart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "L&M CHIC | 🎀 Donde los mejores detalles y regalos se complementan ✨",
  description: "'L&M Chic' es una empresa local operando en Villa del Rosario, siempre a la orden del día con la mejor calidad artesanal en ropa, regalos, arreglos florales, juguetería, accesorios y muchísimo más. Realiza tu pedido, dinos qué te gusta, o lo que a ella le gusta (😉) y nosotros nos encargaremos de hacerlo mágico. Nos encontramos ubicados bajando la Calle 18 de Octubre, Casco Central, detrás de la U.E.P. José María Rivas. Ven ¡Estamos esperandote!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hostGrotesk.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
