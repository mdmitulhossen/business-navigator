import PrayerTimesWidget from '@/components/widgets/PrayerTimesWidget';
import { useTawkTo } from '@/hooks/use-tawk-to';
import { ReactNode } from 'react';
import WhatsAppWidget from '../widgets/WhatsAppWidget';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Initialize Tawk.to chat widget
  useTawkTo();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <PrayerTimesWidget />
      <WhatsAppWidget />
    </div>
  );
};

export default Layout;
