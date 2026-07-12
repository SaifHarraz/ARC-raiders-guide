import React from 'react'

interface StructuredDataProps {
  data: Record<string, unknown>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Helper function to generate Organization structured data
export function getOrganizationSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Saif',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Comprehensive guide and companion for ARC Raiders game',
    sameAs: [
      // Add social media links here when available
    ],
  }
}

// Helper function to generate WebSite structured data
export function getWebSiteSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Saif - ARC Raiders Guide',
    url: baseUrl,
    description: 'Comprehensive guide for ARC Raiders including items database, traders, maps, marketplace, event timers, and latest strategies.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/items?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// Helper function to generate BreadcrumbList structured data
export function getBreadcrumbSchema(baseUrl: string, items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}

// Helper function to generate Product structured data (for items)
export function getProductSchema(
  baseUrl: string,
  item: {
    id: string
    name: string
    description?: string
    image?: string
    rarity?: string
    item_type?: string
  }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.description || `${item.name} - ARC Raiders item`,
    image: item.image || `${baseUrl}/items/default.jpg`,
    url: `${baseUrl}/items/${item.id}`,
    brand: {
      '@type': 'Brand',
      name: 'ARC Raiders',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'SEEDS',
      lowPrice: 0,
      highPrice: 999999,
      availability: 'https://schema.org/InStock',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Rarity',
        value: item.rarity,
      },
      {
        '@type': 'PropertyValue',
        name: 'Type',
        value: item.item_type,
      },
    ],
  }
}

// Helper function to generate Article structured data
export function getArticleSchema(
  baseUrl: string,
  article: {
    title: string
    description: string
    url: string
    image?: string
    datePublished?: Date
    dateModified?: Date
    author?: string
  }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || `${baseUrl}/og-image.jpg`,
    url: `${baseUrl}${article.url}`,
    datePublished: article.datePublished?.toISOString() || new Date().toISOString(),
    dateModified: article.dateModified?.toISOString() || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: article.author || 'Saif Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Saif',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  }
}
