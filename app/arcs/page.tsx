import { Metadata } from 'next';
import { ArcsDataTable } from './components/ArcsDataTable';
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'وحدات ARC - ARC Units Database',
  description: 'تصفح جميع وحدات ARC في اللعبة. اطلع على معلومات تفصيلية عن كل وحدة والمواد التي تحصل عليها عند تدميرها.',
  alternates: {
    canonical: `${baseUrl}/arcs`,
  },
  openGraph: {
    type: 'website',
    url: `${baseUrl}/arcs`,
    title: 'وحدات ARC - ARC Units Database',
    description: 'Browse all ARC units in ARC Raiders. View detailed information about each unit and materials dropped.',
    siteName: 'Saif',
    images: [
      {
        url: `${baseUrl}/og-arcs.jpg`,
        width: 1200,
        height: 630,
        alt: 'ARC Raiders Units Database',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'وحدات ARC - ARC Units Database',
    description: 'Browse all ARC units in ARC Raiders. View detailed information.',
    images: [`${baseUrl}/og-arcs.jpg`],
  },
  keywords: ['ARC Raiders', 'ARC units', 'enemies', 'game guide', 'Saif', 'bosses'],
};

export default function ArcsPage() {
  return (
    <main className="min-h-screen">
      <StructuredData
        data={getBreadcrumbSchema(baseUrl, [
          { name: 'الرئيسية', url: '/' },
          { name: 'وحدات ARC', url: '/arcs' },
        ])}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            وحدات ARC
          </h1>
          <p className="text-muted-foreground">
            تعرف على جميع وحدات ARC في اللعبة. كل وحدة لها خصائصها الفريدة والمواد التي تسقطها عند التدمير.
          </p>
        </div>

        {/* ARCs Data Table */}
        <ArcsDataTable />
      </div>
    </main>
  );
}
