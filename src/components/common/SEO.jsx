import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { safeJsonLdStringify, sanitizeUrl } from '../../utils/security';

const DEFAULT_TITLE = 'Gazet | Smart Gadgets & Electronics in Bangladesh';
const DEFAULT_DESCRIPTION = 'Discover premium gadgets, wireless earbuds, smartwatches, power banks, chargers and tech accessories with fast Cash on Delivery across Bangladesh.';
const SITE_NAME = 'Gazet';
const SITE_URL = 'https://gazet-bd.com';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80';

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  schema = null,
}) => {
  const location = useLocation();
  const rawCanonicalUrl = `${SITE_URL}${location.pathname}${location.search}`;
  const canonicalUrl = sanitizeUrl(rawCanonicalUrl) || SITE_URL;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

  useEffect(() => {
    // 1. Update Title safely
    document.title = fullTitle;

    // Helper to update or create meta tags safely
    const setMetaTag = (attrName, attrValue, content) => {
      // Escape selector characters to prevent querySelector syntax error or injection
      const safeAttrName = attrName.replace(/[^a-zA-Z0-9_-]/g, '');
      const safeAttrValue = attrValue.replace(/["\\]/g, '');
      let element = document.querySelector(`meta[${safeAttrName}="${safeAttrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(safeAttrName, safeAttrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content || '');
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // 3. Canonical Tag (sanitized against javascript: pseudo-protocols)
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', sanitizeUrl(image) || DEFAULT_IMAGE);
    setMetaTag('property', 'og:locale', 'en_US');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', sanitizeUrl(image) || DEFAULT_IMAGE);

    // 6. Structured Data (JSON-LD) - Hardened against </script> breakout injection
    let schemaScript = document.getElementById('seo-json-ld');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'seo-json-ld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = safeJsonLdStringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [fullTitle, description, keywords, canonicalUrl, image, type, noIndex, schema]);

  return null;
};
