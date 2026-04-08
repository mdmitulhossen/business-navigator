import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { useFetchReviews } from '@/services/useReviewService';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

type FeaturedReviewsSliderProps = {
  language: 'en' | 'ar';
  className?: string;
  title?: string;
  subtitle?: string;
};

const FeaturedReviewsSlider = ({ language, className, title, subtitle }: FeaturedReviewsSliderProps) => {
  const isArabic = language === 'ar';
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const { data, isLoading, isError } = useFetchReviews({ isFeature: true, limit: 20 }, true);

  const featuredReviews = data?.data ?? [];

  useEffect(() => {
    if (!carouselApi || featuredReviews.length <= 1) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [carouselApi, featuredReviews.length]);

  if (isLoading) {
    return (
      <section className={cn('space-y-4', className)}>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {title || (isArabic ? 'آراء العملاء' : 'Customer Reviews')}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {subtitle || (isArabic ? 'جارٍ تحميل التقييمات المميزة...' : 'Loading featured reviews...')}
          </p>
        </div>
      </section>
    );
  }

  if (isError || !featuredReviews.length) {
    return null;
  }

  return (
    <section className={cn('space-y-6', className)}>
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {title || (isArabic ? 'آراء العملاء' : 'What Our Customers Say')}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {subtitle || (isArabic ? 'تقييمات حقيقية من عملائنا المميزين.' : 'Real feedback from our valued clients.')}
        </p>
      </div>

      <div className="mx-auto container px-10 sm:px-14">
        <Carousel setApi={setCarouselApi} opts={{ align: 'start', loop: true }}>
          <CarouselContent>
            {featuredReviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full border-border/60 bg-card/90 backdrop-blur">
                  <CardContent className="p-5 flex h-full flex-col">
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant="outline" className="rounded-full">
                        {isArabic ? 'عميل موثوق' : 'Verified Client'}
                      </Badge>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={cn('h-4 w-4', idx < review.rating ? 'fill-current' : 'text-slate-300')}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="flex-1 text-sm leading-6 text-muted-foreground">“{review.comment}”</p>

                    <div className="mt-4 border-t border-border/60 pt-3">
                      <p className="font-semibold text-foreground">{review.name}</p>
                      {review.phone ? <p className="text-xs text-muted-foreground" dir="ltr">{review.phone}</p> : null}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedReviewsSlider;
