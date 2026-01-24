import { useLanguage } from '@/contexts/LanguageContext';
import { Plane } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FlightBookingWidget = () => {
    const { language } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/flight-booking');
    };

    return (
        <div
            className="fixed left-1 md:left-6 top-[60%] -translate-y-1/2 z-40"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative group">
                {/* Hover Label */}
                <div
                    className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-all duration-300 ${
                        isHovered
                            ? 'opacity-100 translate-x-0 pointer-events-auto'
                            : 'opacity-0 -translate-x-2 pointer-events-none'
                    }`}
                >
                    <span className="font-semibold">
                        {language === 'en' ? 'Book Flight' : 'احجز طيران'}
                    </span>
                    {/* Arrow pointing to button */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-r-8 border-r-white dark:border-r-slate-800 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                </div>

                {/* Main Button */}
                <button
                    onClick={handleClick}
                    className="group/btn relative overflow-hidden"
                    aria-label={language === 'en' ? 'Book Flight' : 'احجز طيران'}
                >
                    {/* Animated background layers */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-sky-400/20 rounded-2xl blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-md opacity-0 group-hover/btn:opacity-100 animate-pulse-slow transition-opacity duration-500" />

                    {/* Main button container */}
                    <div className="relative px-2 py-2 md:px-4 md:py-3 bg-gradient-to-br from-blue-500/95 via-blue-600 to-sky-500/90 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg hover:shadow-2xl group-hover/btn:shadow-blue-500/20 group-hover/btn:scale-105 group-active/btn:scale-95 transition-all duration-300 border border-blue-400/30 group-hover/btn:border-blue-400/50 backdrop-blur-sm">
                        
                        {/* Airplane icon with animation */}
                        <div className="relative">
                            <Plane className="w-6 h-6 md:w-7 md:h-7 text-white fill-white group-hover/btn:rotate-12 group-hover/btn:translate-x-1 transition-transform duration-500 ease-out" />
                            {/* Flight path trail effect */}
                            <div className="absolute -top-1 -left-2 w-8 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-3 transition-all duration-700 delay-100" />
                            {/* Pulse indicator */}
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                        </div>

                        {/* Text label with animation */}
                        <div className="hidden sm:flex flex-col items-start gap-0.5">
                            <span className="text-xs font-bold text-white/80 tracking-widest uppercase opacity-75 group-hover/btn:opacity-100 transition-opacity duration-300">
                                {language === 'en' ? 'Book' : 'احجز'}
                            </span>
                            <span className="text-sm md:text-base font-bold text-white leading-tight group-hover/btn:tracking-wide transition-all duration-300">
                                {language === 'en' ? 'Flight' : 'طيران'}
                            </span>
                        </div>

                        {/* Flying animation background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000 ease-out" />
                    </div>

                    {/* Bottom accent line on hover */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 transform group-hover/btn:scale-150" />
                </button>

                {/* Cloud animation effects */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3 h-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300 delay-200" />
                <div className="absolute -top-6 left-1/4 w-2 h-1 bg-white/15 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300 delay-300" />
                <div className="absolute -top-10 right-1/4 w-4 h-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300 delay-100" />
            </div>
        </div>
    );
};

export default FlightBookingWidget;