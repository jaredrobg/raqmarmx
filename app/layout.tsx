import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './Components/Header';
import { AuthProvider } from "./Context/AuthContext";
import { ShoppingBagProvider } from "./Context/ShoppingBagContext";
import Footer from "./Components/Footer";
import { WhatsAppButton, LocationButton } from "./Elements/Elements";
import DisableConsole from "./DisableConsole";
import ScrollToTop from "./Components/ScrollToTop";
import AvisoMantenimiento from "./Components/AvisoMantenimiento";
import { GlobalProvider } from "./Context/GlobalContext";
import SideMenu from "./Components/SideMenu";
import { ShoppingBagModule } from "./ShoppingBag/page";
import { Toaster } from 'react-hot-toast';
import SearchButton from './Components/SearchButton';
import Script from 'next/script';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
    title: {
        default: "Raqmar",
        template: "%s | Raqmar", // ← así cada página solo pone su título y se agrega "| Raqmar" automático
    },
    description: "Fragancias y lentes solares de calidad al mejor precio en México.",
    metadataBase: new URL("https://raqmarmx.com"),
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
        {/* Meta Pixel Code */}
       <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}
            (window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '3157761421086989');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript><img height="1" width="1" style={{ display: "none" }}
        src="https://www.facebook.com/tr?id=3157761421086989&ev=PageView&noscript=1"
        /></noscript>
{/* <!-- End Meta Pixel Code --> */}
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
            <SearchButton />
            <WhatsAppButton />
            <LocationButton />
            <AvisoMantenimiento />
            <Footer />
          </ShoppingBagProvider>
          </GlobalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
