import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';
import { useLogin } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { StorageKeys } from '@/types/generalTypes';
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

interface AdminLoginForm {
  email: string;
  password: string;
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setToken = useAuthStore((s) => s.setToken);
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginForm>();

  const isAlreadyLoggedIn = Boolean(localStorage.getItem(StorageKeys.token));

  if (isAlreadyLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: AdminLoginForm) => {
    try {
      const response = await loginMutation.mutateAsync(data);

      if (!response?.success) {
        return;
      }

      const role = response?.data?.user?.role?.toLowerCase?.() || '';
      if (role !== 'admin') {
        setToken(null);
        toast.error('Only admin can access dashboard');
        return;
      }

      localStorage.setItem(StorageKeys.adminToken, response?.data?.accessToken || 'dashboard-admin-auth');

      const redirectPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch {
      // toast/errors handled in useLogin
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-4 py-8"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-primary/45" />

      <div className="relative z-10 w-full max-w-md space-y-7 rounded-2xl border border-border bg-card/95 p-8 shadow-xl backdrop-blur-sm">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Sign in to access the dashboard panel.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                {...register('email', { required: 'Email is required' })}
                className="pl-10"
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin password"
                {...register('password', { required: 'Password is required' })}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In as Admin'
            )}
          </Button>
        </form>

        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground underline hover:text-foreground">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
