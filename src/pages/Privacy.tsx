import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { DEFAULT_PRIVACY_HTML_AR, DEFAULT_PRIVACY_HTML_EN } from '@/data/defaultPolicyHtml';
import { useFetchCMS } from '@/services/useCMSService';

const Privacy = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { data, isLoading } = useFetchCMS(true);

  const privacyHtml = data?.data?.privacyPolicy?.trim() || '';
  const contentHtml = privacyHtml || (isArabic ? DEFAULT_PRIVACY_HTML_AR : DEFAULT_PRIVACY_HTML_EN);

  return (
    <Layout>
      <PageHero
        badge={isArabic ? 'الخصوصية' : 'Privacy'}
        title={isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
        subtitle={isArabic ? 'تفاصيل سياسة الخصوصية الخاصة بنا.' : 'Details of our privacy policy.'}
      />

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            {isLoading ? (
              <p className="text-muted-foreground">
                {isArabic ? 'جاري تحميل سياسة الخصوصية...' : 'Loading privacy policy...'}
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

export default Privacy;
