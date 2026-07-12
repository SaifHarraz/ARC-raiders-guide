import { Metadata } from 'next';
import { Traders } from '../features/traders';
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'التجار - تجار آرك رايدرز',
  description: 'تصفح العناصر المتاحة من جميع التجار في آرك رايدرز. اعثر على أفضل الصفقات من أبولو، سيليست، لانس، شاني، وتيان وين.',
  alternates: {
    canonical: `${baseUrl}/traders`,
  },
  openGraph: {
    type: 'website',
    url: `${baseUrl}/traders`,
    title: 'التجار - تجار آرك رايدرز',
    description: 'تصفح العناصر المتاحة من جميع التجار في آرك رايدرز. اعثر على أفضل المعدات والإمدادات.',
    siteName: 'Saif',
    images: [
      {
        url: `${baseUrl}/og-traders.jpg`,
        width: 1200,
        height: 630,
        alt: 'تجار آرك رايدرز',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'التجار - تجار آرك رايدرز',
    description: 'تصفح العناصر المتاحة من جميع التجار في آرك رايدرز.',
    images: [`${baseUrl}/og-traders.jpg`],
  },
  keywords: ['آرك رايدرز', 'التجار', 'أبولو', 'سيليست', 'لانس', 'شاني', 'تيان وين', 'تجار', 'Saif'],
};

export default function TradersPage() {
  return (
    <main className="min-h-screen">
      <StructuredData
        data={getBreadcrumbSchema(baseUrl, [
          { name: 'الرئيسية', url: '/' },
          { name: 'التجار', url: '/traders' },
        ])}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            التجار
          </h1>
          <p className="text-muted-foreground">
            تصفح العناصر المتاحة من جميع التجار. كل تاجر متخصص في أنواع مختلفة من المعدات والإمدادات.
          </p>
        </div>

        {/* Traders Content */}
        <Traders />
      </div>
    </main>
  );
}
