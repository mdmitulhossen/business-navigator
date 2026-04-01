import { Plane } from 'lucide-react';
import SimpleDashboardPage from './SimpleDashboardPage';

interface BookFlightDashboardPageProps {
  language: 'en' | 'ar';
}

const BookFlightDashboardPage = ({ language }: BookFlightDashboardPageProps) => {
  return (
    <SimpleDashboardPage
      language={language}
      titleEn="Book Flight"
      titleAr="حجز رحلة"
      subtitleEn="Manage flight booking options and requests."
      subtitleAr="إدارة خيارات وطلبات حجز الرحلات."
      icon={<Plane className="h-4 w-4" />}
    />
  );
};

export default BookFlightDashboardPage;
