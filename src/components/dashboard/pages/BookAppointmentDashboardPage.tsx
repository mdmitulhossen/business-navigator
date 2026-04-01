import { CalendarCheck2 } from 'lucide-react';
import SimpleDashboardPage from './SimpleDashboardPage';

interface BookAppointmentDashboardPageProps {
  language: 'en' | 'ar';
}

const BookAppointmentDashboardPage = ({ language }: BookAppointmentDashboardPageProps) => {
  return (
    <SimpleDashboardPage
      language={language}
      titleEn="Book Appointment"
      titleAr="حجز موعد"
      subtitleEn="Manage appointment booking content and requests."
      subtitleAr="إدارة محتوى وحجوزات المواعيد."
      icon={<CalendarCheck2 className="h-4 w-4" />}
    />
  );
};

export default BookAppointmentDashboardPage;
