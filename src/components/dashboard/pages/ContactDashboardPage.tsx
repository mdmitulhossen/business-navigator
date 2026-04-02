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
    useDeleteContact,
    useFetchContacts,
    useUpdateContactStatus,
    type ContactStatus,
    type TContact,
} from '@/services/useContactService';
import { Eye, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface ContactDashboardPageProps {
  language: 'en' | 'ar';
}

const statusOptions: ContactStatus[] = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const statusMeta: Record<ContactStatus, { labelEn: string; labelAr: string; className: string }> = {
  PENDING: {
    labelEn: 'Pending',
    labelAr: 'قيد الانتظار',
    className: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  IN_PROGRESS: {
    labelEn: 'In Progress',
    labelAr: 'قيد المعالجة',
    className: 'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  },
  RESOLVED: {
    labelEn: 'Resolved',
    labelAr: 'تم الحل',
    className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  CLOSED: {
    labelEn: 'Closed',
    labelAr: 'مغلق',
    className: 'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300',
  },
};

const formatDate = (value?: string, language?: 'en' | 'ar') => {
  if (!value) return '—';

  try {
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const ContactDashboardPage = ({ language }: ContactDashboardPageProps) => {
  const isArabic = language === 'ar';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContactStatus>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewContact, setViewContact] = useState<TContact | null>(null);
  const [deleteContact, setDeleteContact] = useState<TContact | null>(null);

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
      serviceType: serviceTypeFilter.trim() || undefined,
    }),
    [page, limit, searchTerm, statusFilter, serviceTypeFilter],
  );

  const { data, isLoading, isFetching } = useFetchContacts(queryParams, true);
  const updateContactStatusMutation = useUpdateContactStatus();
  const deleteContactMutation = useDeleteContact();

  const contacts = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleStatusChange = async (contactId: string, status: ContactStatus) => {
    try {
      setUpdatingId(contactId);
      await updateContactStatusMutation.mutateAsync({ id: contactId, payload: { status } });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteContact?.id) return;
    await deleteContactMutation.mutateAsync(deleteContact.id);
    setDeleteContact(null);
  };

  const columns: TableColumn<TContact>[] = [
    { header: isArabic ? 'الاسم' : 'Name', accessor: 'name', className: 'font-medium' },
    { header: isArabic ? 'الشركة' : 'Company', accessor: 'companyName' },
    { header: isArabic ? 'الخدمة' : 'Service', accessor: 'serviceType' },
    { header: isArabic ? 'الهاتف' : 'Phone', accessor: 'phoneNumber' },
    { header: isArabic ? 'البريد' : 'Email', accessor: 'email' },
    {
      header: isArabic ? 'الحالة' : 'Status',
      cell: (row) => {
        const meta = statusMeta[row.status] ?? statusMeta.PENDING;
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
        <div className="min-w-[160px]">
          <Select value={row.status} onValueChange={(value: ContactStatus) => handleStatusChange(row.id, value)} disabled={updatingId === row.id}>
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
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setViewContact(row)} aria-label="View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setDeleteContact(row)} aria-label="Delete">
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
          <h2 className="text-xl font-semibold text-foreground">{isArabic ? 'رسائل التواصل' : 'Contact Messages'}</h2>
          <p className="text-sm text-muted-foreground">
            {isArabic ? 'عرض الرسائل مع البحث، الفلترة، وتغيير الحالة مباشرة.' : 'View messages with search, filtering, and live status updates.'}
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
            onValueChange={(value: 'all' | ContactStatus) => {
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

          <Input
            value={serviceTypeFilter}
            onChange={(e) => {
              setServiceTypeFilter(e.target.value);
              setPage(1);
            }}
            className="sm:w-64"
            placeholder={isArabic ? 'فلترة حسب نوع الخدمة...' : 'Filter by service type...'}
          />
        </div>
      </div>

      {isLoading && !data ? (
        <DashboardPageLoader />
      ) : (
        <>
          <ReusableTable<TContact>
            data={contacts}
            rowKey={(row) => row.id}
            columns={columns}
            isLoading={isFetching}
            emptyStateTitle={isArabic ? 'لا توجد رسائل' : 'No contacts found'}
            emptyStateDescription={isArabic ? 'جرّب تعديل الفلاتر أو البحث.' : 'Try adjusting your filters or search term.'}
          />

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {isArabic
                ? `عرض ${contacts.length} من أصل ${total} رسالة`
                : `Showing ${contacts.length} of ${total} contact messages`}
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

      <Dialog open={Boolean(viewContact)} onOpenChange={(open) => !open && setViewContact(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isArabic ? 'عرض رسالة التواصل' : 'View Contact Message'}</DialogTitle>
            <DialogDescription>{isArabic ? 'تفاصيل الرسالة المحددة.' : 'Details of the selected contact message.'}</DialogDescription>
          </DialogHeader>

          {viewContact ? (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{viewContact.name}</span></div>
                <div><span className="text-muted-foreground">Company:</span> <span className="font-medium">{viewContact.companyName}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{viewContact.email}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{viewContact.phoneNumber}</span></div>
                <div><span className="text-muted-foreground">Service:</span> <span className="font-medium">{viewContact.serviceType}</span></div>
                <div><span className="text-muted-foreground">Created:</span> <span className="font-medium">{formatDate(viewContact.createdAt, language)}</span></div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <Badge variant="outline" className={cn('rounded-full', (statusMeta[viewContact.status] ?? statusMeta.PENDING).className)}>
                    {isArabic ? (statusMeta[viewContact.status] ?? statusMeta.PENDING).labelAr : (statusMeta[viewContact.status] ?? statusMeta.PENDING).labelEn}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="mb-2 text-muted-foreground">Message</p>
                <div className="rounded-lg border border-border p-3 text-sm text-foreground whitespace-pre-wrap">
                  {viewContact.message}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteContact)} onOpenChange={(open) => !open && setDeleteContact(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `هل أنت متأكد من حذف رسالة (${deleteContact?.name || ''})؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete contact message (${deleteContact?.name || ''})? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isArabic ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteContactMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteContactMutation.isPending ? (isArabic ? 'جارٍ الحذف...' : 'Deleting...') : isArabic ? 'تأكيد الحذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default ContactDashboardPage;
