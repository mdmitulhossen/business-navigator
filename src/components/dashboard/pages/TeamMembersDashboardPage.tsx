import { ReusableTable } from '@/components/dashboard/ReusableTable';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TeamMembersDashboardPageProps {
  language: 'en' | 'ar';
}

type TeamMemberRow = {
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Inactive';
};

const rows: TeamMemberRow[] = [
  { name: 'Faisal Abdul Karim', role: 'Founder & CEO', email: 'faisal@business.com', status: 'Active' },
  { name: 'Sara Al-Amri', role: 'Head of Legal', email: 'sara@business.com', status: 'Active' },
  { name: 'Layla Al-Harthi', role: 'Gov Relations', email: 'layla@business.com', status: 'On Leave' },
  { name: 'Ahmed Rahman', role: 'Content Manager', email: 'ahmed@business.com', status: 'Inactive' },
];

const getStatusClass = (status: TeamMemberRow['status']) => {
  if (status === 'Active') return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  if (status === 'On Leave') return 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300';
  return 'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300';
};

const TeamMembersDashboardPage = ({ language }: TeamMembersDashboardPageProps) => {
  const isArabic = language === 'ar';

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{isArabic ? 'أعضاء الفريق' : 'Team Members'}</h2>
        <Badge variant="outline" className="rounded-full">{isArabic ? 'إدارة الفريق' : 'Manage team'}</Badge>
      </div>

      <ReusableTable<TeamMemberRow>
        data={rows}
        rowKey={(row) => row.email}
        columns={[
          { header: isArabic ? 'الاسم' : 'Name', accessor: 'name' },
          { header: isArabic ? 'الدور' : 'Role', accessor: 'role' },
          { header: isArabic ? 'البريد' : 'Email', accessor: 'email' },
          {
            header: isArabic ? 'الحالة' : 'Status',
            cell: (row) => <Badge variant="outline" className={cn('rounded-full', getStatusClass(row.status))}>{row.status}</Badge>,
          },
        ]}
      />
    </section>
  );
};

export default TeamMembersDashboardPage;
