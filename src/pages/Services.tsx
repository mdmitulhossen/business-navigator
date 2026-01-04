import { Link } from 'react-router-dom';
import { FileText, Edit, Building2, Cpu, Palette, Home, Plane, Users, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { services } from '@/data/demoData';

const iconMap: Record<string, React.ComponentType<any>> = {
  FileText,
  Edit,
  Building2,
  Cpu,
  Palette,
  Home,
  Plane,
  Users,
};

const Services = () => {
  const { t, language, isRTL } = useLanguage();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-primary/90" />
        <div className="container-custom relative z-10 text-center">
          <span className="badge-accent mb-4 inline-block">{t('services.label')}</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
            {t('services.title')}
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon];
              return (
                <div
                  key={service.id}
                  className="bg-card border border-border rounded-2xl p-8 card-hover group animate-fade-in-up"
                  style={{ animationDelay: `${(index % 3) * 0.1}s` }}
                >
                  <div className="service-icon group-hover:bg-accent/20 transition-colors mb-6">
                    {IconComponent && <IconComponent className="group-hover:text-accent transition-colors" />}
                  </div>
                  
                  <h3 className="font-display font-bold text-xl text-foreground mb-3 group-hover:text-accent transition-colors">
                    {t(service.titleKey)}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {t(service.descKey)}
                  </p>

                  {service.subServices.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {service.subServices.slice(0, 4).map((sub) => (
                        <li key={sub.id} className="flex items-center gap-2 text-sm text-foreground/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          {language === 'en' ? sub.title : sub.titleAr}
                        </li>
                      ))}
                      {service.subServices.length > 4 && (
                        <li className="text-sm text-muted-foreground">
                          +{service.subServices.length - 4} {language === 'en' ? 'more' : 'المزيد'}
                        </li>
                      )}
                    </ul>
                  )}

                  <Link
                    to={`/services/${service.id}`}
                    className={`inline-flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {t('common.learnMore')}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
