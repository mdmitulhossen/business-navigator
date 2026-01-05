import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Moon, X } from 'lucide-react';
import { useState } from 'react';

interface PrayerTime {
    name: string;
    nameAr: string;
    time: string;
    period: string;
    periodAr: string;
    icon: string;
}

const PrayerTimesWidget = () => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    // Prayer times for Saudi Arabia (Riyadh)
    const prayerTimes: PrayerTime[] = [
        { name: 'Fajr', nameAr: 'الفجر', time: '05:15', period: 'Early Morning', periodAr: 'قبل الشروق', icon: '🌙' },
        { name: 'Dhuhr', nameAr: 'الظهر', time: '12:30', period: 'Noon', periodAr: 'منتصف اليوم', icon: '☀️' },
        { name: 'Asr', nameAr: 'العصر', time: '15:45', period: 'Afternoon', periodAr: 'بعد الظهر', icon: '🌤️' },
        { name: 'Maghrib', nameAr: 'المغرب', time: '18:15', period: 'Evening', periodAr: 'عند الغروب', icon: '🌅' },
        { name: 'Isha', nameAr: 'العشاء', time: '19:45', period: 'Night', periodAr: 'بعد الغروب', icon: '🌙' },
    ];

    return (
        <>
            {/* Modern Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed left-1 md:left-6 top-1/2 -translate-y-1/2 z-40 group"
                aria-label="Prayer times"
            >
                <div className="relative">
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 animate-pulse-slow transition-opacity duration-500" />

                    {/* Main button with refined styling */}
                    <div className="relative px-2 py-2 md:px-4 md:py-3 bg-gradient-to-br from-primary/95 via-primary to-primary/90 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg hover:shadow-2xl group-hover:shadow-primary/20 group-hover:scale-105 group-active:scale-95 transition-all duration-300 border border-primary/30 group-hover:border-primary/50 backdrop-blur-sm">

                        {/* Icon with subtle animation */}
                        <div className="relative">
                            <Moon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground fill-primary-foreground group-hover:-rotate-12 transition-transform duration-500 ease-out" />
                            {/* Subtle pulse dot */}
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                        </div>

                        {/* Text label with animation */}
                        <div className="hidden sm:flex flex-col items-start gap-0.5">
                            <span className="text-xs font-bold text-primary-foreground/80 tracking-widest uppercase opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                                {language === 'en' ? 'Prayer' : 'أوقات'}
                            </span>
                            <span className="text-sm md:text-base font-bold text-primary-foreground leading-tight group-hover:tracking-wide transition-all duration-300">
                                {language === 'en' ? 'Times' : 'الصلاة'}
                            </span>
                        </div>

                    </div>

                    {/* Bottom accent line on hover */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-150" />
                </div>
            </button>

            {/* Modal Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Modal */}
            <div
                className={`fixed left-0 right-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 px-4 sm:px-8 md:left-4 md:right-auto ${isOpen
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                    }`}
            >
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-border dark:border-slate-700 w-full sm:w-96 mx-auto sm:mx-0">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-4 sm:p-6 text-primary-foreground">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <h2 className="font-display text-xl sm:text-2xl font-bold truncate">
                                {language === 'en' ? 'Prayer Times' : 'مواقيت الصلاة'}
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-primary-foreground/20 rounded-full transition-colors flex-shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-primary-foreground/90 text-xs sm:text-sm">
                            {language === 'en' ? 'Riyadh, Saudi Arabia' : 'الرياض، المملكة العربية السعودية'}
                        </p>
                    </div>

                    {/* Prayer Times List */}
                    <div className="p-4 sm:p-6 space-y-2 sm:space-y-3 max-h-[60vh] sm:max-h-none overflow-y-auto">
                        {prayerTimes.map((prayer, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-muted/50 dark:bg-slate-800 hover:bg-muted dark:hover:bg-slate-700 transition-colors group cursor-pointer"
                            >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg sm:text-xl">{prayer.icon}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate text-sm sm:text-base">
                                            {language === 'en' ? prayer.name : prayer.nameAr}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {language === 'en' ? 'Prayer Time' : 'وقت الصلاة'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                    <p className="font-display font-bold text-base sm:text-lg text-primary">
                                        {prayer.time}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {language === 'en' ? prayer.period : prayer.periodAr}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="px-4 sm:px-6 py-3 sm:py-4 bg-muted/30 dark:bg-slate-800/50 border-t border-border dark:border-slate-700">
                        <p className="text-xs text-muted-foreground text-center">
                            {language === 'en'
                                ? 'Prayer times updated daily'
                                : 'يتم تحديث مواقيت الصلاة يوميًا'}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border dark:border-slate-700">
                        <Button
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base"
                            onClick={() => setIsOpen(false)}
                        >
                            {language === 'en' ? 'Close' : 'إغلاق'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrayerTimesWidget;
