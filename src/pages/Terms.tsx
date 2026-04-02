import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { DEFAULT_TERMS_HTML_AR, DEFAULT_TERMS_HTML_EN } from '@/data/defaultPolicyHtml';
import { useFetchCMS } from '@/services/useCMSService';

const Terms = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { data, isLoading } = useFetchCMS(true);

  const termsHtml = data?.data?.termsOfUse?.trim() || '';
  const contentHtml = termsHtml || (isArabic ? DEFAULT_TERMS_HTML_AR : DEFAULT_TERMS_HTML_EN);

  return (
    <Layout>
      <PageHero
        badge={isArabic ? 'الشروط' : 'Terms'}
        title={isArabic ? 'شروط الاستخدام' : 'Terms of Use'}
        subtitle={isArabic ? 'تفاصيل شروط الاستخدام الخاصة بنا.' : 'Details of our terms of use.'}
      />

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            {isLoading ? (
              <p className="text-muted-foreground">
                {isArabic ? 'جاري تحميل شروط الاستخدام...' : 'Loading terms of use...'}
              </p>
            ) : (
              <article
                className="cms-policy-content"
                dir={isArabic ? 'rtl' : 'ltr'}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
