import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ItemDetails } from './components/ItemDetails';
import { StructuredData, getProductSchema, getBreadcrumbSchema } from '@/components/StructuredData';

type Props = {
  params: Promise<{ id: string }>;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/items/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        title: 'عنصر غير موجود',
      };
    }

    const result = await response.json();
    const item = result.data;

    const title = `${item.name} - ${item.item_type || 'Item'}`;
    const description = item.description || `${item.name} details, stats, and information in ARC Raiders`;
    const imageUrl = item.image || `${baseUrl}/items/default.jpg`;
    const url = `${baseUrl}/items/${id}`;

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
            alt: item.name,
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
      keywords: [
        item.name,
        item.item_type,
        item.rarity,
        'ARC Raiders',
        'Saif',
        'game item',
      ].filter(Boolean),
    };
  } catch (error) {
    return {
      title: 'عنصر غير موجود',
    };
  }
}

export default async function ItemPage({ params }: Props) {
  const { id } = await params;

  // Fetch item data for structured data
  let itemData = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/items/${id}`, {
      cache: 'no-store',
    });
    if (response.ok) {
      const result = await response.json();
      itemData = result.data;
    }
  } catch (error) {
    // Handle error silently
  }

  return (
    <main className="min-h-screen">
      {itemData && (
        <>
          <StructuredData data={getProductSchema(baseUrl, itemData)} />
          <StructuredData
            data={getBreadcrumbSchema(baseUrl, [
              { name: 'الرئيسية', url: '/' },
              { name: 'العناصر', url: '/items' },
              { name: itemData.name, url: `/items/${id}` },
            ])}
          />
        </>
      )}
      <div className="container mx-auto px-4 py-8">
        <ItemDetails itemId={id} />
      </div>
    </main>
  );
}
