import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SimpleDashboardPageProps {
  language: 'en' | 'ar';
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  icon: React.ReactNode;
}

const SimpleDashboardPage = ({
  language,
  titleEn,
  titleAr,
  subtitleEn,
  subtitleAr,
  icon,
}: SimpleDashboardPageProps) => {
  const isArabic = language === 'ar';

  return (
    <section>
      <Card>
        <CardHeader>
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">{icon}</div>
          <CardTitle>{isArabic ? titleAr : titleEn}</CardTitle>
          <CardDescription>{isArabic ? subtitleAr : subtitleEn}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {isArabic
              ? 'هذه صفحة مخصصة داخل لوحة التحكم ويمكن ربطها بالـ API لاحقًا.'
              : 'This is a dedicated dashboard page and can be connected to APIs later.'}
          </p>
          <Button variant="outline">{isArabic ? 'تعديل الصفحة' : 'Configure page'}</Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default SimpleDashboardPage;
