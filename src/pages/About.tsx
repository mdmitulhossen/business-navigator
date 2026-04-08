import PageHero from '@/components/common/PageHero';
import SEOHead from '@/components/common/SEOHead';
import Layout from '@/components/layout/Layout';
import AboutTeamSectionSkeleton from '@/components/skeleton/AboutTeamSectionSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFetchCMS } from '@/services/useCMSService';
import { useFetchTeamMembers } from '@/services/useTeamService';
import { Award, Lightbulb, Target, type LucideIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

type ValueItem = {
  icon: LucideIcon;
  title: string;
  content: string;
};

const About = () => {
  const { t, language } = useLanguage();
  const { pathname } = useLocation();
  
  // Fetch CMS data
  const { data: cmsData } = useFetchCMS(true);
  const cmsAboutCompany = cmsData?.data?.about_company;

  // Fetch team members
  const { data: teamMembersData, isLoading: isTeamMembersLoading } = useFetchTeamMembers(
    { isActive: true, limit: 1000 },
    true,
  );

  const teamMembers = teamMembersData?.data ?? [];

  // Fallback values (hardcoded)
  const fallbackValues = [
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

  // Use CMS data if available, otherwise use fallback
  const values: ValueItem[] = cmsAboutCompany
    ? [
        {
          icon: Target,
          title: cmsAboutCompany.ourVision || t('about.vision'),
          content: cmsAboutCompany.ourVision || t('about.visionDesc'),
        },
        {
          icon: Lightbulb,
          title: cmsAboutCompany.ourMission || t('about.mission'),
          content: cmsAboutCompany.ourMission || t('about.missionDesc'),
        },
        {
          icon: Award,
          title: cmsAboutCompany.ourValues || t('about.values'),
          content: cmsAboutCompany.ourValues || t('about.valuesDesc'),
        },
      ]
    : fallbackValues.map((val) => ({
        icon: val.icon,
        title: t(val.titleKey),
        content: t(val.descKey),
      }));

  return (
    <Layout>
      <SEOHead pathname={pathname} />
      <PageHero badge={t('about.label')} title={t('about.title')} subtitle={t('about.subtitle')} />

      {/* Values Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-8 text-center card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                {/* <h3 className="font-display font-bold text-xl text-foreground mb-3">
                  {value.title}
                </h3> */}
                <p className="text-muted-foreground">
                  {value.content}
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

          {isTeamMembersLoading ? (
            <AboutTeamSectionSkeleton />
          ) : teamMembers.length ? (
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
                      alt={member.name}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{member.name}</h3>
                  <p className="text-sm text-accent">{member.designation}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              {language === 'en' ? 'No active team members found.' : 'لا يوجد أعضاء فريق نشطون حالياً.'}
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default About;
