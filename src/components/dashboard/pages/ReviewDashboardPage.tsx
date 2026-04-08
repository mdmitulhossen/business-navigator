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
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useDeleteReview, useFetchReview, useFetchReviews, useUpdateReview, type TReview } from '@/services/useReviewService';
import { Eye, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface ReviewDashboardPageProps {
  language: 'en' | 'ar';
}

type ReviewRow = {
  serial: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  comment: string;
  isFeature: boolean;
};

const formatDate = (value?: string, language?: 'en' | 'ar') => {
  if (!value) return '-';

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

const ReviewDashboardPage = ({ language }: ReviewDashboardPageProps) => {
  const isArabic = language === 'ar';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [featureFilter, setFeatureFilter] = useState<'all' | 'featured' | 'normal'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewReviewId, setViewReviewId] = useState<string | null>(null);
  const [deleteReview, setDeleteReview] = useState<TReview | null>(null);

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
      isFeature: featureFilter === 'all' ? undefined : featureFilter === 'featured',
    }),
    [page, limit, searchTerm, featureFilter],
  );

  const { data, isLoading, isFetching } = useFetchReviews(queryParams, true);
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();
  const viewReviewQuery = useFetchReview(viewReviewId ?? undefined, Boolean(viewReviewId));

  const reviews = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const rows: ReviewRow[] = reviews.map((review, index) => ({
    serial: (page - 1) * limit + index + 1,
    id: review.id,
    name: review.name,
    email: review.email || '-',
    phone: review.phone || '-',
    rating: review.rating,
    comment: review.comment,
    isFeature: Boolean(review.isFeature),
  }));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleFeatureToggle = async (id: string, nextValue: boolean) => {
    try {
      setUpdatingId(id);
      await updateReviewMutation.mutateAsync({
        id,
        payload: { isFeature: nextValue },
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteReview?.id) return;
    await deleteReviewMutation.mutateAsync(deleteReview.id);
    setDeleteReview(null);
  };

  const columns: TableColumn<ReviewRow>[] = [
    {
      header: isArabic ? 'رقم' : '#',
      accessor: 'serial',
      className: 'w-[70px] font-medium',
    },
    { header: isArabic ? 'الاسم' : 'Name', accessor: 'name', className: 'font-medium' },
    { header: isArabic ? 'البريد' : 'Email', accessor: 'email' },
    { header: isArabic ? 'الهاتف' : 'Phone', accessor: 'phone' },
    {
      header: isArabic ? 'التقييم' : 'Rating',
      cell: (row) => <span>{row.rating}/5</span>,
    },
    {
      header: isArabic ? 'التعليق' : 'Comment',
      cell: (row) => (
        <p className="max-w-[280px] truncate" title={row.comment}>
          {row.comment}
        </p>
      ),
    },
    {
      header: isArabic ? 'المميز' : 'Featured',
      cell: (row) => (
        <Badge
          variant="outline"
          className={cn(
            'rounded-full',
            row.isFeature
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300',
          )}
        >
          {row.isFeature ? (isArabic ? 'مميز' : 'Featured') : isArabic ? 'عادي' : 'Normal'}
        </Badge>
      ),
    },
    {
      header: isArabic ? 'عرض في الموقع' : 'Show on Website',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.isFeature}
            disabled={updatingId === row.id}
            onCheckedChange={(checked) => handleFeatureToggle(row.id, checked)}
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
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setViewReviewId(row.id)} aria-label="View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setDeleteReview(reviews.find((item) => item.id === row.id) || null)} aria-label="Delete">
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
          <h2 className="text-xl font-semibold text-foreground">{isArabic ? 'إدارة التقييمات' : 'Manage Reviews'}</h2>
          <p className="text-sm text-muted-foreground">
            {isArabic
              ? 'تحكم في تقييمات العملاء وتفعيل ما يظهر في الموقع.'
              : 'Manage customer reviews and toggle which ones are featured on website.'}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
              placeholder={isArabic ? 'ابحث بالاسم أو التعليق...' : 'Search by name or comment...'}
            />
          </div>

          <Select
            value={featureFilter}
            onValueChange={(value: 'all' | 'featured' | 'normal') => {
              setFeatureFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="sm:w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isArabic ? 'كل التقييمات' : 'All reviews'}</SelectItem>
              <SelectItem value="featured">{isArabic ? 'مميزة فقط' : 'Featured only'}</SelectItem>
              <SelectItem value="normal">{isArabic ? 'غير مميزة' : 'Non-featured'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && !data ? (
        <DashboardPageLoader />
      ) : (
        <>
          <ReusableTable<ReviewRow>
            data={rows}
            columns={columns}
            rowKey={(row) => row.id}
            isLoading={isFetching}
            emptyStateTitle={isArabic ? 'لا توجد تقييمات' : 'No reviews found'}
            emptyStateDescription={isArabic ? 'جرّب تعديل الفلاتر أو البحث.' : 'Try adjusting your filters or search term.'}
          />

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {isArabic
                ? `عرض ${rows.length} من أصل ${total} تقييم`
                : `Showing ${rows.length} of ${total} reviews`}
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

      <Dialog open={Boolean(viewReviewId)} onOpenChange={(open) => !open && setViewReviewId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isArabic ? 'عرض التقييم' : 'View Review'}</DialogTitle>
            <DialogDescription>{isArabic ? 'تفاصيل التقييم المحدد.' : 'Details of the selected review.'}</DialogDescription>
          </DialogHeader>

          {viewReviewQuery.isLoading ? (
            <DashboardPageLoader />
          ) : viewReviewQuery.data?.data ? (
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{viewReviewQuery.data.data.name}</span></div>
              <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{viewReviewQuery.data.data.email || '-'}</span></div>
              <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{viewReviewQuery.data.data.phone || '-'}</span></div>
              <div><span className="text-muted-foreground">Rating:</span> <span className="font-medium">{viewReviewQuery.data.data.rating}/5</span></div>
              <div><span className="text-muted-foreground">Featured:</span> <span className="font-medium">{viewReviewQuery.data.data.isFeature ? 'Yes' : 'No'}</span></div>
              <div><span className="text-muted-foreground">Created:</span> <span className="font-medium">{formatDate(viewReviewQuery.data.data.createdAt, language)}</span></div>
              <div>
                <p className="mb-2 text-muted-foreground">Comment</p>
                <div className="rounded-lg border border-border p-3 text-sm text-foreground">{viewReviewQuery.data.data.comment}</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{isArabic ? 'لا توجد بيانات' : 'No data found.'}</p>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteReview)} onOpenChange={(open) => !open && setDeleteReview(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `هل أنت متأكد من حذف التقييم (${deleteReview?.name || ''})؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete review (${deleteReview?.name || ''})? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isArabic ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteReviewMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteReviewMutation.isPending ? (isArabic ? 'جارٍ الحذف...' : 'Deleting...') : isArabic ? 'تأكيد الحذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default ReviewDashboardPage;
