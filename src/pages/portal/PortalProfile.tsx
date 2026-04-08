import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    type TPortalService,
    useFetchPortalProfile,
    usePortalLogout,
    useUpdateMyPortalDocuments,
} from '@/services/useClientPortalService';
import { StorageKeys } from '@/types/generalTypes';
import {
    ArrowUpRight,
    Building2,
    CheckCircle2,
    Clock3,
    ExternalLink,
    FileText,
    Globe,
    Loader2,
    LogOut,
    Plus,
    UploadCloud,
    User
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

  const C = {
    site: 'https://www.soudasa.com/',
    n800: '#0A1628',
    n700: '#223451',
    n600: '#35507A',
    n400: '#9CB2D1',
    nWash: '#EEF4FF',
  };

  const BrandLogo = () => (
    <a href={C.site} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: C.n700 }}>
        <Building2 className="h-4 w-4 text-white" />
      </div>
      <div className="leading-none">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">SAUDA</p>
        <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Georgia', serif" }}>
          Investment Consultant
        </p>
      </div>
    </a>
  );

const PortalProfile = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const navigate = useNavigate();

  const { data, isLoading } = useFetchPortalProfile(true);
  const logoutMutation = usePortalLogout();
  const updateDocsMutation = useUpdateMyPortalDocuments();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [documentInput, setDocumentInput] = useState('');

  const profile = data?.data;
  const services = useMemo(() => profile?.services ?? [], [profile?.services]);

  const selectedService = useMemo(
    () => services.find((item) => item.id === selectedServiceId),
    [services, selectedServiceId],
  );

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    localStorage.removeItem(StorageKeys.portalToken);
    localStorage.removeItem(StorageKeys.portalUser);
    navigate('/portal/login', { replace: true });
  };

  const handleAddDocument = async () => {
    if (!selectedService) return;

    const value = documentInput.trim();
    if (!value) return;

    const nextDocuments = Array.from(new Set([...(selectedService.customerDocuments || []), value]));

    await updateDocsMutation.mutateAsync({
      serviceId: selectedService.id,
      documents: nextDocuments,
    });

    setDocumentInput('');
  };

  const handleRemoveDocument = async (service: TPortalService, url: string) => {
    const nextDocuments = (service.customerDocuments || []).filter((item) => item !== url);
    await updateDocsMutation.mutateAsync({
      serviceId: service.id,
      documents: nextDocuments,
    });
  };

  const getStatusStyle = (status: TPortalService['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/30';
      default:
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
    }
  };

  const toExternalUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return '#';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
  };

  const totalServices = services.length;
  const completedServices = services.filter((s) => s.status === 'COMPLETED').length;
  const inProgressServices = services.filter((s) => s.status === 'IN_PROGRESS').length;
  const totalCustomerDocs = services.reduce((sum, service) => sum + service.customerDocuments.length, 0);

  if (isLoading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-white/90 backdrop-blur-xl dark:bg-[#0A1628]/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2.5 rounded-full border border-border/60 bg-slate-50 py-1.5 pl-2 pr-4 dark:bg-white/5 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: C.nWash }}>
                <User className="h-3.5 w-3.5" style={{ color: C.n700 }} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-semibold text-foreground">{profile?.name}</span>
                <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">{profile?.uniqueCode}</span>
              </div>
            </div>

            <Button asChild size="sm" variant="secondary" className="h-9 gap-2 border border-border/60 px-4 text-sm font-medium">
              <a href={C.site} target="_blank" rel="noreferrer">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{isArabic ? 'الموقع الرسمي' : 'Website'}</span>
              </a>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="h-9 gap-2 border-border/60 px-4 text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
            >
              {logoutMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              <span className="hidden sm:inline">{isArabic ? 'تسجيل الخروج' : 'Logout'}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden border-b border-border/40" style={{ background: C.n800 }}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg,transparent,transparent 40px,white 40px,white 41px)' }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: C.n400 }}>
                {isArabic ? 'مرحباً بك في البوابة الإلكترونية' : 'Welcome to your client portal'}
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ fontFamily: "'Georgia','Times New Roman',serif" }}>
                {profile?.name}
              </h1>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-sm text-white/60">{isArabic ? 'كود العميل:' : 'Client code:'}</span>
                <code className="rounded-lg px-2.5 py-1 font-mono text-sm font-semibold text-white" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  {profile?.uniqueCode}
                </code>
              </div>
            </div>

            <a
              href={C.site}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-max items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              <Building2 className="h-3.5 w-3.5 opacity-80" />
              {isArabic ? 'زيارة الموقع الرسمي' : 'Visit our website'}
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-border/60 bg-card/95 shadow-none">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs text-muted-foreground">{isArabic ? 'إجمالي الخدمات' : 'Total Services'}</p>
                <p className="text-xl font-bold">{totalServices}</p>
              </div>
              <Clock3 className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/95 shadow-none">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs text-muted-foreground">{isArabic ? 'مكتملة' : 'Completed'}</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{completedServices}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/95 shadow-none">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs text-muted-foreground">{isArabic ? 'قيد التنفيذ' : 'In Progress'}</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{inProgressServices}</p>
              </div>
              <Clock3 className="h-5 w-5 text-blue-500" />
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/95 shadow-none">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs text-muted-foreground">{isArabic ? 'مستنداتك المرفوعة' : 'Your Uploaded Docs'}</p>
                <p className="text-xl font-bold">{totalCustomerDocs}</p>
              </div>
              <UploadCloud className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/70 px-4 py-3">
              <div>
                <h2 className="text-base font-semibold text-foreground sm:text-lg">
                  {isArabic ? 'خدماتي الحالية' : 'My Active Services'}
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {isArabic
                    ? 'حالة كل خدمة، مستندات الإدارة، ورسائل المتابعة في مكان واحد.'
                    : 'Track each service status, admin documents, and follow-up messages in one place.'}
                </p>
              </div>
            </div>

            {services.length ? (
              services.map((service) => (
                <Card key={service.id} className="border-border/70 shadow-sm">
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CardTitle className="text-base leading-6">{service.serviceName}</CardTitle>
                      <Badge variant="outline" className={getStatusStyle(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {isArabic ? 'آخر تحديث:' : 'Updated:'} {new Date(service.updatedAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{isArabic ? 'مستندات الإدارة' : 'Admin Documents'}</p>
                        {service.adminDocuments.length ? (
                          <div className="space-y-2">
                            {service.adminDocuments.map((url) => (
                              <a
                                key={url}
                                href={toExternalUrl(url)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex w-full items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-xs text-primary hover:bg-muted/40"
                              >
                                <span className="inline-flex items-center gap-2 truncate">
                                  <FileText className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{url}</span>
                                </span>
                                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
                            {isArabic ? 'لا توجد مستندات' : 'No documents yet'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">{isArabic ? 'مستنداتك' : 'Your Documents'}</p>
                        {service.customerDocuments.length ? (
                          <div className="space-y-2">
                            {service.customerDocuments.map((url) => (
                              <div key={url} className="flex items-center gap-2 rounded-md border border-border px-2 py-2">
                                <a
                                  href={toExternalUrl(url)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex min-w-0 flex-1 items-center gap-2 text-xs text-primary underline"
                                >
                                  <UploadCloud className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{url}</span>
                                </a>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRemoveDocument(service, url)}
                                  disabled={updateDocsMutation.isPending}
                                >
                                  {isArabic ? 'حذف' : 'Remove'}
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
                            {isArabic ? 'لا توجد مستندات مرفوعة' : 'No uploaded documents'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">{isArabic ? 'رسالة الإدارة' : 'Admin Message'}</p>
                      <div className="min-h-16 rounded-lg border bg-muted/30 p-3 text-sm text-foreground">
                        {service.comment || (isArabic ? 'لا توجد رسالة بعد' : 'No message yet')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-border/70">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  {isArabic ? 'لا توجد خدمات مرتبطة بحسابك حالياً.' : 'No services are assigned to your account yet.'}
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="h-fit border-border/70 shadow-sm xl:sticky xl:top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-primary" />
                {isArabic ? 'رفع مستند جديد' : 'Upload New Document Link'}
              </CardTitle>
              <CardDescription>
                {isArabic
                  ? 'اختر الخدمة ثم أضف رابط المستند. سيتم فتح الروابط في صفحة جديدة.'
                  : 'Select a service and add document URL. Links open in a new tab.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>{isArabic ? 'الخدمة' : 'Service'}</Label>
                <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? 'اختر الخدمة' : 'Select service'} />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.serviceName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{isArabic ? 'رابط المستند' : 'Document URL'}</Label>
                <Input
                  value={documentInput}
                  onChange={(e) => setDocumentInput(e.target.value)}
                  placeholder="https://example.com/document.pdf"
                />
              </div>

              <Button
                onClick={handleAddDocument}
                disabled={!selectedServiceId || !documentInput.trim() || updateDocsMutation.isPending}
                className="w-full"
              >
                {updateDocsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span className="ml-2">{isArabic ? 'إضافة المستند' : 'Add Document'}</span>
              </Button>
            </CardContent>
          </Card>
        </section>

        <footer className="border-t border-border/50 pt-8 pb-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: C.n700 }}>
                <Building2 className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Georgia',serif" }}>
                Sauda Investment Consultant
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a
                href={C.site}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-foreground"
                style={{ color: C.n600 }}
              >
                {isArabic ? 'الموقع الرسمي' : 'Official website'}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <span className="text-border">·</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default PortalProfile;
