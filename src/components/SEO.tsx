import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const DEFAULT_OG_IMAGE = 'https://irmomarketing.com/images/irmo-marketing-bolt-new-02-08-2026_06_05_pm.png';

export default function SEO({
  title,
  description,
  canonical = 'https://irmomarketing.com',
  ogImage,
  ogType = 'website',
  structuredData,
}: SEOProps) {
  const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;
  const fullTitle = title.includes('Nick Irmo') ? title : `${title} | Nick Irmo`;

  const schemas = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={resolvedOgImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
