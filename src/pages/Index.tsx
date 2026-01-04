import CTASection from '@/components/home/CTASection';
import HeroSection from '@/components/home/HeroSection';
import ProcessSection from '@/components/home/ProcessSection';
import ServicesSection from '@/components/home/ServicesSection';
import StatsSection from '@/components/home/StatsSection';
import TrustPartners from '@/components/home/TrustPartners';
import Layout from '@/components/layout/Layout';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <TrustPartners />
      <ServicesSection />
      <ProcessSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
