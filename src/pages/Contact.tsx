import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { serviceCategories, serviceCategoriesAr } from '@/data/demoData';

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo - just log the data
    console.log('Form submitted:', formData);
    alert(language === 'en' ? 'Thank you! We will contact you soon.' : 'شكراً لك! سنتواصل معك قريباً.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      labelKey: 'contact.office',
      value: t('contact.address'),
    },
    {
      icon: Phone,
      labelKey: 'contact.phoneLabel',
      value: '+966 11 234 5678',
    },
    {
      icon: Mail,
      labelKey: 'contact.emailLabel',
      value: 'info@consultant.sa',
    },
    {
      icon: Clock,
      labelKey: 'contact.hours',
      value: t('contact.hoursValue'),
    },
  ];

  const categories = language === 'en' ? serviceCategories : serviceCategoriesAr;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-primary/90" />
        <div className="container-custom relative z-10 text-center">
          <span className="badge-accent mb-4 inline-block">{t('contact.label')}</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
            {t('contact.title')}
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="bg-primary text-primary-foreground rounded-2xl p-8 mb-8">
                <h2 className="font-display font-bold text-2xl mb-8 text-accent">
                  {t('contact.office')}
                </h2>
                <ul className="space-y-6">
                  {contactInfo.map((item) => (
                    <li key={item.labelKey} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-primary-foreground/70 mb-1">
                          {t(item.labelKey)}
                        </p>
                        <p className="font-medium" dir={item.labelKey === 'contact.phoneLabel' ? 'ltr' : undefined}>
                          {item.value}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map Placeholder */}
              <div className="bg-muted rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-accent" />
                  <p>{language === 'en' ? '(Google Maps)' : '(خريطة جوجل)'}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                {t('contact.formTitle')}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t('contact.formSubtitle')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">{t('contact.name')}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">{t('contact.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">{t('contact.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">{t('contact.company')}</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">{t('contact.service')}</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">{t('common.selectService')}</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">{t('contact.message')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="form-input resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {t('contact.submit')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
