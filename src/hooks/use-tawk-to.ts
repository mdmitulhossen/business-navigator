import { useEffect } from 'react';

export const useTawkTo = () => {
  useEffect(() => {
    // Check if Tawk.to script is already loaded
    if (window.Tawk_API) {
      return;
    }

    // Initialize Tawk_API if not already present
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create and load the Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/68917fcdb40fb6192870b3b3/1j1s5mfl5';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Insert the script into the document
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    // Cleanup function to remove script when component unmounts
    return () => {
      const existingScript = document.querySelector('script[src*="tawk.to"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);
};

// Type declarations for Tawk_API
declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}
