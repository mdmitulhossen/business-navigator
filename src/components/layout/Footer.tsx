import SimpleParticles from '@/components/animations/SimpleParticles';
import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t, language } = useLanguage();

  const quickLinks = [
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.services'), path: '/services' },
    { label: t('nav.blog'), path: '/blog' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground dark:bg-background dark:text-white relative overflow-hidden">
      <SimpleParticles count={55} />
      <div className="container-custom py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img
                src="/logoWithoutText.png"
                alt="Souda Investment Logo"
                className="h-12 w-auto object-contain transition-all duration-300"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
              <div className="flex flex-col">
                <span className="font-bold text-xs text-primary-foreground dark:text-slate-100">
                  SAUDA INVESTMENT CONSULTANT
                  {/* {language === 'en' ? 'Souda Investment' : 'السعودي الاستثمار'} */}
                </span>
                <span className="text-lg text-primary-foreground dark:text-slate-100">
                  السعودي الاستثمار والمستشار
                  {/* {language === 'en' ? 'Consultant' : 'والمستشار'} */}
                </span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/80 dark:text-white/70 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 dark:bg-white/10 dark:hover:bg-accent/20 transition-all duration-200 hover:scale-105"
              >
                <Twitter className="w-5 h-5 text-primary-foreground/70 dark:text-white/70 dark:hover:text-accent" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 dark:bg-white/10 dark:hover:bg-accent/20 transition-all duration-200 hover:scale-105"
              >
                <Linkedin className="w-5 h-5 text-primary-foreground/70 dark:text-white/70 dark:hover:text-accent" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 dark:bg-white/10 dark:hover:bg-accent/20 transition-all duration-200 hover:scale-105"
              >
                <Instagram className="w-5 h-5 text-primary-foreground/70 dark:text-white/70 dark:hover:text-accent" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-accent dark:text-accent dark:font-bold">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/80 dark:text-white/70 hover:text-primary-foreground dark:hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h3 className="font-display font-semibold text-lg mb-4 text-accent dark:text-accent dark:font-bold">
              {t('footer.contactInfo')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80 dark:text-white/70 leading-relaxed">
                  {language === 'en'
                    ? 'Kingdom of Saudi Arabia, Riyadh, Olaya District, King Fahd Road'
                    : 'المملكة العربية السعودية، الرياض، حي العليا، طريق الملك فهد'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80 dark:text-white/70" dir="ltr">
                  +966 11 234 5678
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80 dark:text-white/70">
                  info@consultant.sa
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60 dark:text-white/50">
            {t('footer.rights')}
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-sm text-primary-foreground/60 dark:text-white/50 hover:text-primary-foreground dark:hover:text-accent transition-colors duration-200"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              to="/terms"
              className="text-sm text-primary-foreground/60 dark:text-white/50 hover:text-primary-foreground dark:hover:text-accent transition-colors duration-200"
            >
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
