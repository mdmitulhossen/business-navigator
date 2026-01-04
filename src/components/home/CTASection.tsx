import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const { language, isRTL } = useLanguage();

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground dark:text-foreground mb-6">
            {language === 'en'
              ? 'Ready to Start Your Business Journey?'
              : 'هل أنت مستعد لبدء رحلة أعمالك؟'}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 dark:text-foreground/80">
            {language === 'en'
              ? 'Get expert guidance and support for establishing your business in Saudi Arabia. Book a free consultation today!'
              : 'احصل على إرشاد ودعم الخبراء لتأسيس أعمالك في المملكة العربية السعودية. احجز استشارة مجانية اليوم!'}
          </p>
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg"
            >
              <Link to="/appointment">
                {language === 'en' ? 'Book Free Consultation' : 'احجز استشارة مجانية'}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 dark:border-foreground/30 dark:text-foreground dark:hover:bg-foreground/10 px-8 py-6 text-base font-semibold rounded-lg"
            >
              <a href="tel:+966112345678">
                <Phone className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                +966 11 234 5678
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
