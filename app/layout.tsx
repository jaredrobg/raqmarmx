import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './Components/Header';
import { AuthProvider } from "./Context/AuthContext";
import { ShoppingBagProvider } from "./Context/ShoppingBagContext";
import Footer from "./Components/Footer";
import { WhatsAppButton } from "./Elements/Elements";
import DisableConsole from "./DisableConsole";
import ScrollToTop from "./Components/ScrollToTop";
import AvisoMantenimiento from "./Components/AvisoMantenimiento";
import { GlobalProvider } from "./Context/GlobalContext";
import SideMenu from "./Components/SideMenu";
import { ShoppingBagModule } from "./ShoppingBag/page";
import { Toaster } from 'react-hot-toast';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raqmar",
  description: "Tienda online de productos para la imagen personal y el estilo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet"></link>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <DisableConsole />

        <AuthProvider>
          <GlobalProvider>
          <ShoppingBagProvider>
            <Header />
            <SideMenu />
            <ShoppingBagModule />
            <ScrollToTop />
            {children}
            <Toaster
              position="top-center"
              containerStyle={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <WhatsAppButton />
            <AvisoMantenimiento />
            <Footer />
          </ShoppingBagProvider>
          </GlobalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
