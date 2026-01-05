import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Clock,
  Factory,
  FileText,
  Globe,
  Mail,
  Phone,
  Plane,
  Shield,
  ShoppingCart,
  Star,
  Users
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BusinessLicense = () => {
  const { language, t, isRTL } = useLanguage();

  const tradeLicenses = [
    {
      icon: ShoppingCart,
      title: language === 'en' ? 'Commercial License' : 'الرخصة التجارية',
      description: language === 'en'
        ? 'For trading and retail activities including import/export, wholesale, and retail sales.'
        : 'للأنشطة التجارية والتجزئة بما في ذلك الاستيراد/التصدير والجملة ومبيعات التجزئة.',
      features: language === 'en'
        ? ['Import/Export Operations', 'Wholesale Distribution', 'Retail Sales', 'E-commerce Integration']
        : ['عمليات الاستيراد/التصدير', 'التوزيع بالجملة', 'المبيعات بالتجزئة', 'التكامل مع التجارة الإلكترونية'],
      duration: language === 'en' ? '2-4 weeks' : '2-4 أسابيع',
      price: language === 'en' ? 'SAR 5,000 - 15,000' : '5,000 - 15,000 ريال'
    },
    {
      icon: Factory,
      title: language === 'en' ? 'Manufacturing License' : 'رخصة التصنيع',
      description: language === 'en'
        ? 'For industrial and manufacturing operations in Saudi Arabia.'
        : 'للعمليات الصناعية والتصنيعية في المملكة العربية السعودية.',
      features: language === 'en'
        ? ['Industrial Setup', 'Manufacturing Permits', 'Quality Control', 'Export Licensing']
        : ['إعداد صناعي', 'تصاريح التصنيع', 'مراقبة الجودة', 'ترخيص التصدير'],
      duration: language === 'en' ? '4-8 weeks' : '4-8 أسابيع',
      price: language === 'en' ? 'SAR 10,000 - 25,000' : '10,000 - 25,000 ريال'
    },
    {
      icon: Globe,
      title: language === 'en' ? 'E-commerce License' : 'رخصة التجارة الإلكترونية',
      description: language === 'en'
        ? 'For online businesses and digital commerce activities.'
        : 'للأعمال التجارية عبر الإنترنت وأنشطة التجارة الرقمية.',
      features: language === 'en'
        ? ['Digital Platform Setup', 'Payment Integration', 'Domain Registration', 'Compliance Management']
        : ['إعداد المنصة الرقمية', 'تكامل الدفع', 'تسجيل النطاق', 'إدارة الامتثال'],
      duration: language === 'en' ? '1-3 weeks' : '1-3 أسابيع',
      price: language === 'en' ? 'SAR 3,000 - 8,000' : '3,000 - 8,000 ريال'
    },
    {
      icon: Plane,
      title: language === 'en' ? 'Tourism License' : 'رخصة السياحة',
      description: language === 'en'
        ? 'For travel agencies, tourism services, and hospitality businesses.'
        : 'لوكالات السفر وخدمات السياحة وشركات الضيافة.',
      features: language === 'en'
        ? ['Travel Agency Setup', 'Tourism Permits', 'Hospitality Services', 'Event Management']
        : ['إعداد وكالة السفر', 'تصاريح السياحة', 'خدمات الضيافة', 'إدارة الفعاليات'],
      duration: language === 'en' ? '3-6 weeks' : '3-6 أسابيع',
      price: language === 'en' ? 'SAR 8,000 - 20,000' : '8,000 - 20,000 ريال'
    },
  ];

  const serviceLicenses = [
    {
      icon: Briefcase,
      title: language === 'en' ? 'Professional License' : 'الرخصة المهنية',
      description: language === 'en'
        ? 'For consulting, legal, accounting, engineering, and other professional services.'
        : 'للاستشارات والخدمات القانونية والمحاسبية والهندسية وغيرها من الخدمات المهنية.',
      features: language === 'en'
        ? ['Professional Accreditation', 'Service Certification', 'Client Management', 'Regulatory Compliance']
        : ['الاعتماد المهني', 'شهادة الخدمة', 'إدارة العملاء', 'الامتثال التنظيمي'],
      duration: language === 'en' ? '2-5 weeks' : '2-5 أسابيع',
      price: language === 'en' ? 'SAR 4,000 - 12,000' : '4,000 - 12,000 ريال'
    },
    {
      icon: FileText,
      title: language === 'en' ? 'Contracting License' : 'رخصة المقاولات',
      description: language === 'en'
        ? 'For construction, maintenance, and contracting services.'
        : 'لخدمات البناء والصيانة والمقاولات.',
      features: language === 'en'
        ? ['Construction Permits', 'Safety Certifications', 'Project Management', 'Quality Assurance']
        : ['تصاريح البناء', 'شهادات السلامة', 'إدارة المشاريع', 'ضمان الجودة'],
      duration: language === 'en' ? '4-8 weeks' : '4-8 أسابيع',
      price: language === 'en' ? 'SAR 12,000 - 30,000' : '12,000 - 30,000 ريال'
    },
  ];

  const requirements = language === 'en'
    ? [
      'Valid passport copy of shareholders/directors',
      'Company documents (AOA, MOA, Board Resolution)',
      'Proof of business address',
      'Bank reference letter',
      'Business plan and feasibility study',
      'NOC from employer (if applicable)',
    ]
    : [
      'نسخة جواز سفر ساري للمساهمين/المديرين',
      'مستندات الشركة (عقد التأسيس، النظام الأساسي، قرار مجلس الإدارة)',
      'إثبات عنوان العمل',
      'خطاب مرجعي من البنك',
      'خطة العمل ودراسة الجدوى',
      'عدم ممانعة من صاحب العمل (إن وجد)',
    ];

  const stats = [
    { icon: Users, value: '500+', label: language === 'en' ? 'Clients Served' : 'عميل تم خدمتهم' },
    { icon: Award, value: '98%', label: language === 'en' ? 'Success Rate' : 'معدل النجاح' },
    { icon: Clock, value: '24/7', label: language === 'en' ? 'Support' : 'الدعم' },
    { icon: Shield, value: '100%', label: language === 'en' ? 'Compliance' : 'الامتثال' },
  ];

  const processSteps = language === 'en'
    ? [
      { step: '01', title: 'Initial Consultation', desc: 'Discuss your business needs and requirements' },
      { step: '02', title: 'Document Preparation', desc: 'Gather and prepare all necessary documents' },
      { step: '03', title: 'Application Submission', desc: 'Submit applications to relevant authorities' },
      { step: '04', title: 'License Approval', desc: 'Receive your business license' },
    ]
    : [
      { step: '01', title: 'الاستشارة الأولية', desc: 'مناقشة احتياجات عملك ومتطلباتك' },
      { step: '02', title: 'إعداد المستندات', desc: 'جمع وإعداد جميع المستندات اللازمة' },
      { step: '03', title: 'تقديم الطلب', desc: 'تقديم الطلبات إلى الجهات المعنية' },
      { step: '04', title: 'اعتماد الترخيص', desc: 'الحصول على رخصة عملك' },
    ];

  return (
    <>
      <Helmet>
        <title>{language === 'en' ? 'Business License - Consultant' : 'تراخيص الأعمال - المستشار'}</title>
        <meta name="description" content={language === 'en'
          ? 'Get your trade or service license in Saudi Arabia. We help with MISA, MCI registration and all licensing requirements.'
          : 'احصل على رخصتك التجارية أو الخدمية في المملكة العربية السعودية. نساعد في تسجيل ميسا ووزارة التجارة وجميع متطلبات الترخيص.'
        } />
      </Helmet>
      <Layout>
        <PageHero
          badge={language === 'en' ? 'Start Your Business Journey' : 'ابدأ رحلتك التجارية'}
          title={language === 'en' ? 'Business License Services' : 'خدمات تراخيص الأعمال'}
          subtitle={language === 'en'
            ? 'Choose between Trade License for commercial activities or Service License for professional services. We handle everything from registration to approval.'
            : 'اختر بين الرخصة التجارية للأنشطة التجارية أو رخصة الخدمات للخدمات المهنية. نحن نتولى كل شيء من التسجيل إلى الموافقة.'}
        />

        {/* Stats */}
        <section className="py-16 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section >

        {/* Trade Licenses */}
        < section className="py-20 bg-background" >
          <div className="container mx-auto px-4">
            <div className={cn("mb-16 text-center", isRTL && "text-right")}>
              <Badge variant="outline" className="mb-4">
                {language === 'en' ? 'Trade License' : 'الرخصة التجارية'}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {language === 'en' ? 'Trade License Types' : 'أنواع الرخص التجارية'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {language === 'en'
                  ? 'Trade licenses are required for businesses involved in buying, selling, importing, exporting, or manufacturing goods. Choose the type that best fits your business model.'
                  : 'الرخص التجارية مطلوبة للشركات العاملة في شراء أو بيع أو استيراد أو تصدير أو تصنيع البضائع. اختر النوع الذي يناسب نموذج عملك بشكل أفضل.'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tradeLicenses.map((license, idx) => (
                <Card key={idx} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                      <license.icon className="w-8 h-8 text-accent" />
                    </div>
                    <CardTitle className={cn("text-xl", isRTL && "text-right")}>
                      {license.title}
                    </CardTitle>
                    <CardDescription className={cn("text-base", isRTL && "text-right")}>
                      {license.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      {license.features.map((feature, i) => (
                        <div key={i} className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-sm text-foreground/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="mb-4" />
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{license.duration}</span>
                      </div>
                      <div className="font-semibold text-accent">{license.price}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section >

        {/* Service Licenses */}
        < section className="py-20 bg-muted/30" >
          <div className="container mx-auto px-4">
            <div className={cn("mb-16 text-center", isRTL && "text-right")}>
              <Badge variant="outline" className="mb-4">
                {language === 'en' ? 'Service License' : 'رخصة الخدمات'}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {language === 'en' ? 'Service License Types' : 'أنواع رخص الخدمات'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {language === 'en'
                  ? 'Service licenses are for businesses providing professional, consulting, or technical services. Perfect for consultants, agencies, and service providers.'
                  : 'رخص الخدمات للشركات التي تقدم خدمات مهنية أو استشارية أو تقنية. مثالي للمستشارين والوكالات ومقدمي الخدمات.'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {serviceLicenses.map((license, idx) => (
                <Card key={idx} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                      <license.icon className="w-8 h-8 text-accent" />
                    </div>
                    <CardTitle className={cn("text-xl", isRTL && "text-right")}>
                      {license.title}
                    </CardTitle>
                    <CardDescription className={cn("text-base", isRTL && "text-right")}>
                      {license.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      {license.features.map((feature, i) => (
                        <div key={i} className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-sm text-foreground/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="mb-4" />
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{license.duration}</span>
                      </div>
                      <div className="font-semibold text-accent">{license.price}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section >

        {/* Process */}
        < section className="py-20 bg-background" >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                {language === 'en' ? 'Our Process' : 'عمليتنا'}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {language === 'en' ? 'How We Get Your License' : 'كيف نحصل على ترخيصك'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === 'en'
                  ? 'We follow a systematic approach to ensure your business license is obtained efficiently and correctly.'
                  : 'نتبع نهجًا منهجيًا لضمان الحصول على رخصة عملك بكفاءة وبشكل صحيح.'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/30 transition-colors">
                    <span className="text-xl font-bold text-accent">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                  {idx < processSteps.length - 1 && (
                    <ChevronRight className="w-6 h-6 text-accent mx-auto mt-4 hidden lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section >

        {/* Requirements */}
        < section className="py-20 bg-muted/30" >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className={isRTL ? "text-right" : ""}>
                <Badge variant="outline" className="mb-4">
                  {language === 'en' ? 'Requirements' : 'المتطلبات'}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {language === 'en' ? 'Document Requirements' : 'متطلبات المستندات'}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {language === 'en'
                    ? 'We help you prepare and submit all required documents for your business license application.'
                    : 'نساعدك في إعداد وتقديم جميع المستندات المطلوبة لطلب رخصة عملك.'}
                </p>
                <ul className="space-y-4 mb-8">
                  {requirements.map((req, idx) => (
                    <li key={idx} className={cn(
                      "flex items-start gap-3",
                      isRTL && "flex-row-reverse"
                    )}>
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{req}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link to="/appointment">
                      {language === 'en' ? 'Start Application' : 'ابدأ الطلب'}
                      <ArrowRight className={cn("w-4 h-4 ml-2", isRTL && "rotate-180")} />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/contact">
                      <Mail className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Get Quote' : 'احصل على عرض أسعار'}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <FileText className="w-32 h-32 text-accent/30" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-background border rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">4.9/5</div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Client Rating' : 'تقييم العملاء'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section >

        {/* CTA */}
        < section className="py-20 bg-primary text-primary-foreground dark:bg-background/20" >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-foreground">
              {language === 'en' ? 'Ready to Start Your Business?' : 'مستعد لبدء عملك؟'}
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 dark:text-muted-foreground">
              {language === 'en'
                ? 'Contact our experts today and get your business license in Saudi Arabia with confidence.'
                : 'اتصل بخبرائنا اليوم واحصل على رخصة عملك في المملكة العربية السعودية بثقة.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/appointment">
                  <Phone className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Book Consultation' : 'احجز استشارة'}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 dark:border-foreground/30 dark:text-foreground dark:hover:bg-foreground/10">
                <Link to="/contact">
                  <Mail className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Contact Sales' : 'اتصل بالمبيعات'}
                </Link>
              </Button>
            </div>
          </div>
        </section >
      </Layout >
    </>
  );
};

export default BusinessLicense;
