import { Metadata } from 'next';
import { ItemsDataTable } from './components/ItemsDataTable';
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'العناصر - ARC Raiders Items Database',
  description: 'تصفح جميع العناصر في آرك رايدرز. ابحث، صفي حسب النوع والندرة، واعرض معلومات العناصر التفصيلية.',
  alternates: {
    canonical: `${baseUrl}/items`,
  },
  openGraph: {
    type: 'website',
    url: `${baseUrl}/items`,
    title: 'العناصر - ARC Raiders Items Database',
    description: 'Browse all items in ARC Raiders. Search, filter by type and rarity, and view detailed item information.',
    siteName: 'Saif',
    images: [
      {
        url: `${baseUrl}/og-items.jpg`,
        width: 1200,
        height: 630,
        alt: 'ARC Raiders Items Database',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'العناصر - ARC Raiders Items Database',
    description: 'Browse all items in ARC Raiders. Search, filter by type and rarity.',
    images: [`${baseUrl}/og-items.jpg`],
  },
  keywords: ['ARC Raiders', 'items', 'weapons', 'equipment', 'database', 'game items', 'Saif'],
};

export default function ItemsPage() {
  return (
    <main className="min-h-screen">
      <StructuredData
        data={getBreadcrumbSchema(baseUrl, [
          { name: 'الرئيسية', url: '/' },
          { name: 'العناصر', url: '/items' },
        ])}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            العناصر
          </h1>
          <p className="text-muted-foreground">
            تصفح وابحث عن جميع العناصر في آرك رايدرز. صفي حسب النوع والندرة والمزيد.
          </p>
        </div>

        {/* Items Data Table */}
        <ItemsDataTable />
      </div>
    </main>
  );
}
