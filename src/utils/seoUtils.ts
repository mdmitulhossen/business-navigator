/**
 * Helper function to generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQSchema structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Extract plain text from HTML
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate meta description from content (truncate to 160 chars)
 */
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  const plainText = stripHtmlTags(content);
  if (plainText.length <= maxLength) {
    return plainText;
  }
  return plainText.substring(0, maxLength).trim() + '...';
}

/**
 * Validate and generate social media URLs
 */
export function generateSocialMetadata(socialLinks: Record<string, string>) {
  const socialMetadata: Record<string, string> = {};

  if (socialLinks.facebook) {
    socialMetadata.facebook = socialLinks.facebook;
  }
  if (socialLinks.twitter) {
    socialMetadata.twitter = socialLinks.twitter;
  }
  if (socialLinks.linkedin) {
    socialMetadata.linkedin = socialLinks.linkedin;
  }
  if (socialLinks.instagram) {
    socialMetadata.instagram = socialLinks.instagram;
  }

  return socialMetadata;
}

/**
 * Generate a robots meta tag value
 */
export function generateRobotsMeta(indexable: boolean = true, followLinks: boolean = true): string {
  const parts: string[] = [];

  if (indexable) {
    parts.push('index');
  } else {
    parts.push('noindex');
  }

  if (followLinks) {
    parts.push('follow');
  } else {
    parts.push('nofollow');
  }

  return parts.join(', ');
}

/**
 * Generate AMP link tag
 */
export function generateAmpLink(ampUrl: string): { rel: string; href: string } {
  return {
    rel: 'amphtml',
    href: ampUrl,
  };
}

/**
 * Check if text is unique (simple similarity check)
 */
export function isDuplicateContent(text1: string, text2: string, threshold: number = 0.8): boolean {
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

  const normalized1 = normalize(text1);
  const normalized2 = normalize(text2);

  if (normalized1 === normalized2) return true;

  // Simple character matching (basic implementation)
  const minLength = Math.min(normalized1.length, normalized2.length);
  let matches = 0;

  for (let i = 0; i < minLength; i++) {
    if (normalized1[i] === normalized2[i]) matches++;
  }

  const similarity = matches / Math.max(normalized1.length, normalized2.length);
  return similarity > threshold;
}

/**
 * Generate canonical URL with language support
 */
export function generateCanonicalUrl(
  baseUrl: string,
  pathname: string,
  language?: 'en' | 'ar',
): string {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  const normalizedPathname = pathname === '/' ? '/' : pathname.startsWith('/') ? pathname : `/${pathname}`;
  const url = normalizedPathname === '/' ? `${normalizedBaseUrl}/` : `${normalizedBaseUrl}${normalizedPathname}`;

  if (language && language !== 'en') {
    // Optionally add language prefix for non-English
    // This depends on your routing strategy
  }

  return url;
}

/**
 * Generate Open Graph image for social sharing
 */
export function generateOGImage(
  baseUrl: string,
  title: string,
  options?: {
    width?: number;
    height?: number;
    format?: 'png' | 'jpg' | 'webp';
  },
): string {
  const width = options?.width || 1200;
  const height = options?.height || 630;
  const format = options?.format || 'jpg';
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');

  // Using a simple OG image generation service
  return `${normalizedBaseUrl}/og-image.${format}?title=${encodeURIComponent(title)}&width=${width}&height=${height}`;
}

/**
 * Check page load performance (basic metrics)
 */
export interface PageMetrics {
  title: string;
  wordCount: number;
  headings: { h1: number; h2: number; h3: number };
  images: number;
  internalLinks: number;
  externalLinks: number;
  readabilityScore: number;
}

/**
 * Format keywords for meta tag
 */
export function formatKeywords(keywords: string[]): string {
  return keywords
    .map((k) => k.trim())
    .filter((k) => k.length > 0)
    .slice(0, 10) // Limit to 10 keywords
    .join(', ');
}
