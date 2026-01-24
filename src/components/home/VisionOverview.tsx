
import video2030 from '@/assets/home_page_video.webm';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const VisionOverview = () => {
    const navigate = useNavigate();

    const handleReadMore = () => {
        navigate('/explore-saudi');
    };

    return (
        <section className="relative w-full h-screen min-h-[650px] overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0">
                <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={video2030} type="video/webm" />
                    Your browser does not support the video tag.
                </video>
                {/* Video Overlay */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        {/* Left Side - Main Content */}
                        <div className="flex-1 text-white">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
                                Saudi Vision 2030
                            </h1>
                            <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 bg-white mb-6 sm:mb-8 lg:mb-12" />
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light opacity-90 max-w-md">
                                A Story of Transformation
                            </p>
                        </div>

                        {/* Right Side - CTA Button */}
                        <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
                            <Button 
                                variant="outline" 
                                size="lg"
                                onClick={handleReadMore}
                                className="bg-transparent border-2 border-green-500 text-white hover:bg-green-500 hover:text-white transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-none"
                            >
                                Read More
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </section>
    );
};

export default VisionOverview;