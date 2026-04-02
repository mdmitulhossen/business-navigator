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
  useCreateBlog,
  useDeleteBlog,
  useFetchBlogs,
  useUpdateBlog,
  type CreateBlogPayload,
  type TBlog,
  type UpdateBlogPayload,
} from '@/services/useBlogService';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

interface BlogDashboardPageProps {
  language: 'en' | 'ar';
}

type BlogRow = {
  serial: number;
  id: string;
  title: string;
  subTitle: string;
  bloggerName: string;
  type: string;
  image: string;
  description: string;
  isActive: boolean;
};

type BlogFormValues = {
  title: string;
  subTitle: string;
  bloggerName: string;
  type: string;
  image: string;
  description: string;
  isActive: boolean;
};

const createDefaultForm = (): BlogFormValues => ({
  title: '',
  subTitle: '',
  bloggerName: '',
  type: '',
  image: '',
  description: '',
  isActive: true,
});

const mapBlogToForm = (blog: TBlog): BlogFormValues => ({
  title: blog.title || '',
  subTitle: blog.subTitle || '',
  bloggerName: blog.bloggerName || '',
  type: blog.type || '',
  image: blog.image || '',
  description: blog.description || '',
  isActive: Boolean(blog.isActive),
});

const buildCreatePayload = (values: BlogFormValues): CreateBlogPayload => ({
  title: values.title.trim(),
  subTitle: values.subTitle.trim(),
  description: values.description.trim(),
  bloggerName: values.bloggerName.trim(),
  type: values.type.trim(),
  image: values.image.trim(),
  isActive: values.isActive,
});

const buildUpdatePayload = (values: BlogFormValues): UpdateBlogPayload => {
  const createPayload = buildCreatePayload(values);

  return {
    title: createPayload.title,
    subTitle: createPayload.subTitle,
    description: createPayload.description,
    bloggerName: createPayload.bloggerName,
    type: createPayload.type,
    image: createPayload.image,
    isActive: createPayload.isActive,
  };
};

