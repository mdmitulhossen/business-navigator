import { FileText } from 'lucide-react';
import SimpleDashboardPage from './SimpleDashboardPage';

interface CmsDashboardPageProps {
  language: 'en' | 'ar';
}

const CmsDashboardPage = ({ language }: CmsDashboardPageProps) => {
  return (
    <SimpleDashboardPage
      language={language}
      titleEn="CMS"
      titleAr="إدارة المحتوى"
      subtitleEn="Manage website sections and banners."
      subtitleAr="إدارة أقسام الموقع والبنرات."
      icon={<FileText className="h-4 w-4" />}
    />
  );
};

export default CmsDashboardPage;
