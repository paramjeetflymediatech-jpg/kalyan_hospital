'use client';

import { useEffect, useRef } from 'react';

/**
 * Injects scripts into the <head> tag.
 */
export function GlobalHeaderHandler({ scripts }) {
  const injected = useRef(false);

  useEffect(() => {
    if (!scripts || injected.current) return;
    
    // Cleanup existing global header scripts
    const existing = document.querySelectorAll('.global-header-script');
    existing.forEach(el => el.remove());

    const fragment = document.createRange().createContextualFragment(scripts);
    fragment.querySelectorAll('script').forEach(s => s.classList.add('global-header-script'));
    document.head.appendChild(fragment);
    
    injected.current = true;
  }, [scripts]);

  return null;
}

/**
 * Injects scripts into the footer or bottom of body.
 */
export function GlobalFooterHandler({ scripts }) {
  const injected = useRef(false);

  useEffect(() => {
    if (!scripts || injected.current) return;

    // Try to find the hook, then the footer, then fallback to body
    const target = document.getElementById('footer-scripts-hook') || document.querySelector('footer') || document.body;
    
    // Cleanup existing global footer scripts
    const existing = document.querySelectorAll('.global-footer-script');
    existing.forEach(el => el.remove());

    const fragment = document.createRange().createContextualFragment(scripts);
    fragment.querySelectorAll('script').forEach(s => s.classList.add('global-footer-script'));
    target.appendChild(fragment);
    
    injected.current = true;
  }, [scripts]);

  return null;
}
