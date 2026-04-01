import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Menu, Plus, Search } from 'lucide-react';

export interface DashboardTopbarProps {
  title: string;
  description: string;
  language: 'en' | 'ar';
  onMenuClick: () => void;
  onCreateClick?: () => void;
  onExportClick?: () => void;
}

const DashboardTopbar = ({
  title,
  description,
  language,
  onMenuClick,
  onCreateClick,
  onExportClick,
}: DashboardTopbarProps) => {
  const isArabic = language === 'ar';

  return (
    <div className="sticky top-0 z-20 flex flex-col gap-4 border-b border-border bg-background/80 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="flex items-start gap-3">
        <Button variant="outline" size="icon" className="shrink-0 lg:hidden" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </Button>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
            <Badge variant="outline" className="rounded-full">
              {isArabic ? 'مباشر' : 'Live'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-72 lg:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={isArabic ? 'ابحث في اللوحة...' : 'Search dashboard...'}
            className="pl-9"
            aria-label={isArabic ? 'بحث' : 'Search'}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onExportClick} className="gap-2">
            <Download className="h-4 w-4" />
            {isArabic ? 'تصدير' : 'Export'}
          </Button>
          <Button onClick={onCreateClick} className="gap-2">
            <Plus className="h-4 w-4" />
            {isArabic ? 'إضافة' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopbar;
