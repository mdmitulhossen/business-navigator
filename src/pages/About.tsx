import { Target, Lightbulb, Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { teamMembers } from '@/data/demoData';

const About = () => {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: Target,
      titleKey: 'about.vision',
      descKey: 'about.visionDesc',
    },
    {
      icon: Lightbulb,
      titleKey: 'about.mission',
      descKey: 'about.missionDesc',
    },
    {
      icon: Award,
      titleKey: 'about.values',
      descKey: 'about.valuesDesc',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-primary/90" />
        <div className="container-custom relative z-10 text-center">
          <span className="badge-accent mb-4 inline-block">{t('about.label')}</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-accent mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={value.titleKey}
                className="bg-card border border-border rounded-2xl p-8 text-center card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">
                  {t(value.titleKey)}
                </h3>
                <p className="text-muted-foreground">
                  {t(value.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="badge-accent mb-4 inline-block">
              {language === 'en' ? 'THE TEAM' : 'الفريق'}
            </span>
            <h2 className="heading-section text-foreground mb-4">
              {t('about.teamTitle')}
            </h2>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={member.image}
                    alt={language === 'en' ? member.nameEn : member.nameAr}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground">
                  {language === 'en' ? member.nameEn : member.nameAr}
                </h3>
                <p className="text-sm text-accent">
                  {language === 'en' ? member.roleEn : member.roleAr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
