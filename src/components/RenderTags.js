import Script from 'next/script';

/**
 * Renders parsed script and noscript tags safely for SSR and Hydration.
 * If useStandardTags is true, it renders standard <script> tags for better visibility 
 * in "View Source" (at the cost of some Next.js script optimizations).
 */
export default function RenderTags({ tags, useStandardTags = false }) {
  if (!tags || !Array.isArray(tags)) return null;
  
  return (
    <>
      {tags.map((tag, i) => {
        const { tagName, attrs, content } = tag;
        
        if (tagName === 'noscript') {
          return (
            <noscript 
              key={`noscript-${i}`} 
              {...attrs} 
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          );
        }
        
        if (tagName === 'script') {
          if (useStandardTags) {
            return (
              <script
                key={`script-std-${i}`}
                {...attrs}
                dangerouslySetInnerHTML={attrs.src ? undefined : { __html: content || '' }}
              />
            );
          }

          // If the script has a src attribute, it shouldn't have inline content
          if (attrs.src) {
            return (
              <Script
                key={`script-src-${i}`}
                {...attrs}
                strategy="afterInteractive"
              />
            );
          }

          // For inline scripts, use next/script with content as children
          return (
            <Script
              key={`script-inline-${i}`}
              id={`script-inline-${i}`}
              {...attrs}
              strategy="afterInteractive"
            >
              {content}
            </Script>
          );
        }

        return null;
      })}
    </>
  );
}
