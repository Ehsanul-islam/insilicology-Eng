import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'course';
  siteName?: string;
  author?: string;
  publishedTime?: string;
  tags?: string[];
  course?: {
    id: string;
    title: string;
    description?: string;
    duration?: string;
    level?: string;
    price?: number;
    currency?: string;
  };
}

const SEOHead = ({
  title,
  description,
  image = '/placeholder.svg',
  url,
  type = 'website',
  siteName = 'LearnCraft',
  author,
  publishedTime,
  tags = [],
  course,
}: SEOProps) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://learncraft.lovable.app';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  
  // Format title with site name
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  // Generate Course structured data
  const courseStructuredData = course ? {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${siteUrl}/courses/${course.id}`,
    "name": course.title,
    "description": course.description || description,
    "provider": {
      "@type": "Organization",
      "name": siteName,
      "sameAs": siteUrl
    },
    ...(course.duration && {
      "timeRequired": course.duration
    }),
    ...(course.level && {
      "educationalLevel": course.level
    }),
    ...(course.price !== undefined && {
      "offers": {
        "@type": "Offer",
        "price": course.price,
        "priceCurrency": course.currency || "USD",
        "availability": "https://schema.org/InStock",
        "url": `${siteUrl}/courses/${course.id}`
      }
    })
  } : null;

  // Generate Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": siteUrl,
    "logo": `${siteUrl}/placeholder.svg`,
    "description": "Professional skills development platform with expert-led courses",
    "sameAs": [
      "https://twitter.com/learncraft",
      "https://linkedin.com/company/learncraft"
    ]
  };

  // Generate WebSite structured data
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/courses?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Generate BreadcrumbList if URL has path segments
  const pathSegments = url?.split('/').filter(Boolean) || [];
  const breadcrumbData = pathSegments.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      ...pathSegments.map((segment, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        "item": `${siteUrl}/${pathSegments.slice(0, index + 1).join('/')}`
      }))
    ]
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {author && <meta name="author" content={author} />}
      {tags.length > 0 && <meta name="keywords" content={tags.join(', ')} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={siteName} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {tags.length > 0 && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      {author && <meta name="twitter:creator" content={author} />}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteData)}
      </script>
      {breadcrumbData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      )}
      {courseStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(courseStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
