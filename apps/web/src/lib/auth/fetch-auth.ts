import { env } from '#/config/env';

function apiBase(): string {
  const base = env.apiUrl;
  if (!base) {
    throw new Error('VITE_API_URL tanımlı değil');
  }
  return base.replace(/\/$/, '');
}

async function parseJsonBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}

function messageFromUnknown(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>;
    if (typeof o.message === 'string' && o.message) return o.message;
    if (o.error && typeof o.error === 'object') {
      const e = o.error as { message?: string };
      if (typeof e.message === 'string' && e.message) return e.message;
    }
  }
  return fallback;
}

export type SignInSuccess = {
  redirect?: boolean;
  token?: string | null;
  user: Record<string, unknown>;
};

export type SignUpSuccess = {
  token?: string | null;
  user: Record<string, unknown>;
};

/**
 * Cookie + session: token yanıtı frontend'de saklanmaz; yalnızca Set-Cookie kullanılır.
 */
export async function signInWithEmail(input: {
  email: string;
  password: string;
}): Promise<SignInSuccess> {
  const res = await fetch(`${apiBase()}/auth/sign-in/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    }),
  });

  const data = (await parseJsonBody(res)) as SignInSuccess | null;

  if (!res.ok) {
    const msg = messageFromUnknown(
      data,
      res.status === 401 ? 'E-posta veya şifre hatalı' : 'Giriş başarısız',
    );
    throw new Error(msg);
  }

  if (!data?.user) {
    throw new Error('Beklenmeyen yanıt');
  }

  return data;
}

/**
 * better-auth: name zorunlu; firstName/lastName ek alan.
 */
export async function signUpWithEmail(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<SignUpSuccess> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const name = `${firstName} ${lastName}`.trim() || 'User';

  const res = await fetch(`${apiBase()}/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      name,
      firstName,
      lastName,
      email: input.email.trim().toLowerCase(),
      password: input.password,
    }),
  });

  const data = (await parseJsonBody(res)) as SignUpSuccess | null;

  if (!res.ok) {
    const msg = messageFromUnknown(
      data,
      res.status === 422
        ? 'Girdi doğrulama hatası'
        : 'Kayıt başarısız. Bu e-posta kullanımda olabilir.',
    );
    throw new Error(msg);
  }

  if (!data?.user) {
    throw new Error('Beklenmeyen yanıt');
  }

  return data;
}
