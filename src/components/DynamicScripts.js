'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Handles page-specific script injection.
 * Global scripts are handled separately in layout.js (<head>) and Footer.js (<footer>).
 */
export default function DynamicScripts() {
  const pathname = usePathname();
  const [pageScripts, setPageScripts] = useState({ header: '', footer: '' });

  // Handle Page-Specific Scripts Fetching
  useEffect(() => {
    async function fetchPageScripts() {
      try {
        const res = await fetch(`/api/seo?path=${pathname}`);
        const result = await res.json();
        if (result.success && result.data && result.data.page_path !== 'GLOBAL') {
          setPageScripts({
            header: result.data.page_header || '',
            footer: result.data.page_footer || ''
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

  // Inject Page-Specific Scripts
  useEffect(() => {
    // 1. Page Header Scripts
    const existingHeader = document.querySelectorAll('.page-header-script');
    existingHeader.forEach(el => el.remove());

    if (pageScripts.header?.trim()) {
      const fragment = document.createRange().createContextualFragment(pageScripts.header);
      fragment.querySelectorAll('script').forEach(s => s.classList.add('page-header-script'));
      document.head.appendChild(fragment);
    }

    // 2. Page Footer Scripts
    const existingFooter = document.querySelectorAll('.page-footer-script');
    existingFooter.forEach(el => el.remove());

    if (pageScripts.footer?.trim()) {
      const target = document.getElementById('footer-scripts-hook') || document.body;
      const fragment = document.createRange().createContextualFragment(pageScripts.footer);
      fragment.querySelectorAll('script').forEach(s => s.classList.add('page-footer-script'));
      target.appendChild(fragment);
    }
  }, [pageScripts]);

  return null;
}
