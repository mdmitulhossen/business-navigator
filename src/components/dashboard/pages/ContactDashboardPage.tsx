import { ReusableTable } from '@/components/dashboard/ReusableTable';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ContactDashboardPageProps {
  language: 'en' | 'ar';
}

type ContactRow = {
  name: string;
  email: string;
  subject: string;
  status: 'PENDING' | 'RESOLVED';
};

const rows: ContactRow[] = [
  { name: 'Noble Trade LLC', email: 'ceo@noble.com', subject: 'Need MISA support', status: 'PENDING' },
  { name: 'Apex Group', email: 'ops@apex.com', subject: 'Company amendment', status: 'RESOLVED' },
  { name: 'Blue Horizon', email: 'admin@blue.com', subject: 'Tax consultation', status: 'PENDING' },
];

const ContactDashboardPage = ({ language }: ContactDashboardPageProps) => {
  const isArabic = language === 'ar';

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{isArabic ? 'رسائل التواصل' : 'Contact Messages'}</h2>
        <Badge variant="outline" className="rounded-full">{isArabic ? 'إدارة التواصل' : 'Manage contact'}</Badge>
      </div>

      <ReusableTable<ContactRow>
        data={rows}
        rowKey={(row) => `${row.email}-${row.subject}`}
        columns={[
          { header: isArabic ? 'الاسم' : 'Name', accessor: 'name' },
          { header: isArabic ? 'البريد' : 'Email', accessor: 'email' },
          { header: isArabic ? 'الموضوع' : 'Subject', accessor: 'subject' },
          {
            header: isArabic ? 'الحالة' : 'Status',
            cell: (row) => (
              <Badge
                variant="outline"
                className={cn(
                  'rounded-full',
                  row.status === 'RESOLVED'
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

export default ContactDashboardPage;
