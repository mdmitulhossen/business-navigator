import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { dashboardNavItems } from './dashboardNavItems.ts';

export interface DashboardSidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  language: 'en' | 'ar';
  className?: string;
  compact?: boolean;
  onSignOut?: () => void;
}

const DashboardSidebar = ({
  activeSection,
  onNavigate,
  language,
  className,
  compact = false,
  onSignOut,
}: DashboardSidebarProps) => {
  const isArabic = language === 'ar';

  return (
    <aside
      className={cn(
        'flex h-full w-full flex-col border-r border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60',
        className,
      )}
    >
      <div className={cn('p-6', compact && 'p-5')}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Business Navigator</p>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'لوحة التحكم' : 'Admin dashboard'}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-3">
          {dashboardNavItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
                    isActive ? 'border-primary-foreground/20 bg-primary-foreground/10' : 'border-border bg-background',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{isArabic ? item.labelAr : item.labelEn}</span>
                  <span className={cn('block truncate text-xs', isActive ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                    {isArabic ? item.descriptionAr : item.descriptionEn}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4">
        <div className="rounded-2xl border border-border bg-muted/40 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <LogOut className="h-4 w-4" />
            {isArabic ? 'تسجيل الخروج' : 'Sign out'}
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            {isArabic
              ? 'اخرج من مساحة العمل بعد الانتهاء من المراجعة.'
              : 'Leave the workspace when you are done reviewing.'}
          </p>
          <Button variant="outline" className="w-full justify-start" onClick={onSignOut}>
            <LogOut className="h-4 w-4" />
            {isArabic ? 'خروج' : 'Logout'}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
