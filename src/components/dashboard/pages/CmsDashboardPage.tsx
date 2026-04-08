import DashboardPageLoader from '@/components/dashboard/DashboardPageLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useCreateOrUpdateCMS,
  useFetchCMS,
  type SocialMediaKey,
  type TCMSContact,
  type TCompanyGalleryVideo,
} from '@/services/useCMSService';
import { FileText, Loader2, Plus, X, Youtube } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

interface CmsDashboardPageProps {
  language: 'en' | 'ar';
}

const SOCIAL_MEDIA_OPTIONS: { key: SocialMediaKey; labelEn: string; labelAr: string }[] = [
  { key: 'facebook', labelEn: 'Facebook', labelAr: 'فيسبوك' },
  { key: 'twitter', labelEn: 'Twitter', labelAr: 'تويتر' },
  { key: 'instagram', labelEn: 'Instagram', labelAr: 'إنستجرام' },
  { key: 'linkedin', labelEn: 'LinkedIn', labelAr: 'لينك إن' },
  { key: 'youtube', labelEn: 'YouTube', labelAr: 'يوتيوب' },
  { key: 'tiktok', labelEn: 'TikTok', labelAr: 'تيك توك' },
  { key: 'whatsapp', labelEn: 'WhatsApp', labelAr: 'واتساب' },
];

type CMSFormValues = {
  phone: string;
  email: string;
  address: string;
  workingTime: string;
  socialMedia: Partial<Record<SocialMediaKey, string>>;
  about_company: {
    ourVision: string;
    ourMission: string;
    ourValues: string;
  };
  companyGellert: {
    images: string[];
    videos: TCompanyGalleryVideo[];
  };
  privacyPolicy: string;
  termsOfUse: string;
};

// Privacy Policy Editor Component
const PrivacyPolicyEditor = ({
  control,
  language,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  language: 'en' | 'ar';
}) => {
  return (
    <Controller
      name="privacyPolicy"
      control={control}
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
            height: '300px',
            placeholder: language === 'ar' ? 'أدخل المحتوى هنا...' : 'Enter content here...',
          }}
        />
      )}
    />
  );
};

// Terms of Use Editor Component
const TermsOfUseEditor = ({
  control,
  language,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  language: 'en' | 'ar';
}) => {
  return (
    <Controller
      name="termsOfUse"
      control={control}
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
            height: '300px',
            placeholder: language === 'ar' ? 'أدخل المحتوى هنا...' : 'Enter content here...',
          }}
        />
      )}
    />
  );
};

