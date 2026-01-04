import { FileCheck, Award, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProcessSection = () => {
  const { language } = useLanguage();

  const steps = [
    {
      icon: FileCheck,
      titleEn: 'Documentation',
      titleAr: 'التوثيق',
      descEn: 'We help you complete all legal groundwork, licensing, and documentation needed to officially establish your company in Saudi Arabia.',
      descAr: 'نساعدك في إكمال جميع الأعمال القانونية والتراخيص والوثائق اللازمة لتأسيس شركتك رسمياً في المملكة العربية السعودية.',
      items: language === 'en' 
        ? [
            'Define business activity & Saudization requirements',
            'Prepare BOD Resolution, POA & AoA',
            'Collect and notarize required documents',
            'Name reservation & MISA license application',
            'AoA approval & publication',
            'Commercial Registration (CR) & Chamber of Commerce registration',
          ]
        : [
            'تحديد النشاط التجاري ومتطلبات السعودة',
            'إعداد قرار مجلس الإدارة والتوكيل والنظام الأساسي',
            'جمع وتوثيق المستندات المطلوبة',
            'حجز الاسم وتقديم طلب ترخيص ميسا',
            'الموافقة على النظام الأساسي ونشره',
            'السجل التجاري وتسجيل الغرفة التجارية',
          ],
    },
    {
      icon: Award,
      titleEn: 'Licensing',
      titleAr: 'الترخيص',
      descEn: 'We manage all critical registrations with the Ministry of Labor (MoL), GOSI, and ZATCA to keep your Saudi business setup compliant and on track.',
      descAr: 'ندير جميع التسجيلات الهامة مع وزارة العمل والتأمينات الاجتماعية وهيئة الزكاة والضريبة للحفاظ على امتثال أعمالك.',
      items: language === 'en'
        ? [
            'Company stamp issuance',
            'MoL, GOSI & National Address (SPL) registration',
            'ZATCA & VAT registration',
            'General Manager visa application',
            'ENJAZE delegation & attestation',
          ]
        : [
            'إصدار ختم الشركة',
            'تسجيل وزارة العمل والتأمينات والعنوان الوطني',
            'تسجيل الزكاة وضريبة القيمة المضافة',
            'طلب تأشيرة المدير العام',
            'تفويض وتصديق إنجاز',
          ],
    },
    {
      icon: Rocket,
      titleEn: 'Full Activation & Operational Launch',
      titleAr: 'التفعيل الكامل والانطلاق التشغيلي',
      descEn: 'Your company becomes fully active with all portals, permits, and banking formalities completed.',
      descAr: 'تصبح شركتك نشطة بالكامل مع إتمام جميع البوابات والتصاريح والإجراءات البنكية.',
      items: language === 'en'
        ? [
            'GM visit, border number & work permit',
            'Iqama issuance, medical test & insurance',
            'MoL activation & Chamber reactivation',
            'Absher, Qiwa, Muqeem & Mudad activation',
            'Corporate bank account setup',
          ]
        : [
            'زيارة المدير العام ورقم الحدود وتصريح العمل',
            'إصدار الإقامة والفحص الطبي والتأمين',
            'تفعيل وزارة العمل وإعادة تفعيل الغرفة',
            'تفعيل أبشر وقوى ومقيم ومدد',
            'فتح حساب بنكي للشركة',
          ],
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="badge-accent mb-4 inline-block">
            {language === 'en' ? 'HOW WE WORK' : 'كيف نعمل'}
          </span>
          <h2 className="heading-section text-foreground mb-4">
            {language === 'en' ? 'Our Process' : 'عمليتنا'}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative bg-card border border-border rounded-2xl p-6 md:p-8 card-hover ${
                index === 1 ? 'bg-secondary/50' : ''
              }`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                index === 1 ? 'bg-accent/20' : 'bg-muted'
              }`}>
                <step.icon className={`w-8 h-8 ${index === 1 ? 'text-accent' : 'text-primary'}`} />
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-xl text-foreground mb-3">
                {language === 'en' ? step.titleEn : step.titleAr}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-6">
                {language === 'en' ? step.descEn : step.descAr}
              </p>

              {/* Items */}
              <ul className="space-y-3">
                {step.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="text-accent mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
