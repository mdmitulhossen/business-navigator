import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePortalLogin } from '@/services/useClientPortalService';
import { StorageKeys } from '@/types/generalTypes';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PortalLogin = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const navigate = useNavigate();

  const [uniqueCode, setUniqueCode] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = usePortalLogin();

  useEffect(() => {
    const token = localStorage.getItem(StorageKeys.portalToken);
    if (token) {
      navigate('/portal/profile', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await loginMutation.mutateAsync({
      uniqueCode: uniqueCode.trim(),
      password,
    });

    if (result.success) {
      navigate('/portal/profile', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          <section className="hidden rounded-3xl bg-primary p-10 text-primary-foreground lg:block">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm">
                <ShieldCheck className="h-4 w-4" />
                {isArabic ? 'بوابة العميل' : 'Client Portal'}
              </div>
              <h1 className="text-4xl font-bold leading-tight">
                {isArabic ? 'متابعة خدماتك بسهولة ووضوح' : 'Track your services with full clarity'}
              </h1>
              <p className="text-base text-primary-foreground/90">
                {isArabic
                  ? 'شاهد حالة كل خدمة، ارفع المستندات المطلوبة، واقرأ ملاحظات الإدارة في مكان واحد.'
                  : 'See service status, upload your document links, and read admin messages in one place.'}
              </p>
            </div>
          </section>

          <Card className="border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle>{isArabic ? 'تسجيل دخول العميل' : 'Client Login'}</CardTitle>
              <CardDescription>
                {isArabic
                  ? 'استخدم الكود والرقم السري المرسل من الإدارة.'
                  : 'Use the unique code and password provided by admin.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label>{isArabic ? 'الكود المميز' : 'Unique Code'}</Label>
                  <Input
                    value={uniqueCode}
                    onChange={(e) => setUniqueCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? 'كلمة المرور' : 'Password'}</Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isArabic ? 'جارٍ تسجيل الدخول...' : 'Signing in...'}
                    </>
                  ) : isArabic ? (
                    'تسجيل الدخول'
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;
