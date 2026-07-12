import { Metadata } from 'next';
import { QuestsDataTable } from './components/QuestsDataTable';
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'المهام - Quests Guide',
  description: 'تصفح جميع المهام في آرك رايدرز. اطلع على أهداف المهام والمكافآت التي ستحصل عليها.',
  alternates: {
    canonical: `${baseUrl}/quests`,
  },
  openGraph: {
    type: 'website',
    url: `${baseUrl}/quests`,
    title: 'المهام - ARC Raiders Quests Guide',
    description: 'Browse all quests in ARC Raiders. View quest objectives and rewards.',
    siteName: 'Saif',
    images: [
      {
        url: `${baseUrl}/og-quests.jpg`,
        width: 1200,
        height: 630,
        alt: 'ARC Raiders Quests Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'المهام - ARC Raiders Quests Guide',
    description: 'Browse all quests in ARC Raiders. View quest objectives and rewards.',
    images: [`${baseUrl}/og-quests.jpg`],
  },
  keywords: ['ARC Raiders', 'quests', 'missions', 'objectives', 'rewards', 'game guide', 'Saif'],
};

export default function QuestsPage() {
  return (
    <main className="min-h-screen">
      <StructuredData
        data={getBreadcrumbSchema(baseUrl, [
          { name: 'الرئيسية', url: '/' },
          { name: 'المهام', url: '/quests' },
        ])}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            المهام
          </h1>
          <p className="text-muted-foreground">
            تعرف على جميع المهام في اللعبة. كل مهمة لها أهدافها ومكافآتها الخاصة.
          </p>
        </div>

        {/* Quests Data Table */}
        <QuestsDataTable />
      </div>
    </main>
  );
}
