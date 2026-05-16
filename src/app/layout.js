import { Orbitron, Outfit, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { getPageMetadata } from "@/lib/seo";
import RenderTags from "@/components/RenderTags";

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

export default async function RootLayout({ children }) {
  const seoData = await getPageMetadata('GLOBAL');
  
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Global Header Scripts */}
        <RenderTags tags={seoData?.global_header_tags} useStandardTags={true} />
        {/* Global Footer Scripts (Moved to head as per user request) */}
        <RenderTags tags={seoData?.global_footer_tags} useStandardTags={true} />
      </head>
      <body
        className={`${orbitron.variable} ${outfit.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
