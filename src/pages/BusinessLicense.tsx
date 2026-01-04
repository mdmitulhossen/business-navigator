import { Link } from 'react-router-dom';
import { Store, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import CTASection from '@/components/home/CTASection';

const BusinessLicense = () => {
  const { t, language, isRTL } = useLanguage();

  const licenseTypes = [
    {
      id: 'trade',
      icon: Store,
      titleEn: 'Trade License',
      titleAr: 'رخصة تجارية',
      descEn: 'For businesses involved in buying and selling goods, import/export, and retail operations.',
      descAr: 'للأعمال التي تتضمن شراء وبيع السلع، الاستيراد/التصدير، وعمليات البيع بالتجزئة.',
      features: language === 'en'
        ? ['Import & Export', 'Wholesale & Retail', 'General Trading', 'E-commerce Activities']
        : ['استيراد وتصدير', 'جملة وتجزئة', 'تجارة عامة', 'أنشطة التجارة الإلكترونية'],
    },
    {
      id: 'service',
      icon: Briefcase,
      titleEn: 'Service License',
      titleAr: 'رخصة خدمات',
      descEn: 'For businesses providing professional services, consulting, and technical expertise.',
      descAr: 'للأعمال التي تقدم خدمات مهنية واستشارات وخبرات تقنية.',
      features: language === 'en'
        ? ['Professional Consulting', 'Technical Services', 'Management Consulting', 'IT Services']
        : ['استشارات مهنية', 'خدمات تقنية', 'استشارات إدارية', 'خدمات تقنية المعلومات'],
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-primary/90" />
        <div className="container-custom relative z-10 text-center">
          <span className="badge-accent mb-4 inline-block">
            {language === 'en' ? 'LICENSING' : 'الترخيص'}
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
            {t('nav.businessLicense')}
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Choose the right license type for your business in Saudi Arabia'
              : 'اختر نوع الترخيص المناسب لأعمالك في المملكة العربية السعودية'}
          </p>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full mt-6" />
        </div>
      </section>

      {/* License Types */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {licenseTypes.map((license, index) => (
              <div
                key={license.id}
                className="bg-card border border-border rounded-2xl p-8 card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center mb-6">
                  <license.icon className="w-8 h-8 text-accent" />
                </div>

                <h2 className="font-display font-bold text-2xl text-foreground mb-3">
                  {language === 'en' ? license.titleEn : license.titleAr}
                </h2>

                <p className="text-muted-foreground mb-6">
                  {language === 'en' ? license.descEn : license.descAr}
                </p>

                <ul className="space-y-3 mb-8">
                  {license.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground/80">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to={`/business-license/${license.id}`}>
                    {t('common.getStarted')}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default BusinessLicense;
