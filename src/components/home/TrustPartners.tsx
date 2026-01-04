import { useLanguage } from '@/contexts/LanguageContext';

const TrustPartners = () => {
    const { language } = useLanguage();

    const partners = [
        'MISA',
        'MCI',
        'GOSI',
        'Qiwa',
        'ZATCA',
        'Saudi Tourism',
        'MOFA',
        'MOL',
    ];

    return (
        <section className="py-12 bg-secondary/30 overflow-hidden">
            <div className="container-custom mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-2">
                    {language === 'en' ? 'Trusted Partners' : 'شركاء موثوقون'}
                </h2>
                <p className="text-center text-muted-foreground">
                    {language === 'en'
                        ? 'Authorized by leading Saudi government entities'
                        : 'معتمد من قبل الجهات الحكومية السعودية الرائدة'}
                </p>
            </div>

            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-secondary/30 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-secondary/30 to-transparent z-10" />

                <div className="flex animate-marquee">
                    {[...partners, ...partners].map((partner, i) => (
                        <div key={i} className="flex-shrink-0 mx-6">
                            <div className="bg-card border border-border rounded-xl px-8 py-6 shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-lg font-semibold text-foreground whitespace-nowrap">
                                    {partner}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustPartners;
