import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { incrementViewCount } from "@/app/features/guides/services/guide-actions";
import { GuideSidebar } from "@/app/features/guides/components/GuideSidebar";
import { sanitizeHtml } from "@/app/features/blog/utils/sanitize";

const formatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await prisma.guide.findUnique({
    where: { slug, published: true },
    select: { title: true, description: true },
  });

  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  return {
    title: `${guide.title} | ARC Raiders Guides`,
    description: guide.description || undefined,
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const guide = await prisma.guide.findUnique({
    where: { slug, published: true },
    include: {
      author: {
        select: { id: true, username: true, name: true, image: true },
      },
      category: true,
      tags: true,
    },
  });

  if (!guide) {
    notFound();
  }

  // Increment view count (don't await to not block rendering)
  incrementViewCount(guide.id);

  // Sanitize HTML content
 let sanitizedContent = sanitizeHtml(guide.content);

  // Extract headings for table of contents using regex
  const headingRegex = /<h([23])(?:\s+id="([^"]*)")?[^>]*>([^<]+)<\/h\1>/g;
  const headings: Array<{ id: string; title: string }> = [];
  let match;
  let headingIndex = 0;

  // Replace headings with ID attributes and collect them
  sanitizedContent = sanitizedContent.replace(headingRegex, (fullMatch, level, existingId, title) => {
    const id = existingId || `section-${headingIndex}`;
    headings.push({ id, title: title.trim() });
    headingIndex++;
    return `<h${level} id="${id}">${title}</h${level}>`;
  });

  const contentWithIds = sanitizedContent;

  return (
    <div className="w-full px-[100px] py-8 space-y-8">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
          Arc Raiders
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href="/guides" className="text-muted-foreground transition-colors hover:text-foreground">
          الأدلة
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground line-clamp-1">{guide.title}</span>
      </div>

      <div className="relative h-48 overflow-hidden rounded-xl border border-border bg-card md:h-64">
        {guide.featuredImage ? (
          <img
            src={guide.featuredImage}
            alt={guide.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-foreground">{guide.title}</h1>
            <button
              className="rounded-lg border border-border p-2 transition-colors hover:bg-secondary"
              aria-label="حفظ الدليل"
              type="button"
            >
              <Star className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            {guide.publishedAt && (
              <span>نُشر: {formatter.format(new Date(guide.publishedAt))}</span>
            )}
            {guide.category && (
              <>
                <span>•</span>
                <span>{guide.category.name}</span>
              </>
            )}
            <span>•</span>
            <span>{guide.viewCount} مشاهدة</span>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <article className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
          </article>

          {guide.tags && guide.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-sm font-semibold mb-3">الوسوم</h3>
              <div className="flex flex-wrap gap-2">
                {guide.tags.map((tag) => (
                  <span
                    key={tag.tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-secondary text-foreground"
                  >
                    {tag.tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <GuideSidebar sections={headings} />
      </div>
    </div>
  );
}