const CmsDashboardPage = ({ language }: CmsDashboardPageProps) => {
  const isArabic = language === 'ar';
  const [addedSocialMedia, setAddedSocialMedia] = useState<SocialMediaKey[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [galleryVideos, setGalleryVideos] = useState<TCompanyGalleryVideo[]>([]);
  const [newVideoType, setNewVideoType] = useState<'embed' | 'link'>('embed');
  const [newVideoValue, setNewVideoValue] = useState('');

  const { data, isLoading } = useFetchCMS(true);
  const updateCMSMutation = useCreateOrUpdateCMS();

  const form = useForm<CMSFormValues>({
    defaultValues: {
      phone: '',
      email: '',
      address: '',
      workingTime: '',
      socialMedia: {},
      about_company: {
        ourVision: '',
        ourMission: '',
        ourValues: '',
      },
      companyGellert: {
        images: [],
        videos: [],
      },
      privacyPolicy: '',
      termsOfUse: '',
    },
    mode: 'onSubmit',
  });

  const { register, handleSubmit, reset, watch, setValue, control, formState: { isSubmitting } } = form;

  useEffect(() => {
    if (data?.data) {
      const contact = data.data.contact as TCMSContact & Record<string, string>;
      const socialMediaFields = SOCIAL_MEDIA_OPTIONS.filter(
        (sm) => contact[sm.key]
      ).map((sm) => sm.key as SocialMediaKey);

      setAddedSocialMedia(socialMediaFields);
      const cmsImages = Array.isArray(data.data.companyGellert?.images)
        ? data.data.companyGellert.images.filter((item) => typeof item === 'string')
        : [];
      const cmsVideos = Array.isArray(data.data.companyGellert?.videos)
        ? data.data.companyGellert.videos.filter(
          (item) => item && (item.type === 'embed' || item.type === 'link') && typeof item.value === 'string',
        )
        : [];

      setGalleryImages(cmsImages);
      setGalleryVideos(cmsVideos);

      reset({
        phone: contact.phone || '',
        email: contact.email || '',
        address: contact.address || '',
        workingTime: contact.workingTime || '',
        socialMedia: Object.fromEntries(
          socialMediaFields.map((key) => [key, contact[key] || ''])
        ),
        about_company: {
          ourVision: data.data.about_company?.ourVision || '',
          ourMission: data.data.about_company?.ourMission || '',
          ourValues: data.data.about_company?.ourValues || '',
        },
        companyGellert: {
          images: cmsImages,
          videos: cmsVideos,
        },
        privacyPolicy: data.data.privacyPolicy || '',
        termsOfUse: data.data.termsOfUse || '',
      });
    }
  }, [data, reset]);

  const watchSocialMedia = watch('socialMedia');

  const convertToYouTubeEmbedUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return '';

    const youtubeWatchMatch = trimmed.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (youtubeWatchMatch?.[1]) {
      return `https://www.youtube.com/embed/${youtubeWatchMatch[1]}`;
    }

    const youtuBeMatch = trimmed.match(/youtu\.be\/([^?&]+)/);
    if (youtuBeMatch?.[1]) {
      return `https://www.youtube.com/embed/${youtuBeMatch[1]}`;
    }

    if (trimmed.includes('youtube.com/embed/')) return trimmed;
    return '';
  };

  const handleAddSocialMedia = (key: SocialMediaKey) => {
    setAddedSocialMedia((prev) => [...prev, key]);
    setValue(`socialMedia.${key}`, '');
  };

  const handleRemoveSocialMedia = (key: SocialMediaKey) => {
    setAddedSocialMedia((prev) => prev.filter((k) => k !== key));
    setValue(`socialMedia.${key}`, '');
  };

  const handleAddImageUrl = () => {
    const value = newImageUrl.trim();
    if (!value) return;
    if (galleryImages.includes(value)) return;
    setGalleryImages((prev) => [...prev, value]);
    setNewImageUrl('');
  };

  const handleRemoveImageUrl = (url: string) => {
    setGalleryImages((prev) => prev.filter((item) => item !== url));
  };

  const handleAddVideo = () => {
    const value = newVideoValue.trim();
    if (!value) return;
    setGalleryVideos((prev) => [...prev, { type: newVideoType, value }]);
    setNewVideoValue('');
  };

  const handleRemoveVideo = (index: number) => {
    setGalleryVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<CMSFormValues> = async (values) => {
    const contact: TCMSContact & Record<string, string> = {
      phone: values.phone.trim(),
      email: values.email.trim(),
      address: values.address.trim(),
      workingTime: values.workingTime.trim(),
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      tiktok: '',
      whatsapp: '',
    };

    addedSocialMedia.forEach((key) => {
      contact[key] = (values.socialMedia?.[key] || '').trim();
    });

    await updateCMSMutation.mutateAsync({
      contact,
      about_company: {
        ourVision: values.about_company.ourVision.trim(),
        ourMission: values.about_company.ourMission.trim(),
        ourValues: values.about_company.ourValues.trim(),
      },
      companyGellert: {
        images: galleryImages,
        videos: galleryVideos,
      },
      privacyPolicy: values.privacyPolicy.trim(),
      termsOfUse: values.termsOfUse.trim(),
    });
  };

  const availableSocialMedia = useMemo(
    () =>
      SOCIAL_MEDIA_OPTIONS.filter(
        (sm) => !addedSocialMedia.includes(sm.key)
      ),
    [addedSocialMedia]
  );

  if (isLoading && !data) {
    return <DashboardPageLoader />;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {isArabic ? 'إدارة المحتوى' : 'CMS Management'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isArabic
            ? 'إدارة معلومات التواصل، وسائل التواصل الاجتماعي، والسياسات.'
            : 'Manage contact information, social media, and policies.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'معلومات التواصل' : 'Contact Information'}</CardTitle>
            <CardDescription>
              {isArabic
                ? 'أضف معلومات التواصل الأساسية للموقع.'
                : 'Add basic contact information for the website.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{isArabic ? 'الهاتف' : 'Phone'}</Label>
                <Input
                  {...register('phone', { required: true })}
                  placeholder="+8801700000000"
                />
              </div>
              <div className="space-y-2">
                <Label>{isArabic ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input
                  type="email"
                  {...register('email', { required: true })}
                  placeholder="support@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{isArabic ? 'العنوان' : 'Address'}</Label>
              <Input
                {...register('address', { required: true })}
                placeholder={isArabic ? 'أدخل العنوان' : 'Enter address'}
              />
            </div>

            <div className="space-y-2">
              <Label>{isArabic ? 'أوقات العمل' : 'Working Time'}</Label>
              <Input
                {...register('workingTime')}
                placeholder={isArabic ? 'مثال: الأحد - الخميس: 9:00 صباحاً - 5:00 مساءً' : 'e.g., Sunday - Thursday: 9:00 AM - 5:00 PM'}
              />
            </div>
          </CardContent>
        </Card>

        {/* About Company */}
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'نبذة عن الشركة' : 'About Company'}</CardTitle>
            <CardDescription>
              {isArabic
                ? 'أدخل الرؤية والرسالة والقيم لصفحة حول الشركة.'
                : 'Add vision, mission, and values for your about company content.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{isArabic ? 'رؤيتنا' : 'Our Vision'}</Label>
              <Input {...register('about_company.ourVision')} placeholder={isArabic ? 'أدخل رؤية الشركة' : 'Enter company vision'} />
            </div>
            <div className="space-y-2">
              <Label>{isArabic ? 'رسالتنا' : 'Our Mission'}</Label>
              <Input {...register('about_company.ourMission')} placeholder={isArabic ? 'أدخل رسالة الشركة' : 'Enter company mission'} />
            </div>
            <div className="space-y-2">
              <Label>{isArabic ? 'قيمنا' : 'Our Values'}</Label>
              <Input {...register('about_company.ourValues')} placeholder={isArabic ? 'أدخل قيم الشركة' : 'Enter company values'} />
            </div>
          </CardContent>
        </Card>

        {/* Company Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'معرض الشركة' : 'Company Gallery'}</CardTitle>
            <CardDescription>
              {isArabic
                ? 'أضف روابط الصور وأكواد تضمين الفيديو أو روابط الفيديو.'
                : 'Add image URLs and either YouTube embed code or video links.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>{isArabic ? 'صور المعرض (روابط)' : 'Gallery Images (URLs)'}</Label>
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button type="button" variant="outline" onClick={handleAddImageUrl}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {galleryImages.length ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryImages.map((url) => (
                    <div key={url} className="rounded-lg border border-border p-2">
                      <img
                        src={url}
                        alt="gallery"
                        className="h-24 w-full rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <p className="mt-2 truncate text-xs text-muted-foreground" title={url}>{url}</p>
                      <Button type="button" variant="destructive" size="sm" className="mt-2 w-full" onClick={() => handleRemoveImageUrl(url)}>
                        <X className="mr-1 h-4 w-4" />
                        {isArabic ? 'حذف' : 'Remove'}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{isArabic ? 'لا توجد صور مضافة.' : 'No gallery images added.'}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label>{isArabic ? 'فيديوهات المعرض' : 'Gallery Videos'}</Label>
              <div className="grid gap-2 sm:grid-cols-[160px_1fr_auto]">
                <Select value={newVideoType} onValueChange={(value: 'embed' | 'link') => setNewVideoType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="embed">{isArabic ? 'كود تضمين' : 'Embed Code'}</SelectItem>
                    <SelectItem value="link">{isArabic ? 'رابط فيديو' : 'Video Link'}</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={newVideoValue}
                  onChange={(e) => setNewVideoValue(e.target.value)}
                  placeholder={
                    newVideoType === 'embed'
                      ? '<iframe ...></iframe>'
                      : 'https://youtube.com/watch?v=...'
                  }
                />
                <Button type="button" variant="outline" onClick={handleAddVideo}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {galleryVideos.length ? (
                <div className="space-y-3">
                  {galleryVideos.map((video, index) => {
                    const convertedLink = video.type === 'link' ? convertToYouTubeEmbedUrl(video.value) : '';
                    return (
                      <div key={`${video.type}-${video.value}-${index}`} className="rounded-lg border border-border p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Youtube className="h-4 w-4" />
                            {video.type === 'embed'
                              ? (isArabic ? 'كود تضمين' : 'Embed Code')
                              : (isArabic ? 'رابط فيديو' : 'Video Link')}
                          </div>
                          <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveVideo(index)}>
                            <X className="mr-1 h-4 w-4" />
                            {isArabic ? 'حذف' : 'Remove'}
                          </Button>
                        </div>

                        {video.type === 'embed' ? (
                          <div className="overflow-hidden rounded-md border border-border" dangerouslySetInnerHTML={{ __html: video.value }} />
                        ) : convertedLink ? (
                          <div className="aspect-video overflow-hidden rounded-md border border-border">
                            <iframe
                              src={convertedLink}
                              className="h-full w-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={`gallery-video-${index}`}
                            />
                          </div>
                        ) : (
                          <a
                            href={video.value}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-primary underline break-all"
                          >
                            {video.value}
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{isArabic ? 'لا توجد فيديوهات مضافة.' : 'No videos added yet.'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'وسائل التواصل الاجتماعي' : 'Social Media'}</CardTitle>
            <CardDescription>
              {isArabic ? 'أضف روابط وسائل التواصل الاجتماعي.' : 'Add your social media links.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {addedSocialMedia.length > 0 && (
              <div className="space-y-3">
                {addedSocialMedia.map((key) => {
                  const sm = SOCIAL_MEDIA_OPTIONS.find((s) => s.key === key);
                  return (
                    <div key={key} className="flex items-end gap-2">
                      <div className="flex-1 space-y-2">
                        <Label>{isArabic ? sm?.labelAr : sm?.labelEn}</Label>
                        <Input
                          {...register(`socialMedia.${key}`)}
                          placeholder={`https://${key}.com/...`}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => handleRemoveSocialMedia(key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {availableSocialMedia.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableSocialMedia.map((sm) => (
                  <Button
                    key={sm.key}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSocialMedia(sm.key)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    {isArabic ? sm.labelAr : sm.labelEn}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}</CardTitle>
            <CardDescription>
              {isArabic
                ? 'أدخل نص سياسة الخصوصية بصيغة HTML.'
                : 'Enter your privacy policy in HTML format.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PrivacyPolicyEditor control={control} language={language} />
          </CardContent>
        </Card>

        {/* Terms of Use */}
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'شروط الاستخدام' : 'Terms of Use'}</CardTitle>
            <CardDescription>
              {isArabic ? 'أدخل نص شروط الاستخدام بصيغة HTML.' : 'Enter your terms of use in HTML format.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TermsOfUseEditor control={control} language={language} />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={isSubmitting || updateCMSMutation.isPending}
            className="min-w-[150px]"
          >
            {isSubmitting || updateCMSMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isArabic ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : isArabic ? (
              'حفظ التغييرات'
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CmsDashboardPage;
