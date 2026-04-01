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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
    useCreateTeamMember,
    useDeleteTeamMember,
    useFetchTeamMembers,
    useUpdateTeamMember,
    type TTeamMember,
} from '@/services/useTeamService';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

interface TeamMembersDashboardPageProps {
  language: 'en' | 'ar';
}

type TeamMemberRow = {
  id: string;
  name: string;
  designation: string;
  email: string;
  image: string;
  phoneNumber: string;
  isActive: boolean;
};

const getStatusClass = (isActive: boolean) => {
  if (isActive) return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  return 'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300';
};

type TeamMemberFormValues = {
  name: string;
  email: string;
  image: string;
  designation: string;
  phoneNumber: string;
  isActive: boolean;
};

const createDefaultForm = (): TeamMemberFormValues => ({
  name: '',
  email: '',
  image: '',
  designation: '',
  phoneNumber: '',
  isActive: true,
});

const mapTeamMemberToForm = (teamMember: TTeamMember): TeamMemberFormValues => ({
  name: teamMember.name || '',
  email: teamMember.email || '',
  image: teamMember.image || '',
  designation: teamMember.designation || '',
  phoneNumber: teamMember.phoneNumber || '',
  isActive: Boolean(teamMember.isActive),
});

const TeamMembersDashboardPage = ({ language }: TeamMembersDashboardPageProps) => {
  const isArabic = language === 'ar';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedTeamMember, setSelectedTeamMember] = useState<TTeamMember | null>(null);
  const [viewTeamMember, setViewTeamMember] = useState<TTeamMember | null>(null);
  const [deleteTeamMember, setDeleteTeamMember] = useState<TTeamMember | null>(null);

  const form = useForm<TeamMemberFormValues>({
    defaultValues: createDefaultForm(),
    mode: 'onSubmit',
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form;

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

  const { data, isLoading, isFetching } = useFetchTeamMembers(queryParams, true);
  const createTeamMemberMutation = useCreateTeamMember();
  const updateTeamMemberMutation = useUpdateTeamMember();
  const deleteTeamMemberMutation = useDeleteTeamMember();

  const rows: TeamMemberRow[] =
    data?.data?.map((item) => ({
      id: item.id,
      name: item.name,
      designation: item.designation,
      email: item.email,
      image: item.image,
      phoneNumber: item.phoneNumber,
      isActive: Boolean(item.isActive),
    })) ?? [];

  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openCreateForm = () => {
    setFormMode('create');
    setSelectedTeamMember(null);
    reset(createDefaultForm());
    setIsFormOpen(true);
  };

  const openEditForm = (teamMemberId: string) => {
    const teamMember = data?.data?.find((item) => item.id === teamMemberId) || null;
    if (!teamMember) return;

    setFormMode('edit');
    setSelectedTeamMember(teamMember);
    reset(mapTeamMemberToForm(teamMember));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedTeamMember(null);
    reset(createDefaultForm());
  };

  const onSubmitForm = async (values: TeamMemberFormValues) => {
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      image: values.image.trim(),
      designation: values.designation.trim(),
      phoneNumber: values.phoneNumber.trim(),
      isActive: values.isActive,
    };

    if (formMode === 'create') {
      await createTeamMemberMutation.mutateAsync(payload);
    } else {
      if (!selectedTeamMember?.id) return;
      await updateTeamMemberMutation.mutateAsync({
        id: selectedTeamMember.id,
        payload,
      });
    }

    closeForm();
  };

  const handleStatusToggle = async (teamMemberId: string, nextActive: boolean) => {
    try {
      setUpdatingId(teamMemberId);
      await updateTeamMemberMutation.mutateAsync({
        id: teamMemberId,
        payload: { isActive: nextActive },
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTeamMember?.id) return;
    await deleteTeamMemberMutation.mutateAsync(deleteTeamMember.id);
    setDeleteTeamMember(null);
  };

  const columns: TableColumn<TeamMemberRow>[] = [
    { header: isArabic ? 'الاسم' : 'Name', accessor: 'name', className: 'font-medium' },
    { header: isArabic ? 'المنصب' : 'Designation', accessor: 'designation' },
    { header: isArabic ? 'البريد' : 'Email', accessor: 'email' },
    { header: isArabic ? 'الهاتف' : 'Phone', accessor: 'phoneNumber' },
    {
      header: isArabic ? 'الصورة' : 'Image',
      cell: (row) => (
        <div className="flex items-center">
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="h-10 w-10 rounded-full border border-border object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-xs text-muted-foreground">—</div>
          )}
        </div>
      ),
    },
    {
      header: isArabic ? 'الحالة' : 'Status',
      cell: (row) => (
        <Badge variant="outline" className={cn('rounded-full', getStatusClass(row.isActive))}>
          {row.isActive ? (isArabic ? 'نشط' : 'Active') : isArabic ? 'غير نشط' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: isArabic ? 'تفعيل / تعطيل' : 'Toggle Status',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.isActive}
            disabled={updatingId === row.id}
            onCheckedChange={(checked) => handleStatusToggle(row.id, checked)}
          />
          {updatingId === row.id ? (
            <span className="text-xs text-muted-foreground">{isArabic ? 'جارٍ التحديث...' : 'Updating...'}</span>
          ) : null}
        </div>
      ),
    },
    {
      header: isArabic ? 'إجراءات' : 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => setViewTeamMember(data?.data?.find((item) => item.id === row.id) || null)}
            aria-label="View"
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => openEditForm(row.id)} aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8"
            onClick={() => setDeleteTeamMember(data?.data?.find((item) => item.id === row.id) || null)}
            aria-label="Delete"
          >
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
          <h2 className="text-xl font-semibold text-foreground">{isArabic ? 'إدارة الفريق' : 'Manage Team Members'}</h2>
          <p className="text-sm text-muted-foreground">
            {isArabic ? 'إدارة أعضاء الفريق مع البحث والفلاتر والتحديث الفوري.' : 'Manage team members with search, filters, and live updates.'}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
              placeholder={isArabic ? 'ابحث عن عضو...' : 'Search team members...'}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: 'all' | 'active' | 'inactive') => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isArabic ? 'الكل' : 'All'}</SelectItem>
              <SelectItem value="active">{isArabic ? 'نشط' : 'Active'}</SelectItem>
              <SelectItem value="inactive">{isArabic ? 'غير نشط' : 'Inactive'}</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={openCreateForm}>
            <Plus className="mr-1 h-4 w-4" />
            {isArabic ? 'إضافة عضو' : 'Create Team Member'}
          </Button>
        </div>
      </div>

      {isLoading && !data ? (
        <DashboardPageLoader />
      ) : (
        <>
          <ReusableTable<TeamMemberRow>
            data={rows}
            rowKey={(row) => row.id}
            columns={columns}
            isLoading={isFetching}
            emptyStateTitle={isArabic ? 'لا يوجد أعضاء' : 'No team members found'}
            emptyStateDescription={isArabic ? 'جرّب تعديل الفلاتر أو البحث.' : 'Try adjusting your filters or search term.'}
          />

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {isArabic
                ? `عرض ${rows.length} من أصل ${total} عضو`
                : `Showing ${rows.length} of ${total} team members`}
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

      <Dialog open={Boolean(viewTeamMember)} onOpenChange={(open) => !open && setViewTeamMember(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{isArabic ? 'عرض بيانات العضو' : 'View Team Member'}</DialogTitle>
            <DialogDescription>
              {isArabic ? 'تفاصيل العضو المحدد.' : 'Details of the selected team member.'}
            </DialogDescription>
          </DialogHeader>

          {viewTeamMember ? (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4">
                {viewTeamMember.image ? (
                  <img
                    src={viewTeamMember.image}
                    alt={viewTeamMember.name}
                    className="h-16 w-16 rounded-full border border-border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <div>
                  <p className="text-base font-semibold text-foreground">{viewTeamMember.name}</p>
                  <p className="text-muted-foreground">{viewTeamMember.designation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{viewTeamMember.email}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{viewTeamMember.phoneNumber}</span></div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <Badge variant="outline" className={cn('rounded-full', getStatusClass(Boolean(viewTeamMember.isActive)))}>
                    {viewTeamMember.isActive ? (isArabic ? 'نشط' : 'Active') : isArabic ? 'غير نشط' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create'
                ? isArabic
                  ? 'إضافة عضو فريق'
                  : 'Create Team Member'
                : isArabic
                  ? 'تحديث عضو الفريق'
                  : 'Update Team Member'}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? 'أدخل بيانات العضو. الصورة يجب أن تكون رابط URL نصي.'
                : 'Provide member details. Image should be a URL text value.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>{isArabic ? 'الاسم' : 'Name'}</Label>
                <Input {...register('name', { required: true })} placeholder={isArabic ? 'الاسم الكامل' : 'Full name'} />
              </div>
              <div className="space-y-1">
                <Label>{isArabic ? 'الوظيفة' : 'Designation'}</Label>
                <Input {...register('designation', { required: true })} placeholder={isArabic ? 'المسمى الوظيفي' : 'Job title'} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>{isArabic ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input type="email" {...register('email', { required: true })} placeholder="john@example.com" />
              </div>
              <div className="space-y-1">
                <Label>{isArabic ? 'رقم الهاتف' : 'Phone Number'}</Label>
                <Input {...register('phoneNumber', { required: true })} placeholder="01711111111" />
              </div>
            </div>

            <div className="space-y-1">
              <Label>{isArabic ? 'رابط الصورة (URL)' : 'Image URL'}</Label>
              <Input
                {...register('image', { required: true })}
                placeholder="https://example.com/john.png"
              />
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'أدخل رابط الصورة كنص فقط (لا يوجد رفع ملف).' : 'Use direct image URL text only (no file upload).'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={Boolean(watch('isActive'))}
                onCheckedChange={(checked) => setValue('isActive', checked, { shouldDirty: true })}
              />
              <span className="text-sm text-muted-foreground">{isArabic ? 'الحالة النشطة' : 'Active Status'}</span>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeForm}>
                {isArabic ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" disabled={isSubmitting || createTeamMemberMutation.isPending || updateTeamMemberMutation.isPending}>
                {isSubmitting || createTeamMemberMutation.isPending || updateTeamMemberMutation.isPending
                  ? isArabic
                    ? 'جارٍ الحفظ...'
                    : 'Saving...'
                  : formMode === 'create'
                    ? isArabic
                      ? 'إنشاء العضو'
                      : 'Create Member'
                    : isArabic
                      ? 'حفظ التحديث'
                      : 'Save Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTeamMember)} onOpenChange={(open) => !open && setDeleteTeamMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `هل أنت متأكد من حذف العضو (${deleteTeamMember?.name || ''})؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete member (${deleteTeamMember?.name || ''})? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isArabic ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteTeamMemberMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTeamMemberMutation.isPending
                ? isArabic
                  ? 'جارٍ الحذف...'
                  : 'Deleting...'
                : isArabic
                  ? 'تأكيد الحذف'
                  : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default TeamMembersDashboardPage;
