/* eslint-disable @typescript-eslint/no-explicit-any */
import SimpleParticles from '@/components/animations/SimpleParticles';
import CTASection from '@/components/home/CTASection';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { services } from '@/data/demoData';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const ServiceDetail = () => {
  const { serviceId, subId } = useParams();
  const { t, language, isRTL } = useLanguage();

  const service = services.find(s => s.id === serviceId);

  const subService = subId ? service?.subServices?.find(s => s.id === subId) : null;
  const currentService = subService || service;

  if (!service) {
    return (
      <Layout>
        <div className="container-custom py-10 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {language === 'en' ? 'Service not found' : 'الخدمة غير موجودة'}
          </h1>
          <Button asChild>
            <Link to="/services">
              {language === 'en' ? 'Back to Services' : 'العودة للخدمات'}
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-10 pb-10 bg-gradient-hero overflow-hidden">
        <SimpleParticles count={30} />
        <div className="absolute inset-0 bg-primary/90 dark:bg-background/20" />
        <div className="container-custom relative z-10">
          <Link
            to="/services"
            className={`inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground dark:text-foreground/70 dark:hover:text-foreground mb-6 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {language === 'en' ? 'Back to Services' : 'العودة للخدمات'}
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground dark:text-foreground mb-4">
            {(currentService as any).titleKey ? t((currentService as any).titleKey) : t((currentService as any).title)}
          </h1>
          <p className="text-lg text-primary-foreground/80 dark:text-muted-foreground max-w-2xl">
            {subService ? t(service.descKey) : t((currentService as any).descKey)}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                {language === 'en' ? 'What We Offer' : 'ما نقدمه'}
              </h2>

              <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
                <p>
                  {language === 'en'
                    ? 'Our comprehensive service package includes everything you need to successfully establish and grow your business in Saudi Arabia. We handle all the complex procedures so you can focus on what matters most - your business.'
                    : 'تتضمن باقة خدماتنا الشاملة كل ما تحتاجه لتأسيس أعمالك وتنميتها بنجاح في المملكة العربية السعودية. نتولى جميع الإجراءات المعقدة حتى تتمكن من التركيز على ما يهم حقًا - أعمالك.'}
                </p>
              </div>

              {service.subServices.length > 0 && (
                <>
                  <h3 className="font-display text-xl font-bold text-foreground mb-4">
                    {language === 'en' ? 'Available Services' : 'الخدمات المتاحة'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.subServices.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl"
                      >
                        <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-foreground">
                            {language === 'en' ? sub.title : sub.titleAr}
                          </h4>
                          {'children' in sub && sub.children && (
                            <ul className="mt-2 space-y-1">
                              {(sub.children as any[]).map((child) => (
                                <li key={child.id} className="text-sm text-muted-foreground">
                                  • {language === 'en' ? child.title : child.titleAr}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">
                  {language === 'en' ? 'Get Started Today' : 'ابدأ اليوم'}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {language === 'en'
                    ? 'Contact our team for a free consultation and learn how we can help you.'
                    : 'تواصل مع فريقنا للحصول على استشارة مجانية واكتشف كيف يمكننا مساعدتك.'}
                </p>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/appointment">
                    {language === 'en' ? 'Book Consultation' : 'احجز استشارة'}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            {language === 'en' ? 'Requirements' : 'المتطلبات'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentService as any).requirements?.map((req, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{req}</span>
              </div>
            )) || <p>No requirements available</p>}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            {language === 'en' ? 'Process' : 'العملية'}
          </h2>
          <div className="space-y-4">
            {(currentService as any).process?.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="flex-shrink-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <span className="text-foreground">{step}</span>
              </div>
            )) || <p>No process available</p>}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default ServiceDetail;
