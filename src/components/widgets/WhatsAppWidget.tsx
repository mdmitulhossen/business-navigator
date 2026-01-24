import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

const WhatsAppWidget = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const phoneNumber = '+966575984970'; // Saudi Arabia number
  const defaultMessage = 'Hello! I would like to inquire about your business services.';

  const handleWhatsAppClick = () => {
    // Trigger bounce animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMessage)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-28 md:right-6">
      <button
        onClick={handleWhatsAppClick}
        className={`
          group relative flex items-center justify-center
          w-14 h-14 bg-green-500 hover:bg-green-600
          rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          transform hover:scale-110
          ${isAnimating ? 'animate-bounce' : ''}
        `}
        aria-label="Contact us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        {/* WhatsApp Icon */}
        <MessageCircle 
          className="w-6 h-6 text-white transition-transform group-hover:scale-110" 
          fill="currentColor"
        />
        
        {/* Pulse Ring Animation */}
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
        
        {/* Tooltip */}
        <div className="
          absolute right-16 top-1/2 -translate-y-1/2
          bg-gray-800 text-white text-sm px-3 py-2 rounded-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          whitespace-nowrap shadow-lg
          before:absolute before:left-full before:top-1/2 before:-translate-y-1/2
          before:border-4 before:border-transparent before:border-l-gray-800
        ">
          Chat on WhatsApp
        </div>
      </button>
      
      {/* Phone number display (hidden but accessible for screen readers) */}
      <span className="sr-only">{phoneNumber}</span>
    </div>
  );
};

export default WhatsAppWidget;