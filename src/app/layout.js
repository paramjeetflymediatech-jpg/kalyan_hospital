import { Orbitron, Outfit, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Kalyan Robotic Hospital | Punjab's Future of AI Robotic Knee Replacement",
  description: "Experience the world's most advanced AI-powered robotic knee replacement surgery at Kalyan Robotic Hospital. Precision, faster recovery, and personalized care.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

import { getPageMetadata } from "@/lib/seo";
import DynamicScripts from "@/components/DynamicScripts";

export default async function RootLayout({ children }) {
  const globalSeo = await getPageMetadata('GLOBAL');
  
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${orbitron.variable} ${outfit.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        <DynamicScripts 
          globalHeader={globalSeo?.header_scripts} 
          globalFooter={globalSeo?.footer_scripts} 
        />
        {children}
      </body>
    </html>
  );
}
