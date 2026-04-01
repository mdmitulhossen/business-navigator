import { Skeleton } from '@/components/ui/skeleton';

const AboutTeamSectionSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
};

export default AboutTeamSectionSkeleton;