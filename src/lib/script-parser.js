/**
 * Parses a string of HTML and extracts script, noscript, meta, and link tags.
 * This is server/client-neutral and does not import any database models.
 */
export function parseScriptTags(html) {
  if (!html) return [];
  const tags = [];
  
  // Clean comments first
  const cleanHtml = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // Regex to match script, noscript, meta, link tags
  const tagRegex = /<(script|noscript|meta|link)([^>]*?)(?:\/>|>([\s\S]*?)<\/\1>|>)/gm;
  
  let match;
  while ((match = tagRegex.exec(cleanHtml)) !== null) {
    const tagName = match[1].toLowerCase();
    let attrString = match[2];
    let content = match[3] || '';
    
    // Clean trailing slash for self-closing tags if present
    if (attrString.endsWith('/')) {
      attrString = attrString.slice(0, -1);
    }
    
    // Parse attributes
    const attrs = {};
    const attrRegex = /([a-zA-Z0-9:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      const name = attrMatch[1];
      const value = attrMatch[2] !== undefined ? attrMatch[2] : (attrMatch[3] !== undefined ? attrMatch[3] : (attrMatch[4] !== undefined ? attrMatch[4] : true));
      
      const reactName = name === 'class' ? 'className' : name;
      attrs[reactName] = value;
    }
    
    tags.push({ tagName, attrs, content });
  }
  return tags;
}
