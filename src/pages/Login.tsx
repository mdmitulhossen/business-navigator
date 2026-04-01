import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useLogin } from '@/services/authService';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await loginMutation.mutateAsync(data);

      if (!response?.success) return;

      const role = response?.data?.user?.role?.toLowerCase?.() || '';
      navigate(role === 'admin' ? '/dashboard' : '/', { replace: true });
    } catch {
      // handled inside useLogin
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/40"></div>
      <div className="w-full max-w-md space-y-8 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-8 shadow-lg relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <img
            src="/logoWithoutText.png"
            alt="Souda Investment Logo"
            className="mx-auto h-12 w-auto"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
          <h1 className="text-2xl font-bold text-foreground">Login</h1>
          <p className="text-muted-foreground">Welcome back! Please sign in to your account.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', { required: 'Email is required' })}
                className={cn(
                  'pl-10',
                  errors.email && 'border-destructive focus:border-destructive'
                )}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
                className={cn(
                  'pl-10 pr-10',
                  errors.password && 'border-destructive focus:border-destructive'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 underline"
            >
              Forgot Password?
            </Link>
          </div> */}

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center space-y-2">
          {/* <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 underline">
              Sign Up
            </Link>
          </p> */}
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
