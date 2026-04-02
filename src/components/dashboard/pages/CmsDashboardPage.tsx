import DashboardPageLoader from '@/components/dashboard/DashboardPageLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateOrUpdateCMS, useFetchCMS, type TCMSContact } from '@/services/useCMSService';
import { FileText, Loader2, Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

interface CmsDashboardPageProps {
  language: 'en' | 'ar';
}

type SocialMediaKey = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'whatsapp';

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

  const { data, isLoading } = useFetchCMS(true);
  const updateCMSMutation = useCreateOrUpdateCMS();

  const form = useForm<CMSFormValues>({
    defaultValues: {
      phone: '',
      email: '',
      address: '',
      workingTime: '',
      socialMedia: {},
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

      reset({
        phone: contact.phone || '',
        email: contact.email || '',
        address: contact.address || '',
        workingTime: contact.workingTime || '',
        socialMedia: Object.fromEntries(
          socialMediaFields.map((key) => [key, contact[key] || ''])
        ),
        privacyPolicy: data.data.privacyPolicy || '',
        termsOfUse: data.data.termsOfUse || '',
      });
    }
  }, [data, reset]);

  const watchSocialMedia = watch('socialMedia');

  const handleAddSocialMedia = (key: SocialMediaKey) => {
    setAddedSocialMedia((prev) => [...prev, key]);
    setValue(`socialMedia.${key}`, '');
  };

  const handleRemoveSocialMedia = (key: SocialMediaKey) => {
    setAddedSocialMedia((prev) => prev.filter((k) => k !== key));
    setValue(`socialMedia.${key}`, '');
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
