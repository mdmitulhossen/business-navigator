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
  useCreateService,
  useDeleteService,
  useFetchService,
  useFetchServices,
  useUpdateService,
  type CreateServicePayload,
  type TService,
  type TServiceNode,
} from '@/services/useService';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, type Control, type UseFormRegister } from 'react-hook-form';

interface ServicesDashboardPageProps {
  language: 'en' | 'ar';
}

interface ServiceNodeFormValues {
  id: string;
  title: string;
  titleAr: string;
  requirements: string[];
  process: string[];
  children: ServiceNodeFormValues[];
}

interface ServiceFormValues {
  id: string;
  icon: string;
  titleKey: string;
  descKey: string;
  requirements: string[];
  process: string[];
  subServices: ServiceNodeFormValues[];
  isActive: boolean;
}

const createDefaultNode = (): ServiceNodeFormValues => ({
  id: '',
  title: '',
  titleAr: '',
  requirements: [''],
  process: [''],
  children: [],
});

const createDefaultServiceForm = (): ServiceFormValues => ({
  id: '',
  icon: '',
  titleKey: '',
  descKey: '',
  requirements: [''],
  process: [''],
  subServices: [],
  isActive: true,
});

const trimList = (items: string[]) => items.map((item) => item.trim()).filter(Boolean);

const normalizeNodePayload = (node: ServiceNodeFormValues): TServiceNode => {
  const requirements = trimList(node.requirements);
  const process = trimList(node.process);
  const children = node.children.map(normalizeNodePayload).filter((item) => item.id);

  return {
    id: node.id.trim(),
    title: node.title.trim(),
    titleAr: node.titleAr.trim(),
    requirements: requirements.length ? requirements : undefined,
    process: process.length ? process : undefined,
    children: children.length ? children : undefined,
  };
};

const toCreatePayload = (values: ServiceFormValues): CreateServicePayload => {
  const subServices = values.subServices.map(normalizeNodePayload).filter((item) => item.id);

  return {
    id: values.id.trim(),
    icon: values.icon.trim(),
    titleKey: values.titleKey.trim(),
    descKey: values.descKey.trim(),
    requirements: trimList(values.requirements),
    process: trimList(values.process),
    subServices: subServices.length ? subServices : undefined,
    isActive: values.isActive,
  };
};

const toUpdatePayload = (values: ServiceFormValues) => {
  const createPayload = toCreatePayload(values);
  return {
    icon: createPayload.icon,
    titleKey: createPayload.titleKey,
    descKey: createPayload.descKey,
    requirements: createPayload.requirements,
    process: createPayload.process,
    subServices: createPayload.subServices,
    isActive: createPayload.isActive,
  };
};

const mapNodeToForm = (node: TServiceNode): ServiceNodeFormValues => ({
  id: node.id || '',
  title: node.title || '',
  titleAr: node.titleAr || '',
  requirements: node.requirements?.length ? [...node.requirements] : [''],
  process: node.process?.length ? [...node.process] : [''],
  children: node.children?.map(mapNodeToForm) || [],
});

const mapServiceToForm = (service: TService): ServiceFormValues => ({
  id: service.id || '',
  icon: service.icon || '',
  titleKey: service.titleKey || '',
  descKey: service.descKey || '',
  requirements: service.requirements?.length ? [...service.requirements] : [''],
  process: service.process?.length ? [...service.process] : [''],
  subServices: service.subServices?.map(mapNodeToForm) || [],
  isActive: Boolean(service.isActive),
});

interface StringArrayFieldsProps {
  language: 'en' | 'ar';
  labelEn: string;
  labelAr: string;
  name: string;
  control: Control<ServiceFormValues>;
  register: UseFormRegister<ServiceFormValues>;
}

