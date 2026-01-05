import breadCrumbBG from '@/assets/3.webp';
import SimpleParticles from '@/components/animations/SimpleParticles';

interface PageHeroProps {
    badge?: string;
    title: string;
    subtitle?: string;
}

const PageHero = ({ badge, title, subtitle }: PageHeroProps) => {
    return (
        <section className="relative py-20 overflow-hidden" style={{
            backgroundImage: `url(${breadCrumbBG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <SimpleParticles count={50} />
            <div className="absolute inset-0 bg-primary/60 dark:bg-background/40" />
            <div className="container-custom relative z-10 text-center">
                {badge && (
                    <span className="badge-accent mb-4 inline-block">{badge}</span>
                )}
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground dark:text-foreground mb-4">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto dark:text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
};

export default PageHero;
