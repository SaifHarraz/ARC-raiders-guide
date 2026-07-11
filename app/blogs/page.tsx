import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BlogList } from "@/app/features/blog/components/BlogList";
import { BlogStats } from "@/app/features/blog/components/BlogStats";
import { FeaturedBlogCard } from "@/app/features/blog/components/FeaturedBlogCard";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "المدونة | ARC Raiders",
  description: "آخر الأخبار والأدلة والتحديثات حول لعبة ARC Raiders",
};

export default async function BlogsPage() {
  const session = await auth();

  const [blogs, categories, stats] = await Promise.all([
    prisma.blog.findMany({
      where: { published: true },
      include: {
        author: {
          select: { id: true, username: true, name: true, image: true },
        },
        category: true,
        _count: { select: { comments: true } },
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
    }),
    // Get statistics
    prisma.blog.aggregate({
      where: { published: true },
      _sum: { viewCount: true },
      _count: true,
    }),
  ]);

  // Calculate total comments
  const totalComments = await prisma.blogComment.count();

  // Get featured blog (most recent or most viewed)
  const featuredBlog = blogs[0];

  // Get other blogs (excluding featured)
  const otherBlogs = blogs.slice(1);

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[500px] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-orange-500/20 group">
        <Image
          src="/banner/banner.jpg"
          alt="ARC Raiders Blog"
          fill
          className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000"
          priority
        />
        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-slate-900/70 to-background pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/30 via-transparent to-red-900/30 pointer-events-none" />

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        {/* Glowing Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

        {/* Hero Content */}
        <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-md mb-8 animate-fade-in shadow-lg shadow-orange-500/20">
            <Sparkles className="h-5 w-5 text-orange-400 animate-pulse" />
            <span className="text-sm font-bold text-orange-300 uppercase tracking-widest">مركز الأخبار والأدلة</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 animate-slide-up bg-gradient-to-l from-orange-400 via-red-400 to-orange-300 bg-clip-text text-transparent drop-shadow-2xl [text-shadow:_0_0_30px_rgb(251_146_60_/_50%)]">
            مدونة saif
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mb-10 animate-slide-up leading-relaxed drop-shadow-lg" style={{ animationDelay: '100ms' }}>
            آخر الأخبار، الأدلة الشاملة، والتحديثات حول عالم <span className="text-orange-400 font-bold">ARC Raiders</span>
          </p>

          <div className="flex flex-wrap gap-4 mb-8 animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:border-orange-500/50 transition-colors">
              <span className="text-sm text-gray-200">📰 الأخبار</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:border-orange-500/50 transition-colors">
              <span className="text-sm text-gray-200">📚 الأدلة</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:border-orange-500/50 transition-colors">
              <span className="text-sm text-gray-200">🎯 الاستراتيجيات</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:border-orange-500/50 transition-colors">
              <span className="text-sm text-gray-200">⚡ التحديثات</span>
            </div>
          </div>

          {session && (
            <Button asChild size="lg" className="animate-scale-in bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all" style={{ animationDelay: '200ms' }}>
              <Link href="/blogs/new">
                <Plus className="h-5 w-5 ml-2" />
                كتابة مقالة جديدة
              </Link>
            </Button>
          )}
        </div>

        {/* Bottom Fade with Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Stats Section */}
        <section className="animate-fade-in">
          <BlogStats
            totalBlogs={stats._count || 0}
            totalViews={stats._sum.viewCount || 0}
            totalComments={totalComments}
            totalCategories={categories.length}
          />
        </section>

        {/* Featured Blog */}
        {featuredBlog && (
          <section className="animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-orange rounded-full" />
              <h2 className="text-3xl font-bold">المقالة المميزة</h2>
            </div>
            <FeaturedBlogCard blog={featuredBlog} />
          </section>
        )}

        {/* All Articles */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-gradient-orange rounded-full" />
            <h2 className="text-3xl font-bold">جميع المقالات</h2>
          </div>
          <BlogList
            initialBlogs={otherBlogs}
            categories={categories}
            showCategoryShowcase={true}
          />
        </section>
      </div>
    </main>
  );
}
