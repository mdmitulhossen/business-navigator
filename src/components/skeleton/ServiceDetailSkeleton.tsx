import { Skeleton } from '@/components/ui/skeleton';

const ServiceDetailSkeleton = () => {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden pt-10 pb-10">
        <div className="container-custom relative z-10 space-y-4">
          <Skeleton className="h-5 w-44 bg-white/20 dark:bg-muted/40" />
          <Skeleton className="h-12 w-full max-w-2xl bg-white/20 dark:bg-muted/40" />
          <Skeleton className="h-6 w-full max-w-xl bg-white/20 dark:bg-muted/40" />
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-8 w-56" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-xl border border-border p-4 space-y-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-custom space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom space-y-4">
          <Skeleton className="h-8 w-44" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailSkeleton;