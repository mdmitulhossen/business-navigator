import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.businessLicense': 'Business License',
    'nav.blog': 'Blog',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.appointment': 'Book Appointment',
    
    // Hero
    'hero.badge': 'Vision 2030 - Building the Future',
    'hero.title': 'Your Strategic Partner',
    'hero.titleHighlight': 'for Business Growth',
    'hero.titleEnd': 'in KSA',
    'hero.subtitle': 'Providing integrated solutions for company formation, commercial licenses, and legal consultations to help you launch and succeed in the Saudi market.',
    'hero.cta1': 'Request Free Consultation',
    'hero.cta2': 'Explore Our Services',
    
    // Stats
    'stats.years': 'Years of Experience',
    'stats.clients': 'Happy Clients',
    'stats.companies': 'Established Companies',
    'stats.consultants': 'Expert Consultants',
    
    // Services
    'services.label': 'WHAT WE OFFER',
    'services.title': 'Our Integrated Services',
    'services.businessLicense': 'Business License',
    'services.businessLicenseDesc': 'Complete licensing solutions for MISA and MCI registrations.',
    'services.amendment': 'Amendment Service',
    'services.amendmentDesc': 'Activities and position amendments for your business.',
    'services.govService': 'Gov Service Solution',
    'services.govServiceDesc': 'Immigration, Visa, VAT, Tax & Zakat solutions.',
    'services.aiIt': 'AI / IT Solution',
    'services.aiItDesc': 'Modern technology solutions for your business growth.',
    'services.design': 'Design & Advertising',
    'services.designDesc': 'Creative branding and marketing solutions.',
    'services.realEstate': 'Real Estate',
    'services.realEstateDesc': 'Property investment and management services.',
    'services.travel': 'Travel & Tourism',
    'services.travelDesc': 'Investment opportunities in travel sector.',
    'services.manpower': 'Manpower',
    'services.manpowerDesc': 'Workforce solutions and HR services.',
    
    // License Types
    'license.trade': 'Trade License',
    'license.service': 'Service License',
    'license.manufacturing': 'Manufacturing License',
    'license.ecommerce': 'E-commerce License',
    'license.commercial': 'Commercial License',
    'license.professional': 'Professional License',
    'license.tourism': 'Tourism License',
    
    // Gov Services
    'gov.immigration': 'Immigration And Visa',
    'gov.goldenVisa': 'Golden Visa',
    'gov.residenceVisa': 'Residence Visa',
    'gov.workingVisa': 'Working Visa',
    'gov.vat': 'VAT',
    'gov.tax': 'Tax & Zakat',
    'gov.accounting': 'Accounting Solution',
    'gov.qiwa': 'Qiwa Service',
    'gov.muqeem': 'Muqeem',
    'gov.nationalAddress': 'National Address',
    'gov.gosi': 'GOSI Service',
    
    // About
    'about.label': 'About Us',
    'about.title': 'The Consultant',
    'about.subtitle': 'A Saudi success story, with a global vision and expertise that transcends boundaries.',
    'about.vision': 'Our Vision',
    'about.visionDesc': 'To be the leading consulting firm in the Kingdom, contributing to achieving Vision 2030 goals.',
    'about.mission': 'Our Mission',
    'about.missionDesc': 'Providing integrated consulting services with global standards and simplifying complex procedures.',
    'about.values': 'Our Values',
    'about.valuesDesc': 'Integrity, transparency, professionalism, and commitment to quality in everything we do.',
    'about.teamTitle': 'Our Leadership Team',
    
    // Contact
    'contact.label': 'We are here for you',
    'contact.title': 'Contact Us',
    'contact.formTitle': 'Send Your Inquiry',
    'contact.formSubtitle': 'Fill the form below and our team will contact you shortly.',
    'contact.name': 'Full Name',
    'contact.phone': 'Phone Number',
    'contact.email': 'Email Address',
    'contact.company': 'Company Name (Optional)',
    'contact.service': 'Service Type',
    'contact.message': 'Message Details',
    'contact.submit': 'Submit Request',
    'contact.office': 'Main Office',
    'contact.address': 'King Fahd Road, Olaya District, Riyadh, Kingdom of Saudi Arabia',
    'contact.phoneLabel': 'Phone',
    'contact.emailLabel': 'Email',
    'contact.hours': 'Working Hours',
    'contact.hoursValue': 'Sunday - Thursday: 9:00 AM - 5:00 PM',
    
    // Blog
    'blog.label': 'Articles',
    'blog.title': 'Knowledge & News',
    'blog.readMore': 'Read More',
    
    // Footer
    'footer.description': 'A leading licensed consulting firm in Saudi Arabia, specializing in company formation, legal, and administrative solutions.',
    'footer.quickLinks': 'Quick Links',
    'footer.contactInfo': 'Contact Information',
    'footer.rights': '© 2025 All Rights Reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    
    // Common
    'common.learnMore': 'Learn More',
    'common.getStarted': 'Get Started',
    'common.selectService': 'Select a service...',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.businessLicense': 'تراخيص الأعمال',
    'nav.blog': 'المدونة',
    'nav.about': 'من نحن',
    'nav.contact': 'تواصل معنا',
    'nav.appointment': 'حجز موعد',
    
    // Hero
    'hero.badge': 'رؤية 2030 - بناء المستقبل',
    'hero.title': 'شريكك الاستراتيجي',
    'hero.titleHighlight': 'لنمو الأعمال',
    'hero.titleEnd': 'في المملكة',
    'hero.subtitle': 'نقدم حلولاً متكاملة لتأسيس الشركات والتراخيص التجارية والاستشارات القانونية لمساعدتك على الانطلاق والنجاح في السوق السعودي.',
    'hero.cta1': 'احصل على استشارة مجانية',
    'hero.cta2': 'استكشف خدماتنا',
    
    // Stats
    'stats.years': 'سنوات الخبرة',
    'stats.clients': 'عميل سعيد',
    'stats.companies': 'شركة تأسست',
    'stats.consultants': 'مستشار خبير',
    
    // Services
    'services.label': 'ما نقدمه',
    'services.title': 'خدماتنا المتكاملة',
    'services.businessLicense': 'تراخيص الأعمال',
    'services.businessLicenseDesc': 'حلول ترخيص شاملة لتسجيلات ميسا ووزارة التجارة.',
    'services.amendment': 'خدمات التعديل',
    'services.amendmentDesc': 'تعديلات الأنشطة والمناصب لأعمالك.',
    'services.govService': 'حلول الخدمات الحكومية',
    'services.govServiceDesc': 'حلول الهجرة والتأشيرات وضريبة القيمة المضافة والزكاة.',
    'services.aiIt': 'حلول الذكاء الاصطناعي وتقنية المعلومات',
    'services.aiItDesc': 'حلول تقنية حديثة لنمو أعمالك.',
    'services.design': 'التصميم والإعلان',
    'services.designDesc': 'حلول إبداعية للعلامات التجارية والتسويق.',
    'services.realEstate': 'العقارات',
    'services.realEstateDesc': 'خدمات الاستثمار وإدارة العقارات.',
    'services.travel': 'السياحة والسفر',
    'services.travelDesc': 'فرص استثمارية في قطاع السياحة.',
    'services.manpower': 'القوى العاملة',
    'services.manpowerDesc': 'حلول القوى العاملة وخدمات الموارد البشرية.',
    
    // License Types
    'license.trade': 'رخصة تجارية',
    'license.service': 'رخصة خدمات',
    'license.manufacturing': 'رخصة تصنيع',
    'license.ecommerce': 'رخصة تجارة إلكترونية',
    'license.commercial': 'رخصة تجارية',
    'license.professional': 'رخصة مهنية',
    'license.tourism': 'رخصة سياحية',
    
    // Gov Services
    'gov.immigration': 'الهجرة والتأشيرات',
    'gov.goldenVisa': 'التأشيرة الذهبية',
    'gov.residenceVisa': 'تأشيرة الإقامة',
    'gov.workingVisa': 'تأشيرة العمل',
    'gov.vat': 'ضريبة القيمة المضافة',
    'gov.tax': 'الضرائب والزكاة',
    'gov.accounting': 'الحلول المحاسبية',
    'gov.qiwa': 'خدمة قوى',
    'gov.muqeem': 'مقيم',
    'gov.nationalAddress': 'العنوان الوطني',
    'gov.gosi': 'خدمة التأمينات الاجتماعية',
    
    // About
    'about.label': 'من نحن',
    'about.title': 'المستشار',
    'about.subtitle': 'قصة نجاح سعودية، برؤية عالمية وخبرات تتجاوز الحدود.',
    'about.vision': 'رؤيتنا',
    'about.visionDesc': 'أن نكون الشركة الاستشارية الرائدة في المملكة، والمساهمة في تحقيق أهداف رؤية 2030.',
    'about.mission': 'رسالتنا',
    'about.missionDesc': 'تقديم خدمات استشارية متكاملة بمعايير عالمية وتبسيط الإجراءات المعقدة.',
    'about.values': 'قيمنا',
    'about.valuesDesc': 'النزاهة والشفافية والاحترافية والالتزام بالجودة في كل ما نقدمه.',
    'about.teamTitle': 'فريقنا القيادي',
    
    // Contact
    'contact.label': 'نحن هنا لخدمتك',
    'contact.title': 'تواصل معنا',
    'contact.formTitle': 'أرسل استفسارك',
    'contact.formSubtitle': 'املأ النموذج أدناه وسيتواصل فريقنا معك في أقرب وقت.',
    'contact.name': 'الاسم الكامل',
    'contact.phone': 'رقم الجوال',
    'contact.email': 'البريد الإلكتروني',
    'contact.company': 'اسم الشركة (اختياري)',
    'contact.service': 'نوع الخدمة المطلوبة',
    'contact.message': 'تفاصيل الاستفسار',
    'contact.submit': 'إرسال الطلب',
    'contact.office': 'المكتب الرئيسي',
    'contact.address': 'طريق الملك فهد، حي العليا، الرياض، المملكة العربية السعودية',
    'contact.phoneLabel': 'الهاتف',
    'contact.emailLabel': 'البريد الإلكتروني',
    'contact.hours': 'ساعات العمل',
    'contact.hoursValue': 'الأحد - الخميس: 9:00 ص - 5:00 م',
    
    // Blog
    'blog.label': 'المقالات',
    'blog.title': 'المعرفة والأخبار',
    'blog.readMore': 'اقرأ المزيد',
    
    // Footer
    'footer.description': 'شركة استشارية مرخصة رائدة في المملكة العربية السعودية، متخصصة في تأسيس الشركات والحلول القانونية والإدارية.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.contactInfo': 'معلومات التواصل',
    'footer.rights': '© 2025 جميع الحقوق محفوظة.',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الاستخدام',
    
    // Common
    'common.learnMore': 'اعرف المزيد',
    'common.getStarted': 'ابدأ الآن',
    'common.selectService': 'اختر الخدمة...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
