import DashboardPageLoader from '@/components/dashboard/DashboardPageLoader';
import { ReusableTable, type TableColumn } from '@/components/dashboard/ReusableTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useFetchServices, useUpdateService, type TService } from '@/services/useService';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface ServicesDashboardPageProps {
  language: 'en' | 'ar';
}

const ServicesDashboardPage = ({ language }: ServicesDashboardPageProps) => {
  const isArabic = language === 'ar';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      searchTerm: searchTerm || undefined,
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    }),
    [page, limit, searchTerm, statusFilter],
  );

  const { data, isLoading, isFetching } = useFetchServices(queryParams, true);
  const updateServiceMutation = useUpdateService();

  const services = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleStatusToggle = async (service: TService, nextActive: boolean) => {
    try {
      setUpdatingId(service.id);
      await updateServiceMutation.mutateAsync({
        id: service.id,
        payload: { isActive: nextActive },
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const columns: TableColumn<TService>[] = [
    {
      header: isArabic ? 'المعرف' : 'ID',
      accessor: 'id',
      className: 'font-medium',
    },
    {
      header: isArabic ? 'العنوان' : 'Title Key',
      accessor: 'titleKey',
    },
    {
      header: isArabic ? 'الوصف' : 'Description Key',
      accessor: 'descKey',
    },
    {
      header: isArabic ? 'الحالة' : 'Status',
      cell: (row) => (
        <Badge
          variant="outline"
          className={cn(
            'rounded-full',
            row.isActive
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300',
          )}
        >
          {row.isActive ? (isArabic ? 'نشط' : 'Active') : isArabic ? 'غير نشط' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: isArabic ? 'تفعيل / تعطيل' : 'Toggle Status',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={Boolean(row.isActive)}
            disabled={updatingId === row.id}
            onCheckedChange={(checked) => handleStatusToggle(row, checked)}
          />
          {updatingId === row.id ? (
            <span className="text-xs text-muted-foreground">{isArabic ? 'جارٍ التحديث...' : 'Updating...'}</span>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{isArabic ? 'إدارة الخدمات' : 'Manage Services'}</h2>
          <p className="text-sm text-muted-foreground">
            {isArabic ? 'قائمة الخدمات مع حالة التفعيل والتحديث المباشر.' : 'Service list with active status and live updates.'}
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto">
          <div className="relative sm:col-span-2 lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
              placeholder={isArabic ? 'ابحث عن خدمة...' : 'Search services...'}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: 'all' | 'active' | 'inactive') => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isArabic ? 'الكل' : 'All'}</SelectItem>
              <SelectItem value="active">{isArabic ? 'نشط' : 'Active'}</SelectItem>
              <SelectItem value="inactive">{isArabic ? 'غير نشط' : 'Inactive'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && !data ? (
        <DashboardPageLoader />
      ) : (
        <>
          <ReusableTable<TService>
            data={services}
            columns={columns}
            rowKey={(row) => row.id}
            isLoading={isFetching}
            emptyStateTitle={isArabic ? 'لا توجد خدمات' : 'No services found'}
            emptyStateDescription={
              isArabic
                ? 'جرّب تعديل الفلاتر أو البحث.'
                : 'Try adjusting your filters or search term.'
            }
          />

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {isArabic
                ? `عرض ${services.length} من أصل ${total} خدمة`
                : `Showing ${services.length} of ${total} services`}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">{isArabic ? 'العرض' : 'Rows'}</span>
              <Select
                value={String(limit)}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[90px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" disabled={page <= 1 || isFetching} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                {isArabic ? 'السابق' : 'Previous'}
              </Button>
              <span className="min-w-[120px] text-center text-sm text-muted-foreground">
                {isArabic ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                {isArabic ? 'التالي' : 'Next'}
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ServicesDashboardPage;
