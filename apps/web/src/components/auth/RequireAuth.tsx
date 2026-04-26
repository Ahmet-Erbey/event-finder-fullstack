import { useAuth } from '#/context/auth-context';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

type RequireAuthProps = {
  children: ReactNode;
};

/**
 * Korumalı alan: AuthContext (cookie + GET /auth/me) ile kullanıcı yoksa `/sign-in`.
 * `beforeLoad` aynı session önbelleğiyle hızlı yönlendirme yapar; bu bileşen oturum
 * düşerse veya client tarafı senkronu tamamlar.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      void navigate({ to: '/sign-in', replace: true });
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" aria-hidden />
        <p className="text-sm text-muted-foreground">Oturum kontrol ediliyor…</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}
