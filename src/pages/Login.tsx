import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useAuthStore, AUTH_CREDENTIALS } from '../stores/authStore';
import { toast } from 'sonner';

const loginSchema = z.object({
  loginId: z.string().min(1, 'ログインIDを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
});

const registerSchema = z.object({
  loginId: z.string()
    .min(4, 'ログインIDは4文字以上である必要があります')
    .regex(/^[a-zA-Z0-9_-]+$/, 'ログインIDは半角英数字、ハイフン、アンダースコアのみ使用できます'),
  password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
  name: z.string().min(1, '名前を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, users } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // Check credentials
      const correctPassword = AUTH_CREDENTIALS[data.loginId as keyof typeof AUTH_CREDENTIALS];
      if (!correctPassword || correctPassword !== data.password) {
        throw new Error('ログインIDまたはパスワードが正しくありません');
      }

      // Find user
      const user = Object.values(users).find(u => u.loginId === data.loginId);
      if (!user) {
        throw new Error('ユーザーが見つかりません');
      }

      login(user);
      toast.success('ログインしました');
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      // Check if loginId already exists
      if (Object.values(users).some(u => u.loginId === data.loginId)) {
        throw new Error('このログインIDは既に使用されています');
      }

      // Create new user
      const newUser = {
        id: data.loginId,
        loginId: data.loginId,
        name: data.name,
        email: data.email,
        role: 'worker' as const,
        points: 0,
        status: 'active' as const,
        joinedAt: new Date().toISOString(),
        totalEarned: 0,
      };

      // Update AUTH_CREDENTIALS (Note: In a real app, this would be handled by a backend)
      (AUTH_CREDENTIALS as any)[data.loginId] = data.password;

      login(newUser);
      toast.success('アカウントを作成しました');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <TrendingUp className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          pointmoney
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ポイント管理システム
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isRegistering ? (
            <form className="space-y-6" onSubmit={registerForm.handleSubmit(onRegister)}>
              <div>
                <label htmlFor="name" className="form-label">
                  名前
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    type="text"
                    {...registerForm.register('name')}
                    className="form-input"
                  />
                  {registerForm.formState.errors.name && (
                    <p className="form-error">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  メールアドレス
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    {...registerForm.register('email')}
                    className="form-input"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="form-error">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="register-loginId" className="form-label">
                  ログインID
                </label>
                <div className="mt-1">
                  <input
                    id="register-loginId"
                    type="text"
                    {...registerForm.register('loginId')}
                    className="form-input"
                  />
                  {registerForm.formState.errors.loginId && (
                    <p className="form-error">{registerForm.formState.errors.loginId.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="form-label">
                  パスワード
                </label>
                <div className="mt-1">
                  <input
                    id="register-password"
                    type="password"
                    {...registerForm.register('password')}
                    className="form-input"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="form-error">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary"
                >
                  {isLoading ? '登録中...' : 'アカウントを作成'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  ログインに戻る
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={loginForm.handleSubmit(onLogin)}>
              <div>
                <label htmlFor="loginId" className="form-label">
                  ログインID
                </label>
                <div className="mt-1">
                  <input
                    id="loginId"
                    type="text"
                    {...loginForm.register('loginId')}
                    className="form-input"
                  />
                  {loginForm.formState.errors.loginId && (
                    <p className="form-error">{loginForm.formState.errors.loginId.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  パスワード
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    {...loginForm.register('password')}
                    className="form-input"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="form-error">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary"
                >
                  {isLoading ? 'ログイン中...' : 'ログイン'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  新規アカウントを作成
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}