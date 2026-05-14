'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DynamicScripts({ globalHeader, globalFooter }) {
  const pathname = usePathname();
  const [pageScripts, setPageScripts] = useState({ header: '', footer: '' });

  useEffect(() => {
    // Fetch page-specific scripts when pathname changes
    async function fetchPageScripts() {
      try {
        const res = await fetch(`/api/seo?path=${pathname}`);
        const result = await res.json();
        if (result.success && result.data && result.data.page_path !== 'GLOBAL') {
          setPageScripts({
            header: result.data.header_scripts || '',
            footer: result.data.footer_scripts || ''
          });
        } else {
          setPageScripts({ header: '', footer: '' });
        }
      } catch (error) {
        console.error('Error fetching page scripts:', error);
      }
    }

    if (pathname && pathname !== '/admin') {
      fetchPageScripts();
    }
  }, [pathname]);

  return (
    <>
      {/* Header Scripts */}
      {(globalHeader || pageScripts.header) && (
        <div 
          id="header-scripts"
          dangerouslySetInnerHTML={{ __html: (globalHeader || '') + '\n' + (pageScripts.header || '') }} 
        />
      )}
      
      {/* Footer Scripts Wrapper - this will be moved to the end of body by layout */}
      <div 
        id="footer-scripts-container"
        className="hidden"
        data-footer-content={(globalFooter || '') + '\n' + (pageScripts.footer || '')}
      />
    </>
  );
}
