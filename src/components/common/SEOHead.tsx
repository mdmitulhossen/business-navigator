import { getArticleStructuredData, getOrganizationStructuredData, getPageMetadata, SEOMetadata } from '@/utils/seoMetadata';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  /**
   * Page pathname to lookup metadata
   */
  pathname: string;
  /**
   * Override default metadata
   */
  customMetadata?: Partial<SEOMetadata>;
  /**
   * Additional structured data (JSON-LD)
   */
  structuredData?: Record<string, unknown>;
  /**
   * Blog article metadata for article-specific SEO
   */
  articleData?: {
    title: string;
    description: string;
    image: string;
    author: string;
    datePublished: string;
    dateModified?: string;
  };
  /**
   * Language for page (default: en)
   */
  language?: 'en' | 'ar';
}

/**
 * SEO Head Component for React Helmet
 * Manages all meta tags, structured data, and SEO-related head content
 */
export function SEOHead({
  pathname,
  customMetadata,
  structuredData,
  articleData,
  language = 'en',
}: SEOHeadProps) {
  // Get base metadata
  const baseMetadata = getPageMetadata(pathname);
  const metadata = { ...baseMetadata, ...customMetadata };

  // Build structured data
  const jsonLdData: Record<string, unknown>[] = [getOrganizationStructuredData()];

  if (articleData) {
    jsonLdData.push(
      getArticleStructuredData(
        articleData.title,
        articleData.description,
        articleData.image,
        articleData.author,
        articleData.datePublished,
        articleData.dateModified,
      ),
    );
  }

  if (structuredData) {
    jsonLdData.push(structuredData);
  }

  return (
    <Helmet htmlAttributes={{ lang: language, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Character encoding */}
      <meta charSet="utf-8" />

      {/* Primary Meta Tags */}
      <title>{metadata.title}</title>
      <meta name="title" content={metadata.title} />
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords.join(', ')} />
      <meta name="language" content={language === 'ar' ? 'ar' : 'en'} />

      {/* Canonical URL */}
      {metadata.canonicalUrl && <link rel="canonical" href={metadata.canonicalUrl} />}

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={metadata.ogType || 'website'} />
      <meta property="og:url" content={metadata.canonicalUrl || ''} />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      {metadata.ogImage && <meta property="og:image" content={metadata.ogImage} />}
      <meta property="og:site_name" content="Business Navigator" />
      <meta property="og:locale" content={language === 'ar' ? 'ar_SA' : 'en_US'} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={metadata.title} />
      <meta property="twitter:description" content={metadata.description} />
      {metadata.ogImage && <meta property="twitter:image" content={metadata.ogImage} />}
      <meta name="twitter:creator" content="@BusinessNavigator" />

      {/* Author and Publisher */}
      <meta name="author" content="Business Navigator" />
      <meta name="publisher" content="Business Navigator" />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="revisit-after" content="7 days" />

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#000000" />

      {/* JSON-LD Structured Data */}
      {jsonLdData.map((data, index) => (
        <script key={`json-ld-${index}`} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}

export default SEOHead;
