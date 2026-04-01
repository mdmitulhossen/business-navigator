import { ReusableTable } from '@/components/dashboard/ReusableTable';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BlogDashboardPageProps {
  language: 'en' | 'ar';
}

type BlogRow = {
  title: string;
  author: string;
  category: string;
  status: 'Published' | 'Draft';
};

const rows: BlogRow[] = [
  { title: 'Saudi Investment Guide 2026', author: 'Sara Al-Amri', category: 'Legal', status: 'Published' },
  { title: 'Company Setup Checklist', author: 'Research Team', category: 'Formation', status: 'Published' },
  { title: 'VAT Filing Tips', author: 'Finance Team', category: 'Tax', status: 'Draft' },
];

const BlogDashboardPage = ({ language }: BlogDashboardPageProps) => {
  const isArabic = language === 'ar';

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{isArabic ? 'المدونة' : 'Blog'}</h2>
        <Badge variant="outline" className="rounded-full">{isArabic ? 'إدارة المحتوى' : 'Manage blog'}</Badge>
      </div>

      <ReusableTable<BlogRow>
        data={rows}
        rowKey={(row) => row.title}
        columns={[
          { header: isArabic ? 'العنوان' : 'Title', accessor: 'title' },
          { header: isArabic ? 'الكاتب' : 'Author', accessor: 'author' },
          { header: isArabic ? 'التصنيف' : 'Category', accessor: 'category' },
          {
            header: isArabic ? 'الحالة' : 'Status',
            cell: (row) => (
              <Badge
                variant="outline"
                className={cn(
                  'rounded-full',
                  row.status === 'Published'
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
                )}
              >
                {row.status}
              </Badge>
            ),
          },
        ]}
      />
    </section>
  );
};

export default BlogDashboardPage;
