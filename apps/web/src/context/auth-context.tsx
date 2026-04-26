import { api } from '#lib/api';
import type { AuthMeResponse } from '#types/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';

export const SESSION_QUERY_KEY = ['session'] as const;

type MeResponse = Awaited<ReturnType<typeof api.auth.me.get>>;

type AuthContextValue = {
  /** GET /auth/me cevabındaki kullanıcı (cookie session) */
  user: AuthMeResponse | null;
  isAuthenticated: boolean;
  /** İlk oturum yüklenirken (cookie ile /auth/me) */
  isLoading: boolean;
  /** Yenileme sürüyor */
  isFetching: boolean;
  /** Kullanıcıyı tekrar çek; login/logout formları genelde aynı `['session']` key ile invalidate yeter */
  refetchUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchCurrentUser(): Promise<MeResponse | null> {
  try {
    return await api.auth.me.get();
  } catch {
    return null;
  }
}

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Cookie tabanlı oturum: `api` (treaty) `credentials: 'include` kullanır; JWT yok.
 * `queryKey` route loader’larla aynı — tek React Query önbelleği.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const { data, isPending, isFetching } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const user = data?.data ?? null;

  const refetchUser = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: [...SESSION_QUERY_KEY] });
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user != null,
      isLoading: isPending,
      isFetching,
      refetchUser,
    }),
    [user, isPending, isFetching, refetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth yalnızca AuthProvider içinde kullanılabilir');
  }
  return ctx;
}

export function useAuthOptional(): AuthContextValue | null {
  return useContext(AuthContext);
}
