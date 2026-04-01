import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Clock3, FileText, TrendingUp, Users2 } from 'lucide-react';

interface OverviewDashboardPageProps {
  language: 'en' | 'ar';
}

type DashboardStat = {
  labelEn: string;
  labelAr: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'default' | 'success' | 'warning' | 'info';
};

const stats: DashboardStat[] = [
  { labelEn: 'Active services', labelAr: 'الخدمات النشطة', value: '08', change: '+12.5%', icon: FileText, tone: 'info' },
  { labelEn: 'Team members', labelAr: 'أعضاء الفريق', value: '124', change: '+8.2%', icon: Users2, tone: 'warning' },
  { labelEn: 'Blogs published', labelAr: 'المدونات المنشورة', value: '87', change: '+18.9%', icon: FileText, tone: 'success' },
  { labelEn: 'Appointments today', labelAr: 'مواعيد اليوم', value: '06', change: '-2.4%', icon: Clock3, tone: 'default' },
];

const OverviewDashboardPage = ({ language }: OverviewDashboardPageProps) => {
  const isArabic = language === 'ar';

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{isArabic ? 'ملخص الأداء' : 'Performance overview'}</h2>
        <p className="text-sm text-muted-foreground">{isArabic ? 'أهم الأرقام في مكان واحد.' : 'The most important numbers in one place.'}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.labelEn} className="overflow-hidden border-border/60 bg-card shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardDescription className="text-sm">{isArabic ? stat.labelAr : stat.labelEn}</CardDescription>
                  <CardTitle className="text-3xl font-bold tracking-tight">{stat.value}</CardTitle>
                </div>
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-xl border',
                    stat.tone === 'success' && 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
                    stat.tone === 'warning' && 'border-amber-500/20 bg-amber-500/10 text-amber-600',
                    stat.tone === 'info' && 'border-sky-500/20 bg-sky-500/10 text-sky-600',
                    stat.tone === 'default' && 'border-border bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium text-foreground">{stat.change}</span>
                  <span className="text-muted-foreground">{isArabic ? 'من الشهر الماضي' : 'from last month'}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default OverviewDashboardPage;
