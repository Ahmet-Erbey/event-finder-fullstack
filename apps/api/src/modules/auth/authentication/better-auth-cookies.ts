/**
 * better-auth yanıtlarında Set-Cookie üzerinde origin / localhost için düzenleme (mevcut /auth catch-all ile aynı mantık).
 */
export function enhanceAuthResponseCookies(
  response: Response,
  originHeader: string | null,
): Response {
  if (!originHeader) {
    return response;
  }

  try {
    const originUrl = new URL(originHeader);
    const hostname = originUrl.hostname;

    const trustedOrigins = [
      process.env.APP_URL!,
      process.env.API_URL!,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ];

    const isTrustedOrigin = trustedOrigins.some((trusted) => {
      try {
        const trustedUrl = new URL(trusted);
        return trustedUrl.origin === originUrl.origin;
      } catch {
        return false;
      }
    });

    if (!isTrustedOrigin) {
      return response;
    }

    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

    let cookieDomain: string;
    if (isLocalhost) {
      cookieDomain = '';
    } else {
      const parts = hostname.split('.');
      cookieDomain = parts.length >= 2 ? parts.slice(-2).join('.') : hostname;
    }

    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders.length === 0) {
      return response;
    }

    response.headers.delete('Set-Cookie');

    for (const cookie of setCookieHeaders) {
      let modifiedCookie = cookie;

      if (cookieDomain) {
        if (cookie.includes('Domain=')) {
          modifiedCookie = modifiedCookie.replace(/Domain=[^;]+/, `Domain=${cookieDomain}`);
        } else if (cookie.includes('Path=')) {
          modifiedCookie = modifiedCookie.replace(/Path=/, `Domain=${cookieDomain}; Path=`);
        } else {
          modifiedCookie = `${modifiedCookie}; Domain=${cookieDomain}`;
        }
      } else {
        modifiedCookie = modifiedCookie.replace(/;\s*Domain=[^;]+/g, '');
      }

      if (isLocalhost) {
        modifiedCookie = modifiedCookie.replace(/;\s*Secure/gi, '');
        if (cookie.includes('SameSite=')) {
          modifiedCookie = modifiedCookie.replace(/SameSite=[^;]+/, 'SameSite=Lax');
        } else {
          modifiedCookie = `${modifiedCookie}; SameSite=Lax`;
        }
      }

      response.headers.append('Set-Cookie', modifiedCookie);
    }
  } catch (error) {
    console.error('Failed to parse origin for dynamic cookie domain:', error);
  }

  return response;
}
