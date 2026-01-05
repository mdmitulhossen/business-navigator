import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { blogPosts } from '@/data/demoData';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const { t, language, isRTL } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-primary/90 dark:bg-background/20" />
        <div className="container-custom relative z-10 text-center">
          <span className="badge-accent mb-4 inline-block">{t('blog.label')}</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 dark:text-foreground">
            {t('blog.title')}
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="bg-card border border-border rounded-2xl overflow-hidden card-hover group animate-fade-in-up"
                style={{ animationDelay: `${(index % 3) * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={language === 'en' ? post.titleEn : post.titleAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                      {language === 'en' ? post.category : post.categoryAr}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className={`flex items-center gap-4 text-sm text-muted-foreground mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {language === 'en' ? post.author : post.authorAr}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display font-bold text-lg text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                    {language === 'en' ? post.titleEn : post.titleAr}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {language === 'en' ? post.excerptEn : post.excerptAr}
                  </p>

                  {/* Read More */}
                  <Link
                    to={`/blog/${post.id}`}
                    className={`inline-flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {t('blog.readMore')}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
