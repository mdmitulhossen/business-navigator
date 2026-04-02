import breadCrumbBG from '@/assets/3.webp';
import SEOHead from '@/components/common/SEOHead';
import DashboardPageLoader from '@/components/dashboard/DashboardPageLoader';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFetchBlog, useFetchBlogs, type TBlog } from '@/services/useBlogService';
import { ArrowLeft, ArrowRight, Calendar, Eye, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const Blog = () => {
  const { t, language, isRTL } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const isArabic = language === 'ar';
  const isDetailPage = Boolean(id);

  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [selectedBlog, setSelectedBlog] = useState<TBlog | null>(null);

  const blogsQuery = useFetchBlogs({ page, limit, isActive: true }, !isDetailPage);
  const blogDetailQuery = useFetchBlog(id, isDetailPage);

  const blogs = useMemo(() => blogsQuery.data?.data ?? [], [blogsQuery.data?.data]);
  const total = blogsQuery.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const formatDate = (dateString: string) => {
    if (!dateString) return isArabic ? 'غير متاح' : 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return isArabic ? 'غير متاح' : 'N/A';
    return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  if (isDetailPage) {
    const detailBlog = blogDetailQuery.data?.data;
    const contentHtml = detailBlog?.description?.trim() || '';

    return (
      <Layout>
        <SEOHead
          pathname={pathname}
          articleData={
            detailBlog
              ? {
                  title: detailBlog.title,
                  description: stripHtml(detailBlog.description).substring(0, 160),
                  image: detailBlog.image,
                  author: detailBlog.bloggerName,
                  datePublished: detailBlog.createdAt || new Date().toISOString(),
                  dateModified: detailBlog.updatedAt,
                }
              : undefined
          }
        />
        <section
          className="relative overflow-hidden py-20"
          style={{
            backgroundImage: `url(${breadCrumbBG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-primary/60 dark:bg-background/40" />
          <div className="container-custom relative z-10 text-center">
            <span className="badge-accent mb-4 inline-block">{isArabic ? 'تفاصيل المقال' : 'Blog Details'}</span>
            <h1 className="font-display mb-4 text-4xl font-bold text-primary-foreground dark:text-foreground md:text-5xl lg:text-6xl">
              {detailBlog?.title || (isArabic ? 'تفاصيل المقال' : 'Blog Details')}
            </h1>
            <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-custom space-y-6">
            <div>
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80">
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                {isArabic ? 'العودة للمدونة' : 'Back to Blog'}
              </Link>
            </div>

            {blogDetailQuery.isLoading ? (
              <DashboardPageLoader />
            ) : detailBlog ? (
              <article className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-video overflow-hidden border-b border-border">
                  <img src={detailBlog.image} alt={detailBlog.title} className="h-full w-full object-cover" />
                </div>

                <div className="space-y-4 p-6 md:p-8">
                  <div className={`flex flex-wrap items-center gap-4 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(detailBlog.createdAt || '')}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {detailBlog.bloggerName || '-'}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl font-bold text-foreground">{detailBlog.title}</h2>
                  {detailBlog.subTitle ? <p className="text-base text-muted-foreground">{detailBlog.subTitle}</p> : null}

                  <article
                    className="cms-policy-content"
                    dir={isArabic ? 'rtl' : 'ltr'}
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                </div>
              </article>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                {isArabic ? 'لم يتم العثور على المقال.' : 'Blog not found.'}
              </div>
            )}
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead pathname={pathname} />
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20"
        style={{
          backgroundImage: `url(${breadCrumbBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/60 dark:bg-background/40" />
        <div className="container-custom relative z-10 text-center">
          <span className="badge-accent mb-4 inline-block">{t('blog.label')}</span>
          <h1 className="font-display mb-4 text-4xl font-bold text-primary-foreground dark:text-foreground md:text-5xl lg:text-6xl">
            {t('blog.title')}
          </h1>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {blogsQuery.isLoading && !blogsQuery.data ? (
            <DashboardPageLoader />
          ) : blogs.length ? (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((post, index) => {
                  const excerpt = stripHtml(post.description || '').slice(0, 140);

                  return (
                    <article
                      key={post.id}
                      className="group animate-fade-in-up overflow-hidden rounded-2xl border border-border bg-card card-hover"
                      style={{ animationDelay: `${(index % 3) * 0.1}s` }}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute right-4 top-4">
                          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{post.type || '-'}</span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className={`mb-3 flex items-center gap-4 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.createdAt || '')}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.bloggerName || '-'}
                          </span>
                        </div>

                        <h2 className="font-display mb-2 line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                          {post.title}
                        </h2>

                        {post.subTitle ? <p className="mb-2 line-clamp-1 text-sm text-muted-foreground">{post.subTitle}</p> : null}

                        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{excerpt || (isArabic ? 'لا يوجد وصف' : 'No description')}</p>

                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <Button variant="outline" size="sm" onClick={() => setSelectedBlog(post)}>
                            <Eye className="mr-1 h-4 w-4" />
                            {isArabic ? 'عرض سريع' : 'Quick View'}
                          </Button>

                          <Link
                            to={`/blog/${post.id}`}
                            className={`inline-flex items-center text-sm font-medium text-accent transition-colors hover:text-accent/80 ${isRTL ? 'flex-row-reverse' : ''}`}
                          >
                            {t('blog.readMore')}
                            <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button variant="outline" disabled={page <= 1 || blogsQuery.isFetching} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                  {isArabic ? 'السابق' : 'Previous'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {isArabic ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= totalPages || blogsQuery.isFetching}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  {isArabic ? 'التالي' : 'Next'}
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              {isArabic ? 'لا توجد مقالات متاحة حالياً.' : 'No blog posts available right now.'}
            </div>
          )}
        </div>
      </section>

      <Dialog open={Boolean(selectedBlog)} onOpenChange={(open) => !open && setSelectedBlog(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedBlog?.title || (isArabic ? 'تفاصيل المقال' : 'Blog Details')}</DialogTitle>
            <DialogDescription>
              {selectedBlog?.subTitle || (isArabic ? 'عرض سريع لمحتوى المقال.' : 'Quick preview of the blog content.')}
            </DialogDescription>
          </DialogHeader>

          {selectedBlog ? (
            <div className="space-y-4">
              <img src={selectedBlog.image} alt={selectedBlog.title} className="h-auto w-full rounded-xl border border-border object-cover" />

              <div className={`flex flex-wrap items-center gap-4 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedBlog.createdAt || '')}
                </span>
                <span className="inline-flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {selectedBlog.bloggerName || '-'}
                </span>
              </div>

              <article
                className="cms-policy-content"
                dir={isArabic ? 'rtl' : 'ltr'}
                dangerouslySetInnerHTML={{ __html: selectedBlog.description || '' }}
              />

              <div className={`${isRTL ? 'text-right' : ''}`}>
                <Link to={`/blog/${selectedBlog.id}`} className="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80">
                  {isArabic ? 'فتح صفحة التفاصيل' : 'Open details page'}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                </Link>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Blog;
