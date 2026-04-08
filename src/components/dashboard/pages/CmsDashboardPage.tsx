import DashboardPageLoader from '@/components/dashboard/DashboardPageLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateOrUpdateCMS,
  useCreateTrustedPartner,
  useDeleteTrustedPartner,
  useFetchCMS,
  useUpdateTrustedPartner,
  type SocialMediaKey,
  type TCMSContact,
  type TCMSPackage,
  type TCompanyGalleryVideo,
  type TTrustedPartner,
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
  trustedPartners: TTrustedPartner[];
  packages: TCMSPackage[];
  privacyPolicy: string;
  termsOfUse: string;
};

const DEFAULT_PACKAGES: TCMSPackage[] = [
  {
    id: 'pkg-1m',
    title: 'Starter Plan',
    subTitle: '1 Month',
    duration: '1 month',
    priceSar: 1500,
    descriptions: ['Professional consultation support', 'Basic package access'],
  },
  {
    id: 'pkg-3m',
    title: 'Growth Plan',
    subTitle: '3 Months',
    duration: '3 month',
    priceSar: 4000,
    descriptions: ['Priority consultation sessions', 'Dedicated follow-up guidance'],
  },
  {
    id: 'pkg-6m',
    title: 'Professional Plan',
    subTitle: '6 Months',
    duration: '6 month',
    priceSar: 7500,
    descriptions: ['Extended business advisory', 'Multi-phase execution support'],
  },
  {
    id: 'pkg-12m',
    title: 'Enterprise Plan',
    subTitle: '12 Months',
    duration: '12 month',
    priceSar: 10000,
    descriptions: ['Long-term strategic partnership', 'End-to-end premium assistance'],
  },
];