const BlogDashboardPage = ({ language }: BlogDashboardPageProps) => {
  const isArabic = language === 'ar';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedBlog, setSelectedBlog] = useState<TBlog | null>(null);
  const [viewBlog, setViewBlog] = useState<TBlog | null>(null);
  const [deleteBlog, setDeleteBlog] = useState<TBlog | null>(null);

  const form = useForm<BlogFormValues>({
    defaultValues: createDefaultForm(),
    mode: 'onSubmit',
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
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
      type: typeFilter === 'all' ? undefined : typeFilter,
    }),
    [page, limit, searchTerm, statusFilter, typeFilter],
  );

  const { data, isLoading, isFetching } = useFetchBlogs(queryParams, true);
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();

  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const blogs = useMemo<TBlog[]>(() => data?.data ?? [], [data?.data]);

  const rows: BlogRow[] = blogs.map((blog, index) => ({
    serial: (page - 1) * limit + index + 1,
    id: blog.id,
    title: blog.title,
    subTitle: blog.subTitle,
    bloggerName: blog.bloggerName,
    type: blog.type,
    image: blog.image,
    description: blog.description,
    isActive: Boolean(blog.isActive),
  }));

  const typeOptions = useMemo(() => {
    const options = new Set<string>();
    blogs.forEach((blog) => {
      const value = blog.type?.trim();
      if (value) options.add(value);
    });
    return Array.from(options);
  }, [blogs]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openCreateForm = () => {
    setFormMode('create');
    setSelectedBlog(null);
    reset(createDefaultForm());
    setIsFormOpen(true);
  };

  const openEditForm = (blogId: string) => {
    const blog = blogs.find((item) => item.id === blogId) || null;
    if (!blog) return;

    setFormMode('edit');
    setSelectedBlog(blog);
    reset(mapBlogToForm(blog));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedBlog(null);
    reset(createDefaultForm());
  };

  const onSubmitForm = async (values: BlogFormValues) => {
    if (formMode === 'create') {
      await createBlogMutation.mutateAsync(buildCreatePayload(values));
    } else {
      if (!selectedBlog?.id) return;
      await updateBlogMutation.mutateAsync({
        id: selectedBlog.id,
        payload: buildUpdatePayload(values),
      });
    }

    closeForm();
  };

  const handleStatusToggle = async (blogId: string, nextActive: boolean) => {
    try {
      setUpdatingId(blogId);
      await updateBlogMutation.mutateAsync({
        id: blogId,
        payload: { isActive: nextActive },
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteBlog?.id) return;
    await deleteBlogMutation.mutateAsync(deleteBlog.id);
    setDeleteBlog(null);
  };

  const columns: TableColumn<BlogRow>[] = [
    {
      header: isArabic ? 'رقم' : '#',
      accessor: 'serial',
      className: 'w-[70px] font-medium',
    },
    {
      header: isArabic ? 'العنوان' : 'Title',
      accessor: 'title',
      className: 'font-medium',
    },
    { header: isArabic ? 'العنوان الفرعي' : 'Sub Title', accessor: 'subTitle' },
    { header: isArabic ? 'الكاتب' : 'Blogger', accessor: 'bloggerName' },
    { header: isArabic ? 'النوع' : 'Type', accessor: 'type' },
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
            onClick={() => setViewBlog(blogs.find((item) => item.id === row.id) || null)}
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
            onClick={() => setDeleteBlog(blogs.find((item) => item.id === row.id) || null)}
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
          <h2 className="text-xl font-semibold text-foreground">{isArabic ? 'إدارة المدونة' : 'Manage Blog'}</h2>
          <p className="text-sm text-muted-foreground">
            {isArabic
              ? 'إدارة منشورات المدونة مع البحث والتصفية والتحديث المباشر.'
              : 'Manage blog posts with search, filters, and live updates.'}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
              placeholder={isArabic ? 'ابحث عن مقال...' : 'Search blogs...'}
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

          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder={isArabic ? 'النوع' : 'Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isArabic ? 'كل الأنواع' : 'All types'}</SelectItem>
              {typeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={openCreateForm}>
            <Plus className="mr-1 h-4 w-4" />
            {isArabic ? 'إضافة مقال' : 'Create Blog'}
          </Button>
        </div>
      </div>

      {isLoading && !data ? (
        <DashboardPageLoader />
      ) : (
        <>
          <ReusableTable<BlogRow>
            data={rows}
            rowKey={(row) => row.id}
            columns={columns}
            isLoading={isFetching}
            emptyStateTitle={isArabic ? 'لا توجد مقالات' : 'No blogs found'}
            emptyStateDescription={isArabic ? 'جرّب تغيير الفلاتر أو البحث.' : 'Try adjusting filters or search term.'}
          />

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {isArabic ? `عرض ${rows.length} من أصل ${total} مقال` : `Showing ${rows.length} of ${total} blogs`}
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

      <Dialog open={Boolean(viewBlog)} onOpenChange={(open) => !open && setViewBlog(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isArabic ? 'عرض المقال' : 'View Blog'}</DialogTitle>
            <DialogDescription>
              {isArabic ? 'تفاصيل المقال المحدد.' : 'Details of the selected blog post.'}
            </DialogDescription>
          </DialogHeader>

          {viewBlog ? (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div><span className="text-muted-foreground">Title:</span> <span className="font-medium">{viewBlog.title}</span></div>
                <div><span className="text-muted-foreground">Sub Title:</span> <span className="font-medium">{viewBlog.subTitle}</span></div>
                <div><span className="text-muted-foreground">Blogger:</span> <span className="font-medium">{viewBlog.bloggerName}</span></div>
                <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{viewBlog.type}</span></div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-full',
                      viewBlog.isActive
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300',
                    )}
                  >
                    {viewBlog.isActive ? (isArabic ? 'نشط' : 'Active') : isArabic ? 'غير نشط' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground">Image URL</p>
                <a href={viewBlog.image} target="_blank" rel="noreferrer" className="break-all text-primary underline">
                  {viewBlog.image}
                </a>
              </div>

              <div>
                <p className="mb-2 text-muted-foreground">{isArabic ? 'المحتوى' : 'Description'}</p>
                <div className="prose prose-sm max-w-none rounded-lg border border-border p-3 dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: viewBlog.description || '<p>-</p>' }} />
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create'
                ? isArabic
                  ? 'إضافة مقال جديد'
                  : 'Create Blog'
                : isArabic
                  ? 'تحديث المقال'
                  : 'Update Blog'}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? 'أدخل بيانات المقال. الصورة يجب أن تكون رابط URL نصي.'
                : 'Provide blog details. Image should be a URL text value.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>{isArabic ? 'العنوان' : 'Title'}</Label>
                <Input {...register('title', { required: true })} placeholder={isArabic ? 'عنوان المقال' : 'Blog title'} />
              </div>
              <div className="space-y-1">
                <Label>{isArabic ? 'العنوان الفرعي' : 'Sub Title'}</Label>
                <Input {...register('subTitle', { required: true })} placeholder={isArabic ? 'عنوان فرعي' : 'Sub title'} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>{isArabic ? 'الكاتب' : 'Blogger Name'}</Label>
                <Input {...register('bloggerName', { required: true })} placeholder={isArabic ? 'اسم الكاتب' : 'Writer name'} />
              </div>
              <div className="space-y-1">
                <Label>{isArabic ? 'النوع' : 'Type'}</Label>
                <Input {...register('type', { required: true })} placeholder={isArabic ? 'مثال: legal' : 'e.g. legal'} />
              </div>
            </div>

            <div className="space-y-1">
              <Label>{isArabic ? 'رابط الصورة (URL)' : 'Image URL'}</Label>
              <Input {...register('image', { required: true })} placeholder="https://example.com/blog-cover.png" />
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'رابط نصي فقط (لا يوجد رفع ملفات).' : 'Text URL only (no file upload).'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{isArabic ? 'الوصف / المحتوى' : 'Description / Content'}</Label>
              <Controller
                name="description"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <SunEditor
                    setAllPlugins
                    setContents={field.value || ''}
                    onChange={field.onChange}
                    setOptions={{
                      buttonList: [
                        ['undo', 'redo'],
                        ['bold', 'underline', 'italic', 'strike'],
                        ['formatBlock', 'fontSize'],
                        ['fontColor', 'hiliteColor'],
                        ['align', 'list'],
                        ['link', 'table'],
                        ['fullScreen', 'preview', 'codeView'],
                      ],
                      height: '260px',
                      placeholder: isArabic ? 'أدخل وصف المقال...' : 'Enter blog description...',
                    }}
                  />
                )}
              />
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
              <Button type="submit" disabled={isSubmitting || createBlogMutation.isPending || updateBlogMutation.isPending}>
                {isSubmitting || createBlogMutation.isPending || updateBlogMutation.isPending
                  ? isArabic
                    ? 'جارٍ الحفظ...'
                    : 'Saving...'
                  : formMode === 'create'
                    ? isArabic
                      ? 'إنشاء المقال'
                      : 'Create Blog'
                    : isArabic
                      ? 'حفظ التحديث'
                      : 'Save Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteBlog)} onOpenChange={(open) => !open && setDeleteBlog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `هل أنت متأكد من حذف المقال (${deleteBlog?.title || ''})؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete blog (${deleteBlog?.title || ''})? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isArabic ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteBlogMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteBlogMutation.isPending ? (isArabic ? 'جارٍ الحذف...' : 'Deleting...') : isArabic ? 'تأكيد الحذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default BlogDashboardPage;
