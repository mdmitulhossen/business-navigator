import bg1 from '@/assets/1.webp';
import bg2 from '@/assets/2.webp';
import bg3 from '@/assets/3.webp';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ISourceOptions } from '@tsparticles/engine';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const HeroSection2 = () => {
    const { t, isRTL } = useLanguage();
    const [init, setInit] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Hero images for the slider
    // const heroImages = [
    //     'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80', // Modern cityscape
    //     'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80', // Office workspace
    //     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80', // Business meeting
    // ];

    const heroImages = [bg1, bg2, bg3];

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [heroImages.length]);

    const particlesOptions: ISourceOptions = useMemo(() => ({
        fullScreen: false,
        background: {
            color: {
                value: 'transparent',
            },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: 'grab',
                },
                resize: {
                    enable: true,
                },
            },
            modes: {
                grab: {
                    distance: 140,
                    links: {
                        opacity: 0.5,
                    },
                },
            },
        },
        particles: {
            color: {
                value: '#FFD700',
            },
            links: {
                color: '#FFD700',
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: {
                    default: 'bounce',
                },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                },
                value: 80,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: 'circle',
            },
            size: {
                value: { min: 1, max: 3 },
            },
        },
        detectRetina: true,
    }), []);

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Image Slider with Zoom Out Effect */}
            <div className="absolute inset-0 z-0">
                {heroImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <div
                            className={`absolute inset-0 bg-cover bg-center ${currentSlide === index ? 'animate-zoom-out' : ''
                                }`}
                            style={{
                                backgroundImage: `url('${image}')`,
                            }}
                        />
                    </div>
                ))}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
                <div className="hero-overlay absolute inset-0" />
            </div>

            {/* Particles Layer */}
            {init && (
                <Particles
                    id="hero-particles"
                    options={particlesOptions}
                    className="absolute inset-0 z-10"
                />
            )}

            {/* Decorative Elements */}
            {/* <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-slow z-10" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow z-10" /> */}

            {/* Content */}
            <div className="container-custom relative z-20 md:py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/20 text-accent mb-8 animate-fade-in backdrop-blur-sm border border-accent/30">
                        <span className="text-sm font-medium">{t('hero.badge')}</span>
                    </div>

                    {/* Title */}
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 animate-fade-in-up drop-shadow-2xl">
                        {t('hero.title')}{' '}
                        <span className="text-accent">{t('hero.titleHighlight')}</span>{' '}
                        {t('hero.titleEnd')}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2 drop-shadow-lg">
                        {t('hero.subtitle')}
                    </p>

                    {/* CTA Buttons */}
                    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                        <Button
                            asChild
                            size="lg"
                            className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-transform px-8 py-6 text-base font-semibold rounded-lg shadow-xl hover:shadow-2xl"
                        >
                            <Link to="/appointment">
                                {t('hero.cta1')}
                                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md hover:scale-105 transition-transform px-8 py-6 text-base font-semibold rounded-lg shadow-xl"
                        >
                            <Link to="/services">{t('hero.cta2')}</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 gap-2 z-20 hidden sm:flex">
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index
                            ? 'w-8 bg-accent'
                            : 'w-1.5 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-2 md:bottom-8 left-1/2 -translate-x-1/2 -ml-2.5 animate-bounce z-20">
                <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2 backdrop-blur-sm">
                    <div className="w-1 h-2 bg-white/60 rounded-full animate-scroll-down" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection2;
