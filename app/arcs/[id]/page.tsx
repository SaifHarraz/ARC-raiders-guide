import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArcDetails } from './components/ArcDetails';
import { StructuredData, getBreadcrumbSchema, getArticleSchema } from '@/components/StructuredData';

type Props = {
  params: Promise<{ id: string }>;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/arcs/${id}`,
      { cache: 'no-store' }
    );
    const result = await response.json();

    if (result.success && result.data) {
      const arc = result.data;
      const title = `${arc.name} - ARC Unit Guide`;
      const description = arc.description || `Detailed information about ${arc.name} ARC unit in ARC Raiders`;
      const url = `${baseUrl}/arcs/${id}`;
      const imageUrl = arc.image || `${baseUrl}/arcs/default.jpg`;

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
              alt: arc.name,
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
        keywords: [arc.name, 'ARC unit', 'ARC Raiders', 'enemy', 'boss', 'Saif'].filter(Boolean),
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'وحدة ARC',
    description: 'معلومات تفصيلية عن وحدة ARC',
  };
}

export default async function ArcDetailPage({ params }: Props) {
  const { id } = await params;

  // Fetch ARC data for structured data
  let arcData = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/arcs/${id}`,
      { cache: 'no-store' }
    );
    const result = await response.json();
    if (result.success && result.data) {
      arcData = result.data;
    }
  } catch (error) {
    // Handle error silently
  }

  return (
    <main className="min-h-screen">
      {arcData && (
        <>
          <StructuredData
            data={getBreadcrumbSchema(baseUrl, [
              { name: 'الرئيسية', url: '/' },
              { name: 'وحدات ARC', url: '/arcs' },
              { name: arcData.name, url: `/arcs/${id}` },
            ])}
          />
          <StructuredData
            data={getArticleSchema(baseUrl, {
              title: `${arcData.name} - ARC Unit Guide`,
              description: arcData.description || `Detailed information about ${arcData.name}`,
              url: `/arcs/${id}`,
              image: arcData.image,
              datePublished: arcData.created_at ? new Date(arcData.created_at) : undefined,
              dateModified: arcData.updated_at ? new Date(arcData.updated_at) : undefined,
            })}
          />
        </>
      )}
      <div className="container mx-auto px-4 py-8">
        <ArcDetails arcId={id} />
      </div>
    </main>
  );
}
