import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFetchCMS } from '@/services/useCMSService';
import { PlayCircle } from 'lucide-react';

const getYouTubeEmbedUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return '';

  const watchMatch = trimmed.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = trimmed.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  return '';
};

const Gallery = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const { data: cmsData, isLoading } = useFetchCMS(true);

  const images = Array.isArray(cmsData?.data?.companyGellert?.images)
    ? cmsData?.data?.companyGellert?.images
    : [];

  const videos = Array.isArray(cmsData?.data?.companyGellert?.videos)
    ? cmsData?.data?.companyGellert?.videos
    : [];

  return (
    <Layout>
      <PageHero
        badge={isArabic ? 'المعرض' : 'GALLERY'}
        title={isArabic ? 'معرض الشركة' : 'Company Gallery'}
        subtitle={
          isArabic
            ? 'تصفح صورنا وفيديوهاتنا لمعرفة المزيد عن خدماتنا.'
            : 'Explore our image and video showcase to learn more about our services.'
        }
      />

      <section className="section-padding bg-background">
        <div className="container-custom space-y-12">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-foreground">{isArabic ? 'معرض الصور' : 'Image Gallery'}</h2>

            {isLoading ? (
              <p className="text-sm text-muted-foreground">{isArabic ? 'جارٍ تحميل الصور...' : 'Loading gallery images...'}</p>
            ) : images.length ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {images.map((url, index) => (
                  <Card key={`${url}-${index}`} className="overflow-hidden">
                    <CardContent className="p-0">
                      <img
                        src={url}
                        alt={`gallery-${index + 1}`}
                        className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{isArabic ? 'لا توجد صور متاحة حالياً.' : 'No gallery images available right now.'}</p>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold text-foreground">{isArabic ? 'معرض الفيديو' : 'Video Gallery'}</h2>

            {isLoading ? (
              <p className="text-sm text-muted-foreground">{isArabic ? 'جارٍ تحميل الفيديوهات...' : 'Loading gallery videos...'}</p>
            ) : videos.length ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {videos.map((video, index) => {
                  const youtubeEmbed = video.type === 'link' ? getYouTubeEmbedUrl(video.value) : '';

                  return (
                    <Card key={`${video.type}-${video.value}-${index}`} className="overflow-hidden border-border/70">
                      <CardContent className="p-4">
                        {video.type === 'embed' ? (
                          <div className="aspect-video overflow-hidden rounded-lg border border-border" dangerouslySetInnerHTML={{ __html: video.value }} />
                        ) : youtubeEmbed ? (
                          <div className="aspect-video overflow-hidden rounded-lg border border-border">
                            <iframe
                              src={youtubeEmbed}
                              className="h-full w-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={`video-${index + 1}`}
                            />
                          </div>
                        ) : (
                          <a
                            href={video.value}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 break-all text-primary underline"
                          >
                            <PlayCircle className="h-4 w-4" />
                            {video.value}
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{isArabic ? 'لا توجد فيديوهات متاحة حالياً.' : 'No gallery videos available right now.'}</p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
