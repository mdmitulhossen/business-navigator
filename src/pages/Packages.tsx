import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { type TCMSPackage, useFetchCMS } from '@/services/useCMSService';
import { ArrowUpRight, Building2, CheckCircle2, Globe, Loader2 } from 'lucide-react';

const C = {
  site: 'https://www.soudasa.com/',
  whatsapp: 'https://wa.me/966112345678',
  n800: '#0A1628',
  n700: '#223451',
  n600: '#35507A',
};

const BrandLogo = () => (
  <div className="inline-flex items-center gap-2.5">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: C.n700 }}>
      <Building2 className="h-4 w-4 text-white" />
    </div>
    <div className="leading-none">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">SAUDA</p>
      <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Georgia', serif" }}>
        Investment Consultant
      </p>
    </div>
  </div>
);

const FALLBACK_PACKAGES: TCMSPackage[] = [
  {
    id: 'pkg-1m',
    title: 'Starter Plan',
    subTitle: 'Quick support package',
    duration: '1 month',
    priceSar: 1500,
    descriptions: ['Consultation support', 'Core package access'],
  },
  {
    id: 'pkg-3m',
    title: 'Growth Plan',
    subTitle: 'Recommended for scaling',
    duration: '3 month',
    priceSar: 4000,
    descriptions: ['Priority support', 'Structured progress tracking'],
  },
  {
    id: 'pkg-6m',
    title: 'Professional Plan',
    subTitle: 'Longer execution window',
    duration: '6 month',
    priceSar: 7500,
    descriptions: ['Advanced consulting roadmap', 'Extended advisory sessions'],
  },
  {
    id: 'pkg-12m',
    title: 'Enterprise Plan',
    subTitle: 'Full-year partnership',
    duration: '12 month',
    priceSar: 10000,
    descriptions: ['End-to-end support', 'Dedicated strategic planning'],
  },
];

const normalizePackages = (value: unknown): TCMSPackage[] => {
  if (!Array.isArray(value)) return FALLBACK_PACKAGES;

  const parsed = value
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const source = item as Partial<TCMSPackage>;
      return {
        id: typeof source.id === 'string' && source.id.trim() ? source.id.trim() : `pkg-${index + 1}`,
        title: typeof source.title === 'string' ? source.title : '',
        subTitle: typeof source.subTitle === 'string' ? source.subTitle : '',
        duration: typeof source.duration === 'string' ? source.duration : '',
        priceSar: typeof source.priceSar === 'number' && Number.isFinite(source.priceSar) ? source.priceSar : 0,
        descriptions: Array.isArray(source.descriptions)
          ? source.descriptions.filter((line): line is string => typeof line === 'string' && Boolean(line.trim()))
          : [],
      };
    })
    .filter((item) => item.duration || item.priceSar > 0 || item.title);

  return parsed.length ? parsed.slice(0, 4) : FALLBACK_PACKAGES;
};

const Packages = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { data, isLoading } = useFetchCMS(true);

  const packages = normalizePackages(data?.data?.packages);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-white/90 backdrop-blur-xl dark:bg-[#0A1628]/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo />

          <Button asChild size="sm" variant="secondary" className="h-9 gap-2 border border-border/60 px-4 text-sm font-medium">
            <a href={C.site} target="_blank" rel="noreferrer">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{isArabic ? 'الموقع الرسمي' : 'Website'}</span>
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl" style={{ fontFamily: "'Georgia', serif" }}>
            {isArabic ? 'باقاتنا' : 'Our Packages'}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {isArabic
              ? 'اختر الباقة المناسبة، وجميع التفاصيل أدناه يتم إدارتها مباشرة من لوحة تحكم الإدارة.'
              : 'Choose the right package. All details below are managed directly from the admin CMS dashboard.'}
          </p>
        </div>

        {isLoading && !data ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="flex h-full flex-col border-border/60 bg-card/95 shadow-sm">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg">{pkg.title || (isArabic ? 'باقة' : 'Package')}</CardTitle>
                  <CardDescription>{pkg.subTitle || pkg.duration}</CardDescription>
                  <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-sm">
                    <span className="font-medium">{pkg.duration}</span>
                    <span className="mx-2 text-muted-foreground">·</span>
                    <span className="font-bold" style={{ color: C.n600 }}>{pkg.priceSar} SAR</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="space-y-2">
                    {(pkg.descriptions.length ? pkg.descriptions : [isArabic ? 'تفاصيل الباقة' : 'Package details']).map((line, idx) => (
                      <div key={`${pkg.id}-${idx}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.n600 }} />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
                    <Button asChild variant="outline" className="w-full">
                      <a href={C.whatsapp} target="_blank" rel="noreferrer">
                        {isArabic ? 'التفاصيل' : 'Details'}
                      </a>
                    </Button>
                    <Button asChild className="w-full">
                      <a href={C.whatsapp} target="_blank" rel="noreferrer">
                        {isArabic ? 'اتصل بنا' : 'Contact Us'}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </main>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <footer className="border-t border-border/50 pb-4 pt-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: C.n700 }}>
                <Building2 className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Georgia',serif" }}>
                Sauda Investment Consultant
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a
                href={C.site}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-foreground"
                style={{ color: C.n600 }}
              >
                {isArabic ? 'الموقع الرسمي' : 'Official website'}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <span className="text-border">·</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Packages;