const StringArrayFields = ({ language, labelEn, labelAr, name, control, register }: StringArrayFieldsProps) => {
  const isArabic = language === 'ar';
  const fieldArray = useFieldArray({ control, name: name as never });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{isArabic ? labelAr : labelEn}</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => fieldArray.append('' as never)}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          {isArabic ? 'إضافة' : 'Add'}
        </Button>
      </div>

      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input
            {...register(`${name}.${index}` as never)}
            placeholder={isArabic ? 'أدخل قيمة...' : 'Enter value...'}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            disabled={fieldArray.fields.length <= 1}
            onClick={() => fieldArray.remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

interface ServiceNodeFieldsProps {
  language: 'en' | 'ar';
  name: string;
  control: Control<ServiceFormValues>;
  register: UseFormRegister<ServiceFormValues>;
  onRemove?: () => void;
}

const ServiceNodeFields = ({ language, name, control, register, onRemove }: ServiceNodeFieldsProps) => {
  const isArabic = language === 'ar';
  const childrenFieldArray = useFieldArray({ control, name: `${name}.children` as never });

  return (
    <div className="space-y-4 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">{isArabic ? 'عنصر خدمة' : 'Service Node'}</h4>
        {onRemove ? (
          <Button type="button" variant="destructive" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input {...register(`${name}.id` as never)} placeholder="id" />
        <Input {...register(`${name}.title` as never)} placeholder="title" />
        <Input {...register(`${name}.titleAr` as never)} placeholder="titleAr" />
      </div>

      <StringArrayFields
        language={language}
        labelEn="Requirements"
        labelAr="المتطلبات"
        name={`${name}.requirements`}
        control={control}
        register={register}
      />

      <StringArrayFields
        language={language}
        labelEn="Process"
        labelAr="العملية"
        name={`${name}.process`}
        control={control}
        register={register}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{isArabic ? 'الأبناء (Children)' : 'Children'}</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => childrenFieldArray.append(createDefaultNode() as never)}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            {isArabic ? 'إضافة Child' : 'Add Child'}
          </Button>
        </div>

        {childrenFieldArray.fields.map((field, index) => (
          <ServiceNodeFields
            key={field.id}
            language={language}
            name={`${name}.children.${index}`}
            control={control}
            register={register}
            onRemove={() => childrenFieldArray.remove(index)}
          />
        ))}
      </div>
    </div>
  );
};

const ServicesDashboardPage = ({ language }: ServicesDashboardPageProps) => {
  const isArabic = language === 'ar';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewServiceId, setViewServiceId] = useState<string | null>(null);
  const [deleteService, setDeleteService] = useState<TService | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const form = useForm<ServiceFormValues>({
    defaultValues: createDefaultServiceForm(),
    mode: 'onSubmit',
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form;
  const subServicesFieldArray = useFieldArray({ control, name: 'subServices' });

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
  const createServiceMutation = useCreateService();
  const deleteServiceMutation = useDeleteService();
  const viewServiceQuery = useFetchService(viewServiceId ?? undefined, Boolean(viewServiceId));
  const selectedServiceQuery = useFetchService(
    selectedServiceId ?? undefined,
    Boolean(selectedServiceId && isFormOpen && formMode === 'edit'),
  );

  const services = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (formMode !== 'edit') return;
    const service = selectedServiceQuery.data?.data;
    if (!service) return;
    reset(mapServiceToForm(service));
  }, [formMode, selectedServiceQuery.data, reset]);

  const openCreateForm = () => {
    setFormMode('create');
    setSelectedServiceId(null);
    reset(createDefaultServiceForm());
    setIsFormOpen(true);
  };

  const openEditForm = (id: string) => {
    setFormMode('edit');
    setSelectedServiceId(id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedServiceId(null);
    reset(createDefaultServiceForm());
  };

  const onSubmitForm = async (values: ServiceFormValues) => {
    if (formMode === 'create') {
      await createServiceMutation.mutateAsync(toCreatePayload(values));
    } else {
      if (!selectedServiceId) return;
      await updateServiceMutation.mutateAsync({
        id: selectedServiceId,
        payload: toUpdatePayload(values),
      });
    }

    closeForm();
  };

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

  const handleDeleteConfirm = async () => {
    if (!deleteService?.id) return;
    await deleteServiceMutation.mutateAsync(deleteService.id);
    setDeleteService(null);
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
    {
      header: isArabic ? 'إجراءات' : 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setViewServiceId(row.id)} aria-label="View">
            <Eye className="h-4 w-4" />
          </Button>

          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => openEditForm(row.id)} aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </Button>

          <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setDeleteService(row)} aria-label="Delete">
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
          <h2 className="text-xl font-semibold text-foreground">{isArabic ? 'إدارة الخدمات' : 'Manage Services'}</h2>
          <p className="text-sm text-muted-foreground">
            {isArabic ? 'قائمة الخدمات مع حالة التفعيل والتحديث المباشر.' : 'Service list with active status and live updates.'}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <div className="relative w-full sm:w-80">
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
            {isArabic ? 'إضافة خدمة' : 'Create Service'}
          </Button>
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

      <Dialog open={Boolean(viewServiceId)} onOpenChange={(open) => !open && setViewServiceId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isArabic ? 'عرض الخدمة' : 'View Service'}</DialogTitle>
            <DialogDescription>
              {isArabic ? 'تفاصيل الخدمة المحددة.' : 'Details of the selected service.'}
            </DialogDescription>
          </DialogHeader>

          {viewServiceQuery.isLoading ? (
            <DashboardPageLoader />
          ) : viewServiceQuery.data?.data ? (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-medium">{viewServiceQuery.data.data.id}</span></div>
                <div><span className="text-muted-foreground">Icon:</span> <span className="font-medium">{viewServiceQuery.data.data.icon}</span></div>
                <div><span className="text-muted-foreground">Title Key:</span> <span className="font-medium">{viewServiceQuery.data.data.titleKey}</span></div>
                <div><span className="text-muted-foreground">Desc Key:</span> <span className="font-medium">{viewServiceQuery.data.data.descKey}</span></div>
              </div>

              <div>
                <p className="mb-2 text-muted-foreground">{isArabic ? 'المتطلبات' : 'Requirements'}</p>
                <div className="rounded-lg border border-border p-3">
                  <ul className="list-disc space-y-1 pl-5">
                    {(viewServiceQuery.data.data.requirements || []).map((item, idx) => (
                      <li key={`${item}-${idx}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <p className="mb-2 text-muted-foreground">{isArabic ? 'العملية' : 'Process'}</p>
                <div className="rounded-lg border border-border p-3">
                  <ul className="list-disc space-y-1 pl-5">
                    {(viewServiceQuery.data.data.process || []).map((item, idx) => (
                      <li key={`${item}-${idx}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{isArabic ? 'لا توجد بيانات' : 'No data found.'}</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create'
                ? isArabic
                  ? 'إضافة خدمة جديدة'
                  : 'Create Service'
                : isArabic
                  ? 'تحديث الخدمة'
                  : 'Update Service'}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? 'يمكنك إدارة كل البيانات بشكل ديناميكي (Sub Services و Children متداخلة).'
                : 'Manage all fields dynamically including nested Sub Services and Children.'}
            </DialogDescription>
          </DialogHeader>

          {formMode === 'edit' && selectedServiceQuery.isLoading ? (
            <DashboardPageLoader />
          ) : (
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>ID</Label>
                  <Input {...register('id')} disabled={formMode === 'edit'} />
                </div>
                <div className="space-y-1">
                  <Label>Icon</Label>
                  <Input {...register('icon')} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Title Key</Label>
                  <Input {...register('titleKey')} />
                </div>
                <div className="space-y-1">
                  <Label>Description Key</Label>
                  <Input {...register('descKey')} />
                </div>
              </div>

              <StringArrayFields
                language={language}
                labelEn="Requirements"
                labelAr="المتطلبات"
                name="requirements"
                control={control}
                register={register}
              />

              <StringArrayFields
                language={language}
                labelEn="Process"
                labelAr="العملية"
                name="process"
                control={control}
                register={register}
              />

              <div className="space-y-3 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label>{isArabic ? 'الخدمات الفرعية (Sub Services)' : 'Sub Services'}</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => subServicesFieldArray.append(createDefaultNode())}>
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    {isArabic ? 'إضافة Sub Service' : 'Add Sub Service'}
                  </Button>
                </div>

                {subServicesFieldArray.fields.length ? (
                  <div className="space-y-3">
                    {subServicesFieldArray.fields.map((field, index) => (
                      <ServiceNodeFields
                        key={field.id}
                        language={language}
                        name={`subServices.${index}`}
                        control={control}
                        register={register}
                        onRemove={() => subServicesFieldArray.remove(index)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'لم يتم إضافة خدمات فرعية بعد.' : 'No sub services added yet.'}
                  </p>
                )}
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
                <Button type="submit" disabled={isSubmitting || createServiceMutation.isPending || updateServiceMutation.isPending}>
                  {isSubmitting || createServiceMutation.isPending || updateServiceMutation.isPending
                    ? isArabic
                      ? 'جارٍ الحفظ...'
                      : 'Saving...'
                    : formMode === 'create'
                      ? isArabic
                        ? 'إنشاء الخدمة'
                        : 'Create Service'
                      : isArabic
                        ? 'حفظ التحديث'
                        : 'Save Update'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteService)} onOpenChange={(open) => !open && setDeleteService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `هل أنت متأكد من حذف الخدمة (${deleteService?.id || ''})؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete service (${deleteService?.id || ''})? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isArabic ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteServiceMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteServiceMutation.isPending ? (isArabic ? 'جارٍ الحذف...' : 'Deleting...') : isArabic ? 'تأكيد الحذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default ServicesDashboardPage;
