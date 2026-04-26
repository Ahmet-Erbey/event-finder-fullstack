import type { ControllerHook } from '#utils';
import { errorResponseDto } from '#utils';
import { t } from 'elysia';
import { passwordValidation } from '../../users/field-validations';
import { userResponseSchema } from '../../users/dtos';

/**
 * Claims schema - user permissions grouped by scope
 */
export const claimsSchema = t.Object({
  global: t.Array(t.String(), {
    description: 'Global permissions (system-wide)',
  }),
  organizations: t.Record(
    t.String(),
    t.Record(t.String(), t.Array(t.String())),
    {
      description: 'Organization-scoped permissions: { organizationType: { organizationUuid: [permissions] } }',
    },
  ),
});

/**
 * Global role schema (minimal info)
 */
export const globalRoleSchema = t.Object({
  uuid: t.String(),
});

/**
 * Organization membership summary schema
 * Shows user's membership in a specific organization
 */
export const organizationMembershipSummarySchema = t.Object({
  organization: t.Object({
    type: t.String({
      description: 'Organization type (e.g., company)',
    }),
    uuid: t.String({
      description: 'Organization UUID',
    }),
    name: t.String({
      description: 'Organization name',
    }),
    logoSrc: t.Union([t.String(), t.Null()], {
      description: 'Organization logo URL',
    }),
  }),
  isAdmin: t.Boolean({
    description: 'Whether user has at least one ADMIN type role in this organization',
  }),
  isOwner: t.Boolean({
    description: 'Whether user is the owner of this organization',
  }),
  joinedAt: t.Date({
    description: 'When user joined this organization',
  }),
  membershipUpdatedAt: t.Date({
    description: 'When membership was last updated',
  }),
  roles: t.Array(
    t.Object({
      uuid: t.String(),
      name: t.String(),
      type: t.String(),
      order: t.Number(),
    }),
    {
      description: 'Roles assigned to user in this organization',
    },
  ),
});

/**
 * User membership cache schema (organization-agnostic)
 * Extends user response with claims and organization memberships
 */
const authMeResponseSchema = t.Composite([
  userResponseSchema,
  t.Object({
    claims: claimsSchema,
    globalRoles: t.Array(globalRoleSchema, {
      description: 'Global roles (no organization context)',
    }),
    organizationMemberships: t.Array(organizationMembershipSummarySchema, {
      description: 'All organization memberships across all organization types',
    }),
  }),
]);

/**
 * GET /auth/me
 * Get current user with permissions and organization memberships
 */
export const authMeDto = {
  response: {
    200: authMeResponseSchema,
  },
  detail: {
    summary: 'Me (Current User)',
    description:
      'Returns current user with permissions, roles, and all organization memberships (across all organization types)',
  },
} satisfies ControllerHook;

/** Kayıt sonrası dönen kullanıcı (createdAt/updatedAt yok) */
export const authPublicUserDto = t.Object({
  id: t.String(),
  email: t.String(),
  firstName: t.String(),
  lastName: t.String(),
  name: t.String(),
  emailVerified: t.Boolean(),
  image: t.Optional(t.Union([t.String(), t.Null()])),
  roles: t.Array(
    t.Object({
      uuid: t.String(),
      name: t.String(),
      type: t.String(),
      organizationType: t.Union([t.String(), t.Null()]),
      organizationUuid: t.Union([t.String(), t.Null()]),
    }),
  ),
});

export const authRegisterBodyDto = t.Object({
  email: t.String({ format: 'email' }),
  password: passwordValidation,
  firstName: t.String({ minLength: 1, maxLength: 128 }),
  lastName: t.String({ minLength: 1, maxLength: 128 }),
});

export const authRegisterResponseDto = t.Object({
  user: authPublicUserDto,
  token: t.Union([t.String(), t.Null()], {
    description: 'Oturum token (better-auth); cookie ile birlikte kullanılabilir',
  }),
});

export const authLoginBodyDto = t.Object({
  email: t.String(),
  password: t.String({ minLength: 1 }),
});

export const authRegisterDto = {
  body: authRegisterBodyDto,
  response: {
    200: authRegisterResponseDto,
    401: errorResponseDto[401],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Register',
    description:
      'E-posta/şifre ile kayıt. User + Account (hash) + global BASIC rol + emailVerified. Set-Cookie ile oturum (autoSignIn).',
  },
} satisfies ControllerHook;

export const authLoginDto = {
  body: authLoginBodyDto,
  response: {
    200: t.Object(
      {
        redirect: t.Boolean(),
        token: t.String(),
        user: t.Object({}, { additionalProperties: true }),
      },
      { additionalProperties: true },
    ),
    401: errorResponseDto[401],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Login',
    description: 'E-posta/şifre ile giriş. Oturum cookie olarak döner (mevcut better-auth akışı).',
  },
} satisfies ControllerHook;

export const authLogoutDto = {
  response: {
    200: t.Object({ success: t.Boolean() }),
    401: errorResponseDto[401],
  },
  detail: {
    summary: 'Logout',
    description: 'Oturumu sonlandırır; session silinir, cookie temizlenir.',
  },
} satisfies ControllerHook;