const normalizeCmsPackages = (value: unknown): TCMSPackage[] => {
  if (!Array.isArray(value)) return DEFAULT_PACKAGES;

  const normalized = value
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const source = item as Partial<TCMSPackage>;
      return {
        id: typeof source.id === 'string' && source.id.trim() ? source.id.trim() : `pkg-${index + 1}`,
        title: typeof source.title === 'string' ? source.title : '',
        subTitle: typeof source.subTitle === 'string' ? source.subTitle : '',
        duration: typeof source.duration === 'string' ? source.duration : '',
        priceSar:
          typeof source.priceSar === 'number' && Number.isFinite(source.priceSar)
            ? source.priceSar
            : 0,
        descriptions: Array.isArray(source.descriptions)
          ? source.descriptions.filter((line): line is string => typeof line === 'string')
          : [],
      };
    });

  if (!normalized.length) return DEFAULT_PACKAGES;
  return normalized.slice(0, 4);
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
  const [trustedPartners, setTrustedPartners] = useState<TTrustedPartner[]>([]);
  const [newPartnerImageUrl, setNewPartnerImageUrl] = useState('');
  const [partnerDrafts, setPartnerDrafts] = useState<Record<string, string>>({});
  const [packageList, setPackageList] = useState<TCMSPackage[]>(DEFAULT_PACKAGES);

  const { data, isLoading } = useFetchCMS(true);
  const updateCMSMutation = useCreateOrUpdateCMS();
  const createTrustedPartnerMutation = useCreateTrustedPartner();
  const updateTrustedPartnerMutation = useUpdateTrustedPartner();
  const deleteTrustedPartnerMutation = useDeleteTrustedPartner();

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
      trustedPartners: [],
      packages: DEFAULT_PACKAGES,
      privacyPolicy: '',
      termsOfUse: '',
    },
    mode: 'onSubmit',
  });

  const { register, handleSubmit, reset, setValue, control, formState: { isSubmitting } } = form;

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

      const cmsPartners = Array.isArray(data.data.trustedPartners)
        ? data.data.trustedPartners.filter(
            (item) => item && typeof item.imageUrl === 'string'
          )
        : [];
      const cmsPackages = normalizeCmsPackages(data.data.packages);

      setTrustedPartners(cmsPartners);
      setPackageList(cmsPackages);
      setPartnerDrafts(
        Object.fromEntries(
          cmsPartners
            .filter((item) => item.id)
            .map((item) => [item.id as string, item.imageUrl])
        )
      );
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
        trustedPartners: cmsPartners,
        packages: cmsPackages,
        privacyPolicy: data.data.privacyPolicy || '',
        termsOfUse: data.data.termsOfUse || '',
      });
    }
  }, [data, reset]);

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

  const handleAddPartner = async () => {
    const value = newPartnerImageUrl.trim();
    if (!value) return;

    const result = await createTrustedPartnerMutation.mutateAsync({ imageUrl: value });
    setTrustedPartners(result.data.trustedPartners);
    setPartnerDrafts(
      Object.fromEntries(
        result.data.trustedPartners
          .filter((item) => item.id)
          .map((item) => [item.id as string, item.imageUrl])
      )
    );
    setNewPartnerImageUrl('');
  };

  const handlePartnerDraftChange = (partnerId: string, value: string) => {
    setPartnerDrafts((prev) => ({ ...prev, [partnerId]: value }));
  };

  const handleUpdatePartner = async (partnerId: string) => {
    const imageUrl = partnerDrafts[partnerId]?.trim();
    if (!imageUrl) return;

    const result = await updateTrustedPartnerMutation.mutateAsync({ partnerId, imageUrl });
    setTrustedPartners(result.data.trustedPartners);
    setPartnerDrafts(
      Object.fromEntries(
        result.data.trustedPartners
          .filter((item) => item.id)
          .map((item) => [item.id as string, item.imageUrl])
      )
    );
  };

  const handleRemovePartner = async (partnerId: string) => {
    const result = await deleteTrustedPartnerMutation.mutateAsync({ partnerId });
    setTrustedPartners(result.data.trustedPartners);
    setPartnerDrafts(
      Object.fromEntries(
        result.data.trustedPartners
          .filter((item) => item.id)
          .map((item) => [item.id as string, item.imageUrl])
      )
    );
  };

  const updatePackageField = (packageId: string, field: keyof TCMSPackage, value: string | number | string[]) => {
    setPackageList((prev) =>
      prev.map((item) =>
        item.id === packageId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
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
      trustedPartners,
      packages: packageList.map((item) => ({
        ...item,
        title: item.title.trim(),
        subTitle: item.subTitle.trim(),
        duration: item.duration.trim(),
        priceSar: Number.isFinite(item.priceSar) ? Number(item.priceSar) : 0,
        descriptions: item.descriptions
          .map((line) => line.trim())
          .filter(Boolean),
      })),
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
        <div className="sticky top-2 z-20 rounded-xl border border-border/70 bg-background/95 p-3 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'اختر قسمًا من التبويبات ثم اضغط حفظ.' : 'Switch tabs by section, then save once from here.'}
            </p>

            <div className="flex justify-end">
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
          </div>
        </div>

        <Tabs defaultValue="contact" className="space-y-4">
          <div className="overflow-x-auto pb-1">
            <TabsList className="h-auto min-w-max gap-1 rounded-lg bg-muted/70 p-1">
              <TabsTrigger value="contact">{isArabic ? 'التواصل' : 'Contact'}</TabsTrigger>
              <TabsTrigger value="about">{isArabic ? 'عن الشركة' : 'About'}</TabsTrigger>
              <TabsTrigger value="gallery">{isArabic ? 'المعرض' : 'Gallery'}</TabsTrigger>
              <TabsTrigger value="partners">{isArabic ? 'الشركاء' : 'Partners'}</TabsTrigger>
              <TabsTrigger value="packages">{isArabic ? 'الباقات' : 'Packages'}</TabsTrigger>
              <TabsTrigger value="social">{isArabic ? 'السوشيال' : 'Social'}</TabsTrigger>
              <TabsTrigger value="policies">{isArabic ? 'السياسات' : 'Policies'}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="contact">
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
          </TabsContent>

          <TabsContent value="about">
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
          </TabsContent>

          <TabsContent value="gallery">
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
          </TabsContent>

          <TabsContent value="partners">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'الشركاء الموثوقون' : 'Trusted Partners'}</CardTitle>
                <CardDescription>
                  {isArabic
                    ? 'أضف أو حدّث أو احذف شعارات الشركاء عبر رابط الصورة.'
                    : 'Create, update, or delete partner logos using image URLs.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newPartnerImageUrl}
                    onChange={(e) => setNewPartnerImageUrl(e.target.value)}
                    placeholder="https://example.com/partner-logo.png"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddPartner}
                    disabled={createTrustedPartnerMutation.isPending}
                  >
                    {createTrustedPartnerMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {trustedPartners.length ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {trustedPartners.map((partner, index) => (
                      <div
                        key={partner.id ?? `${partner.imageUrl}-${index}`}
                        className="rounded-lg border border-border p-3"
                      >
                        <img
                          src={partner.imageUrl}
                          alt="trusted-partner"
                          className="h-20 w-full rounded object-contain bg-secondary/30"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />

                        <div className="mt-3 flex gap-2">
                          <Input
                            value={partner.id ? partnerDrafts[partner.id] ?? partner.imageUrl : partner.imageUrl}
                            onChange={(e) => partner.id && handlePartnerDraftChange(partner.id, e.target.value)}
                            disabled={!partner.id}
                          />
                        </div>

                        <div className="mt-2 flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="flex-1"
                            onClick={() => partner.id && handleUpdatePartner(partner.id)}
                            disabled={!partner.id || updateTrustedPartnerMutation.isPending}
                          >
                            {isArabic ? 'تحديث' : 'Update'}
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => partner.id && handleRemovePartner(partner.id)}
                            disabled={!partner.id || deleteTrustedPartnerMutation.isPending}
                          >
                            {isArabic ? 'حذف' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'لا يوجد شركاء مضافون بعد.' : 'No trusted partners added yet.'}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'الباقات' : 'Packages'}</CardTitle>
                <CardDescription>
                  {isArabic
                    ? 'قم بإدارة عنوان وتفاصيل كل باقة كما ستظهر في صفحة الباقات.'
                    : 'Manage package titles, pricing, and description bullets for the packages page.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {packageList.map((pkg, index) => (
                    <div key={pkg.id} className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        {isArabic ? `الباقة ${index + 1}` : `Package ${index + 1}`}
                      </h4>

                      <div className="rounded-lg border border-border p-4 space-y-3">
                      <div className="space-y-2">
                        <Label>{isArabic ? 'العنوان' : 'Title'}</Label>
                        <Input
                          value={pkg.title}
                          onChange={(e) => updatePackageField(pkg.id, 'title', e.target.value)}
                          placeholder={isArabic ? 'عنوان الباقة' : 'Package title'}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{isArabic ? 'العنوان الفرعي' : 'Sub Title'}</Label>
                        <Input
                          value={pkg.subTitle}
                          onChange={(e) => updatePackageField(pkg.id, 'subTitle', e.target.value)}
                          placeholder={isArabic ? 'العنوان الفرعي' : 'Package subtitle'}
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>{isArabic ? 'المدة' : 'Duration'}</Label>
                          <Input
                            value={pkg.duration}
                            onChange={(e) => updatePackageField(pkg.id, 'duration', e.target.value)}
                            placeholder={isArabic ? 'مثال: 3 month' : 'e.g. 3 month'}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>{isArabic ? 'السعر (SAR)' : 'Price (SAR)'}</Label>
                          <Input
                            type="number"
                            min={0}
                            value={pkg.priceSar}
                            onChange={(e) => updatePackageField(pkg.id, 'priceSar', Number(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{isArabic ? 'الوصف (كل سطر عنصر)' : 'Descriptions (one bullet per line)'}</Label>
                        <Textarea
                          value={pkg.descriptions.join('\n')}
                          onChange={(e) => updatePackageField(pkg.id, 'descriptions', e.target.value.split('\n'))}
                          placeholder={isArabic ? 'أدخل كل نقطة في سطر منفصل' : 'Write each description line on a new row'}
                          rows={5}
                        />
                      </div>
                    </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
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
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
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
          </TabsContent>
        </Tabs>

      </form>
    </section>
  );
};

export default CmsDashboardPage;
