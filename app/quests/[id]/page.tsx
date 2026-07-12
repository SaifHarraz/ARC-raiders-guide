import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuestDetails } from './components/QuestDetails';
import { StructuredData, getBreadcrumbSchema, getArticleSchema } from '@/components/StructuredData';

type Props = {
  params: Promise<{ id: string }>;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/quests/${id}`,
      { cache: 'no-store' }
    );
    const result = await response.json();

    if (result.success && result.data) {
      const quest = result.data;
      const title = `${quest.name} - Quest Guide`;
      const description = quest.objectives?.join('. ') || `Complete quest ${quest.name} in ARC Raiders`;
      const url = `${baseUrl}/quests/${id}`;
      const imageUrl = quest.image || `${baseUrl}/quests/default.jpg`;

      return {
        title,
        description,
        alternates: {
          canonical: url,
        },
        openGraph: {
          type: 'article',
          url,
          title,
          description,
          images: [
            {
              url: imageUrl,
              width: 800,
              height: 600,
              alt: quest.name,
            },
          ],
          siteName: 'Saif',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [imageUrl],
        },
        keywords: [quest.name, 'quest', 'mission', 'ARC Raiders', 'Saif', 'objectives', 'rewards'].filter(Boolean),
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'مهمة',
    description: 'معلومات تفصيلية عن المهمة',
  };
}

export default async function QuestDetailPage({ params }: Props) {
  const { id } = await params;

  // Fetch quest data for structured data
  let questData = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/quests/${id}`,
      { cache: 'no-store' }
    );
    const result = await response.json();
    if (result.success && result.data) {
      questData = result.data;
    }
  } catch (error) {
    // Handle error silently
  }

  return (
    <main className="min-h-screen">
      {questData && (
        <>
          <StructuredData
            data={getBreadcrumbSchema(baseUrl, [
              { name: 'الرئيسية', url: '/' },
              { name: 'المهام', url: '/quests' },
              { name: questData.name, url: `/quests/${id}` },
            ])}
          />
          <StructuredData
            data={getArticleSchema(baseUrl, {
              title: `${questData.name} - Quest Guide`,
              description: questData.objectives?.join('. ') || `Complete quest ${questData.name}`,
              url: `/quests/${id}`,
              image: questData.image,
              datePublished: questData.created_at ? new Date(questData.created_at) : undefined,
              dateModified: questData.updated_at ? new Date(questData.updated_at) : undefined,
            })}
          />
        </>
      )}
      <div className="container mx-auto px-4 py-8">
        <QuestDetails questId={id} />
      </div>
    </main>
  );
}
