import { Metadata } from 'next';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Marketplace } from "@/app/features/marketplace";
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData';
import { isFeatureEnabledCached } from "@/lib/services/settings-cache";
import { FeatureDisabled } from "@/components/common/FeatureDisabled";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'السوق - ARC Raiders Marketplace',
  description: 'قم بشراء وبيع العناصر مع لاعبين آخرين في سوق ARC Raiders. ابحث عن صفقات رائعة وتداول العناصر بأمان.',
  alternates: {
    canonical: `${baseUrl}/marketplace`,
  },
  openGraph: {
    type: 'website',
    url: `${baseUrl}/marketplace`,
    title: 'السوق - ARC Raiders Marketplace',
    description: 'Buy and sell items with other players in the ARC Raiders marketplace.',
    siteName: 'Saif',
    images: [
      {
        url: `${baseUrl}/og-marketplace.jpg`,
        width: 1200,
        height: 630,
        alt: 'ARC Raiders Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'السوق - ARC Raiders Marketplace',
    description: 'Buy and sell items with other players in the ARC Raiders marketplace.',
    images: [`${baseUrl}/og-marketplace.jpg`],
  },
  keywords: ['ARC Raiders', 'marketplace', 'trading', 'buy', 'sell', 'items', 'economy', 'Saif'],
};

export default async function MarketplacePage() {
  const isEnabled = await isFeatureEnabledCached("enable_marketplace");
  if (!isEnabled) {
    return <FeatureDisabled featureName="Marketplace" featureNameAr="السوق" />;
  }

  const session = await auth();

  let userProfile = null;
  if (session?.user?.id) {
    userProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        discord_username: true,
        embark_id: true,
      },
    });
  }

  return (
    <main className="min-h-screen">
      <StructuredData
        data={getBreadcrumbSchema(baseUrl, [
          { name: 'الرئيسية', url: '/' },
          { name: 'السوق', url: '/marketplace' },
        ])}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">السوق</h1>
          <p className="text-muted-foreground">
            قم بشراء وبيع العناصر مع لاعبين آخرين
          </p>
        </div>
        <Marketplace session={session} userProfile={userProfile} />
      </div>
    </main>
  );
}
