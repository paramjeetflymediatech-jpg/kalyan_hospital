import React from 'react';
import Script from 'next/script';
import { parseScriptTags } from '@/lib/script-parser';

export default function HeadScript({ html }) {
  if (!html) return null;

  const tags = parseScriptTags(html);

  return (
    <>
      {tags.map((tag, idx) => {
        const { tagName, attrs, content } = tag;
        const key = `${tagName}-${idx}`;

        // Map class to className for React compatibility
        const reactAttrs = { ...attrs };
        if (reactAttrs.class) {
          reactAttrs.className = reactAttrs.class;
          delete reactAttrs.class;
        }

        if (tagName === 'script') {
          return (
            <Script
              key={key}
              id={reactAttrs.id || key}
              strategy="afterInteractive"
              {...reactAttrs}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        }
        if (tagName === 'noscript') {
          return (
            <noscript
              key={key}
              {...reactAttrs}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        }
        if (tagName === 'meta') {
          return <meta key={key} {...reactAttrs} />;
        }
        if (tagName === 'link') {
          return <link key={key} {...reactAttrs} />;
        }
        return null;
      })}
    </>
  );
}