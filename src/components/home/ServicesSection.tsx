import { Link } from 'react-router-dom';
import { FileText, Edit, Building2, Cpu, Palette, Home, Plane, Users, ArrowRight } from 'lucide-react';
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

const ServicesSection = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="badge-accent mb-4 inline-block">{t('services.label')}</span>
          <h2 className="heading-section text-foreground mb-4">
            {t('services.title')}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            return (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className={`service-card group ${index < 4 ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: `${(index % 4) * 0.1}s` }}
              >
                <div className="service-icon group-hover:bg-accent/20 transition-colors">
                  {IconComponent && <IconComponent className="group-hover:text-accent transition-colors" />}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
                  {t(service.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {t(service.descKey)}
                </p>
                <span className={`inline-flex items-center text-sm font-medium text-accent ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {t('common.learnMore')}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'} group-hover:translate-x-1 transition-transform`} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
