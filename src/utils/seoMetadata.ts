/**
 * SEO Metadata Configuration for Business Navigator
 * Based on soudasa.com structure and best practices
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'business.business';
  canonicalUrl?: string;
  structured?: Record<string, unknown>;
}

const baseUrl = (import.meta.env.VITE_SITE_URL || 'https://www.soudasa.com').replace(/\/$/, '');
const defaultImage = `${baseUrl}/logo.png`;

const buildUrl = (pathname: string) => {
  if (!pathname || pathname === '/') {
    return `${baseUrl}/`;
  }

  return `${baseUrl}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
};

/**
 * Page-specific SEO metadata
 */
export const pageMetadata: Record<string, SEOMetadata> = {
  '/': {
    title: 'Business Navigator | Saudi Arabia Business Solutions & Company Formation',
    description:
      'Comprehensive business consulting services in Saudi Arabia. Expert guidance for company formation, commercial licenses, visa solutions, and government services aligned with Vision 2030.',
    keywords: [
      'business formation saudi',
      'company registration ksa',
      'commercial license',
      'visa solutions',
      'business consulting',
      'saudi arabia business',
      'vision 2030',
      'business setup',
    ],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/'),
  },
  '/services': {
    title: 'Our Services | Business Consulting & Solutions - Business Navigator',
    description:
      'Explore our comprehensive business services including licensing, government services, trade, investment opportunities, and professional consulting in Saudi Arabia.',
    keywords: [
      'business services',
      'consulting services',
      'company registration',
      'business license',
      'visa services',
      'tax consulting',
      'real estate',
      'travel investment',
      'manpower solutions',
    ],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/services'),
  },
  '/about': {
    title: 'About Us | Business Navigator - Your Strategic Partner',
    description:
      'Learn about Business Navigator - your trusted consulting partner in Saudi Arabia with years of expertise in business formation, licensing, and government services.',
    keywords: ['about us', 'consulting firm', 'business partner', 'saudi arabia', 'company information', 'expertise'],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/about'),
  },
  '/blog': {
    title: 'Business Blog | Insights & Resources - Business Navigator',
    description:
      'Read our latest blog posts on business formation, visa solutions, licensing, and business tips for success in Saudi Arabia.',
    keywords: [
      'business blog',
      'business tips',
      'saudi business news',
      'company formation guide',
      'business insights',
      'industry resources',
    ],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/blog'),
  },
  '/contact': {
    title: 'Contact Us | Business Navigator',
    description:
      'Get in touch with our business consulting team. Contact us for a free consultation on company formation, licensing, and business growth in Saudi Arabia.',
    keywords: ['contact us', 'business inquiry', 'consultation', 'support', 'get in touch'],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/contact'),
  },
  '/business-license': {
    title: 'Business License & Company Registration - Business Navigator',
    description:
      'Get expert guidance on business licenses in Saudi Arabia. We handle trade, service, manufacturing, e-commerce, and professional licenses.',
    keywords: [
      'business license',
      'company registration',
      'trade license',
      'service license',
      'manufacturing license',
      'saudi license',
    ],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/business-license'),
  },
  '/appointment': {
    title: 'Book Appointment | Business Navigator',
    description: 'Schedule a consultation with our business experts. Book your free appointment today.',
    keywords: ['appointment', 'consultation booking', 'schedule meeting', 'business meeting'],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/appointment'),
  },
  '/flight-booking': {
    title: 'Flight & Travel Booking | Business Navigator',
    description: 'Book your flights and explore travel opportunities with our integrated travel solutions.',
    keywords: ['flight booking', 'travel solutions', 'business travel', 'saudi travel'],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/flight-booking'),
  },
  '/review-us': {
    title: 'Submit Review | Business Navigator',
    description: 'Share your experience and rate our services to help us improve.',
    keywords: ['customer review', 'rate service', 'feedback form', 'testimonial'],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/review-us'),
  },
  '/gallery': {
    title: 'Gallery | Business Navigator',
    description: 'Explore our company gallery with project images and featured videos.',
    keywords: ['company gallery', 'project photos', 'business videos', 'portfolio'],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/gallery'),
  },
  '/explore-saudi': {
    title: 'Explore Saudi Arabia | Vision 2030 Guide',
    description: 'Discover Saudi Arabia with our comprehensive guide to cities, regions, and opportunities aligned with Vision 2030.',
    keywords: ['saudi arabia', 'explore ksa', 'vision 2030', 'saudi cities', 'business opportunities'],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/explore-saudi'),
  },
  '/privacy': {
    title: 'Privacy Policy | Business Navigator',
    description: 'Read our privacy policy and data protection practices.',
    keywords: ['privacy policy', 'data protection'],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/privacy'),
  },
  '/terms': {
    title: 'Terms of Service | Business Navigator',
    description: 'Review our terms and conditions of use.',
    keywords: ['terms of service', 'terms and conditions'],
    ogType: 'website',
    ogImage: defaultImage,
    canonicalUrl: buildUrl('/terms'),
  },
};

/**
 * Get metadata for a specific page
 */
export function getPageMetadata(pathname: string): SEOMetadata {
  return (
    pageMetadata[pathname] || {
      title: 'Business Navigator | Saudi Arabia Business Solutions',
      description: 'Your strategic partner for business consulting and company formation in Saudi Arabia.',
      keywords: ['business consulting', 'saudi arabia', 'company formation'],
      ogImage: defaultImage,
      ogType: 'website',
      canonicalUrl: buildUrl(pathname || '/'),
    }
  );
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Business Navigator',
    url: buildUrl('/'),
    logo: `${baseUrl}/logo.png`,
    description: 'Business consulting and company formation services in Saudi Arabia',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['en', 'ar'],
    },
    sameAs: [
      'https://www.linkedin.com/company/business-navigator',
      'https://www.facebook.com/business-navigator',
    ],
  };
}

/**
 * Generate JSON-LD structured data for Services
 */
export function getServicesStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Business Navigator',
    description: 'Business consulting and company formation services',
    url: buildUrl('/'),
    serviceType: [
      'Business Consulting',
      'Company Formation',
      'Licensing Services',
      'Visa Solutions',
      'Government Services',
    ],
  };
}

/**
 * Generate JSON-LD structured data for Blog Article
 */
export function getArticleStructuredData(
  title: string,
  description: string,
  image: string,
  author: string,
  datePublished: string,
  dateModified?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'Business Navigator',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };
}

/**
 * Generate dynamically created sitemap
 */
export function generateSitemapXml(baseUrl: string): string {
  const routes = Object.keys(pageMetadata);
  const lastmod = new Date().toISOString().split('T')[0];
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');

  const urlEntries = routes.map((route) => {
    const priority = route === '/' ? '1.0' : route.includes('blog') ? '0.8' : '0.7';
    return `  <url>
    <loc>${route === '/' ? `${normalizedBaseUrl}/` : `${normalizedBaseUrl}${route}`}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;
}
