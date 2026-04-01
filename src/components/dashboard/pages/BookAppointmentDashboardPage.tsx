import DashboardPageLoader from '@/components/dashboard/DashboardPageLoader';
import { ReusableTable, type TableColumn } from '@/components/dashboard/ReusableTable';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    useDeleteAppointment,
    useFetchAppointment,
    useFetchAppointments,
    useUpdateAppointmentStatus,
    type AppointmentStatus,
    type TBookAppointment,
} from '@/services/useBookAppointmentService';
import { Eye, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface BookAppointmentDashboardPageProps {
  language: 'en' | 'ar';
}

const statusOptions: AppointmentStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

const statusMeta: Record<AppointmentStatus, { labelEn: string; labelAr: string; className: string }> = {
  PENDING: {
    labelEn: 'Pending',
    labelAr: 'قيد الانتظار',
    className: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  CONFIRMED: {
    labelEn: 'Confirmed',
    labelAr: 'مؤكد',
    className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  CANCELLED: {
    labelEn: 'Cancelled',
    labelAr: 'ملغي',
    className: 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
  COMPLETED: {
    labelEn: 'Completed',
    labelAr: 'مكتمل',
    className: 'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  },
};

const formatDate = (value: string, language: 'en' | 'ar') => {
  try {
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const BookAppointmentDashboardPage = ({ language }: BookAppointmentDashboardPageProps) => {
  const isArabic = language === 'ar';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [serviceFilter, setServiceFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewAppointmentId, setViewAppointmentId] = useState<string | null>(null);
  const [deleteAppointment, setDeleteAppointment] = useState<TBookAppointment | null>(null);

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
      status: statusFilter === 'all' ? undefined : statusFilter,
      service: serviceFilter.trim() || undefined,
    }),
    [page, limit, searchTerm, statusFilter, serviceFilter],
  );

  const { data, isLoading, isFetching } = useFetchAppointments(queryParams, true);
  const updateStatusMutation = useUpdateAppointmentStatus();
  const deleteAppointmentMutation = useDeleteAppointment();
  const viewAppointmentQuery = useFetchAppointment(viewAppointmentId ?? undefined, Boolean(viewAppointmentId));

  const appointments = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleStatusChange = async (appointmentId: string, status: AppointmentStatus) => {
    try {
      setUpdatingId(appointmentId);
      await updateStatusMutation.mutateAsync({ id: appointmentId, payload: { status } });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAppointment?.id) return;
    await deleteAppointmentMutation.mutateAsync(deleteAppointment.id);
    setDeleteAppointment(null);
  };

  const columns: TableColumn<TBookAppointment>[] = [
    { header: isArabic ? 'الاسم' : 'Name', accessor: 'name', className: 'font-medium' },
    { header: isArabic ? 'الشركة' : 'Company', accessor: 'companyName' },
    { header: isArabic ? 'الخدمة' : 'Service', accessor: 'service' },
    { header: isArabic ? 'الهاتف' : 'Phone', accessor: 'phoneNumber' },
    { header: isArabic ? 'البريد' : 'Email', accessor: 'email' },
    { header: isArabic ? 'التاريخ' : 'Date', cell: (row) => formatDate(row.date, language) },
    { header: isArabic ? 'الوقت' : 'Slot', accessor: 'slotTime',},
    {
      header: isArabic ? 'الحالة' : 'Status',
      cell: (row) => {
        const meta = statusMeta[row.status];
        return (
          <Badge variant="outline" className={cn('rounded-full', meta.className)}>
            {isArabic ? meta.labelAr : meta.labelEn}
          </Badge>
        );
      },
    },
    {
      header: isArabic ? 'تغيير الحالة' : 'Change Status',
      cell: (row) => (
        <div className="min-w-[150px]">
          <Select
            value={row.status}
            onValueChange={(value: AppointmentStatus) => handleStatusChange(row.id, value)}
            disabled={updatingId === row.id}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {isArabic ? statusMeta[status].labelAr : statusMeta[status].labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {updatingId === row.id ? (
            <p className="mt-1 text-xs text-muted-foreground">{isArabic ? 'جارٍ التحديث...' : 'Updating...'}</p>
          ) : null}
        </div>
      ),
    },
    {
      header: isArabic ? 'إجراءات' : 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setViewAppointmentId(row.id)} aria-label="View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setDeleteAppointment(row)} aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{isArabic ? 'إدارة المواعيد' : 'Manage Appointments'}</h2>
          <p className="text-sm text-muted-foreground">
            {isArabic ? 'عرض حجوزات المواعيد مع الفلترة والتحديث الفوري للحالة.' : 'View appointment bookings with filtering and live status updates.'}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
              placeholder={isArabic ? 'ابحث بالاسم أو البريد...' : 'Search by name or email...'}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: 'all' | AppointmentStatus) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isArabic ? 'كل الحالات' : 'All statuses'}</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {isArabic ? statusMeta[status].labelAr : statusMeta[status].labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-72">
            <Input
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setPage(1);
              }}
              placeholder={isArabic ? 'فلترة حسب الخدمة...' : 'Filter by service...'}
            />
          </div>
        </div>
      </div>

      {isLoading && !data ? (
        <DashboardPageLoader />
      ) : (
        <>
          <ReusableTable<TBookAppointment>
            data={appointments}
            columns={columns}
            rowKey={(row) => row.id}
            isLoading={isFetching}
            emptyStateTitle={isArabic ? 'لا توجد مواعيد' : 'No appointments found'}
            emptyStateDescription={isArabic ? 'جرّب تعديل الفلاتر أو البحث.' : 'Try adjusting your filters or search term.'}
          />

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {isArabic
                ? `عرض ${appointments.length} من أصل ${total} موعد`
                : `Showing ${appointments.length} of ${total} appointments`}
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

              <Button variant="outline" disabled={page >= totalPages || isFetching} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>
                {isArabic ? 'التالي' : 'Next'}
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={Boolean(viewAppointmentId)} onOpenChange={(open) => !open && setViewAppointmentId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isArabic ? 'عرض الموعد' : 'View Appointment'}</DialogTitle>
            <DialogDescription>{isArabic ? 'تفاصيل الحجز المحدد.' : 'Details of the selected booking.'}</DialogDescription>
          </DialogHeader>

          {viewAppointmentQuery.isLoading ? (
            <DashboardPageLoader />
          ) : viewAppointmentQuery.data?.data ? (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{viewAppointmentQuery.data.data.name}</span></div>
                <div><span className="text-muted-foreground">Company:</span> <span className="font-medium">{viewAppointmentQuery.data.data.companyName}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{viewAppointmentQuery.data.data.email}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{viewAppointmentQuery.data.data.phoneNumber}</span></div>
                <div><span className="text-muted-foreground">Service:</span> <span className="font-medium">{viewAppointmentQuery.data.data.service}</span></div>
                <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{formatDate(viewAppointmentQuery.data.data.date, language)}</span></div>
                <div><span className="text-muted-foreground">Slot:</span> <span className="font-medium">{viewAppointmentQuery.data.data.slotTime}</span></div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <Badge variant="outline" className={cn('rounded-full', statusMeta[viewAppointmentQuery.data.data.status].className)}>
                    {isArabic
                      ? statusMeta[viewAppointmentQuery.data.data.status].labelAr
                      : statusMeta[viewAppointmentQuery.data.data.status].labelEn}
                  </Badge>
                </div>
              </div>

              {viewAppointmentQuery.data.data.additionalNotes ? (
                <div>
                  <p className="mb-2 text-muted-foreground">{isArabic ? 'ملاحظات إضافية' : 'Additional Notes'}</p>
                  <div className="rounded-lg border border-border p-3 text-sm text-foreground">
                    {viewAppointmentQuery.data.data.additionalNotes}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{isArabic ? 'لا توجد بيانات' : 'No data found.'}</p>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteAppointment)} onOpenChange={(open) => !open && setDeleteAppointment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `هل أنت متأكد من حذف الموعد (${deleteAppointment?.name || ''})؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete appointment (${deleteAppointment?.name || ''})? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isArabic ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteAppointmentMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAppointmentMutation.isPending ? (isArabic ? 'جارٍ الحذف...' : 'Deleting...') : isArabic ? 'تأكيد الحذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default BookAppointmentDashboardPage;

