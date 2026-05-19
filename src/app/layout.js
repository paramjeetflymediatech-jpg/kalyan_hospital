import { Orbitron, Outfit, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { getPageMetadata, getPageMetadataSync } from "@/lib/seo";
import HeadScript from "@/components/Seo/HeadScript"; 
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

export async function generateMetadata() {
  const seoData = await getPageMetadata('GLOBAL');
  if (!seoData) return {};

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: seoData.openGraph,
    twitter: seoData.twitter,
  };
}

function GlobalScripts({ position }) {
  const seoData = getPageMetadataSync('GLOBAL');
  if (!seoData) return null;
  if (position === 'header') {
    return <HeadScript html={seoData.global_header} />;
  } else {
    return <HeadScript html={seoData.global_footer} />;
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <GlobalScripts position="header" />
        <GlobalScripts position="footer" />
      </head>
      <body
        className={`${orbitron.variable} ${outfit.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
