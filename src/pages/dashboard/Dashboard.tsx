import { dashboardNavItems } from '@/components/dashboard/dashboardNavItems';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/dashboard/DashboardTopbar';
import BlogDashboardPage from '@/components/dashboard/pages/BlogDashboardPage';
import BookAppointmentDashboardPage from '@/components/dashboard/pages/BookAppointmentDashboardPage';
import BookFlightDashboardPage from '@/components/dashboard/pages/BookFlightDashboardPage';
import CmsDashboardPage from '@/components/dashboard/pages/CmsDashboardPage';
import ContactDashboardPage from '@/components/dashboard/pages/ContactDashboardPage';
import OverviewDashboardPage from '@/components/dashboard/pages/OverviewDashboardPage';
import ReviewDashboardPage from '@/components/dashboard/pages/ReviewDashboardPage';
import ServicesDashboardPage from '@/components/dashboard/pages/ServicesDashboardPage';
import TeamMembersDashboardPage from '@/components/dashboard/pages/TeamMembersDashboardPage';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { StorageKeys } from '@/types/generalTypes';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const getSectionFromSearch = (search: string) => {
    const section = new URLSearchParams(search).get('section');
    return dashboardNavItems.some((item) => item.id === section) ? section : 'overview';
  };

  const [activeSection, setActiveSection] = useState(() => getSectionFromSearch(location.search));

  useEffect(() => {
    setActiveSection(getSectionFromSearch(location.search));
  }, [location.search]);

  const activeMenu = useMemo(
    () => dashboardNavItems.find((item) => item.id === activeSection) ?? dashboardNavItems[0],
    [activeSection],
  );

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    navigate({ search: `?section=${sectionId}` });
    setMobileSidebarOpen(false);
  };

  const handleAdminSignOut = () => {
    localStorage.removeItem(StorageKeys.token);
    localStorage.removeItem(StorageKeys.adminToken);
    navigate('/dashboard/login', { replace: true });
  };

  const renderActivePage = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewDashboardPage language={language} />;
      case 'services':
        return <ServicesDashboardPage language={language} />;
      case 'team-members':
        return <TeamMembersDashboardPage language={language} />;
      case 'blog':
        return <BlogDashboardPage language={language} />;
      case 'contact':
        return <ContactDashboardPage language={language} />;
      case 'cms':
        return <CmsDashboardPage language={language} />;
      case 'book-appointment':
        return <BookAppointmentDashboardPage language={language} />;
      case 'book-flight':
        return <BookFlightDashboardPage language={language} />;
      case 'reviews':
        return <ReviewDashboardPage language={language} />;
      default:
        return <OverviewDashboardPage language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="min-h-screen">
        <div className="fixed inset-y-0 left-0 z-30 hidden w-80 lg:block">
          <DashboardSidebar
            activeSection={activeSection}
            onNavigate={handleNavigate}
            language={language}
            onSignOut={handleAdminSignOut}
          />
        </div>

        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>{isArabic ? 'قائمة التنقل' : 'Navigation menu'}</SheetTitle>
            </SheetHeader>
            <DashboardSidebar
              compact
              activeSection={activeSection}
              onNavigate={handleNavigate}
              language={language}
              onSignOut={handleAdminSignOut}
            />
          </SheetContent>
        </Sheet>

        <main className="min-w-0 lg:pl-80">
          <div className="flex min-h-screen flex-col">
            <DashboardTopbar
              title={isArabic ? activeMenu.labelAr : activeMenu.labelEn}
              description={isArabic ? activeMenu.descriptionAr : activeMenu.descriptionEn}
              language={language}
              onMenuClick={() => setMobileSidebarOpen(true)}
              onCreateClick={() => handleNavigate('services')}
              onExportClick={() => handleNavigate('blog')}
            />

            <div className="space-y-8 p-4 sm:p-6 lg:p-8">
              {renderActivePage()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
