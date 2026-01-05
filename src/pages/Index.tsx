import CTASection from '@/components/home/CTASection';
import HeroSection2 from '@/components/home/HeroSection2';
import ProcessSection from '@/components/home/ProcessSection';
import ServicesSection from '@/components/home/ServicesSection';
import StatsSection from '@/components/home/StatsSection';
import TrustPartners from '@/components/home/TrustPartners';
import Layout from '@/components/layout/Layout';

const Index = () => {
  return (
    <Layout>
      <HeroSection2 />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <TrustPartners />
      <CTASection />
    </Layout>
  );
};

export default Index;
