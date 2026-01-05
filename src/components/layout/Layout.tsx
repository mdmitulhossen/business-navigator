import PrayerTimesWidget from '@/components/widgets/PrayerTimesWidget';
import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <PrayerTimesWidget />
    </div>
  );
};

export default Layout;
