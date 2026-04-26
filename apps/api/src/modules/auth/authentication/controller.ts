import { MethodNotAllowedException } from '#utils/http-errors.ts';
import type { OrganizationType } from '@onlyjs/db/enums';
import { type Context, Elysia } from 'elysia';
import { UserFormatter } from '../../users';
import { OrganizationsService } from '../authorization/organizations/service';
import { enhanceAuthResponseCookies } from './better-auth-cookies';
import {
  authLoginDto,
  authLogoutDto,
  authMeDto,
  authRegisterDto,
} from './dtos';
import {
  getAuthPublicUser,
  jsonResponseWithAuthCookies,
  registerWithEmailPassword,
} from './credentials.service';
import { betterAuth } from './instance';
import { auth, authSwagger } from './plugin';

const app = new Elysia({
  prefix: '/auth',
  detail: {
    tags: ['Authentication'],
  },
})
  .post(
    '/register',
    async ({ request, body }) => {
      const { headers, response } = await registerWithEmailPassword({
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        requestHeaders: request.headers,
      });
      const user = await getAuthPublicUser(response.user.id);
      const res = jsonResponseWithAuthCookies({ user, token: response.token }, headers);
      return enhanceAuthResponseCookies(res, request.headers.get('origin')) as unknown as {
        user: Awaited<ReturnType<typeof getAuthPublicUser>>;
        token: string | null;
      };
    },
    authRegisterDto,
  )
  .post(
    '/login',
    async ({ request, body }) => {
      const target = new URL('/auth/sign-in/email', request.url);
      const forward = new Request(target.href, {
        method: 'POST',
        headers: new Headers({
          ...Object.fromEntries(
            [...request.headers.entries()].filter(([k]) => k.toLowerCase() !== 'content-length'),
          ),
          'content-type': 'application/json',
        }),
        body: JSON.stringify({
          email: body.email.trim().toLowerCase(),
          password: body.password,
        }),
      });
      let response = await betterAuth.handler(forward);
      if (!response.ok && !response.headers.get('Content-Type')) {
        response.headers.set('Content-Type', 'application/json');
      }
      return enhanceAuthResponseCookies(response, request.headers.get('origin')) as unknown as {
        redirect: boolean;
        token: string;
        user: Record<string, unknown>;
      };
    },
    authLoginDto,
  )
  .post(
    '/logout',
    async ({ request }) => {
      const target = new URL('/auth/sign-out', request.url);
      const forward = new Request(target.href, {
        method: 'POST',
        headers: request.headers,
      });
      const response = await betterAuth.handler(forward);
      return enhanceAuthResponseCookies(response, request.headers.get('origin')) as unknown as {
        success: boolean;
      };
    },
    authLogoutDto,
  )
  .guard(authSwagger, (app) =>
    app.use(auth()).get(
      '/me',
      async ({ user }) => {
        const claims = user.claims as {
          global: string[];
          organizations: Record<string, Record<string, string[]>>;
        } | null;

        const allRoles =
          (user.roles as Array<{
            uuid: string;
            organizationType?: OrganizationType;
            organizationUuid?: string;
          }>) || [];

        const globalRoles = allRoles.filter(
          (role) => !role.organizationType && !role.organizationUuid,
        );

        const organizationMemberships = await OrganizationsService.getCurrentUserMemberships(
          user.id,
        );

        const userResponse = UserFormatter.response(user);
        return {
          ...userResponse,
          claims: {
            global: claims?.global ?? [],
            organizations: claims?.organizations ?? {},
          },
          globalRoles: globalRoles.map((role) => ({ uuid: role.uuid })),
          organizationMemberships,
        };
      },
      authMeDto,
    ),
  )
  .all('*', async (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ['POST', 'GET'];
    if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
      const response = await betterAuth.handler(context.request);

      if (!response.ok) {
        if (!response.headers.get('Content-Type')) {
          response.headers.set('Content-Type', 'application/json');
        }
      }

      return enhanceAuthResponseCookies(response, context.request.headers.get('origin'));
    }
    throw new MethodNotAllowedException();
  });

export default app;
