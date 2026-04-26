import prisma from '@onlyjs/db';
import { RoleType } from '@onlyjs/db/enums';
import { UserFormatter } from '#modules/users/formatters';
import { UserRolesService } from '#modules/users/user-roles';
import { betterAuth } from './instance';

type SignUpResult = {
  headers: Headers;
  response: {
    token: string | null;
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      emailVerified: boolean;
    };
  };
};

/**
 * Kayıt: better-auth sign-up + emailVerified + global BASIC rol + claims yenileme.
 * Set-Cookie için returnHeaders kullanılır.
 */
export async function registerWithEmailPassword(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  requestHeaders: Headers;
}): Promise<SignUpResult> {
  const email = input.email.toLowerCase().trim();
  const name = `${input.firstName.trim()} ${input.lastName.trim()}`;

  const raw = await betterAuth.api.signUpEmail({
    body: {
      name,
      email,
      password: input.password,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
    },
    headers: input.requestHeaders,
    returnHeaders: true,
  });

  const { headers, response } = raw as SignUpResult;
  const userId = response.user.id;

  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });

  const basicRole = await prisma.role.findFirst({
    where: {
      type: RoleType.BASIC,
      organizationId: null,
      organizationType: null,
    },
  });

  if (basicRole) {
    await UserRolesService.update(userId, [basicRole.uuid], { id: userId }, undefined, null, true);
  }

  return { headers, response };
}

export async function getAuthPublicUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            select: {
              uuid: true,
              name: true,
              type: true,
              organizationType: true,
              organizationUuid: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found after registration');
  }

  const formatted = UserFormatter.response(user);
  return {
    id: formatted.id,
    email: formatted.email,
    firstName: formatted.firstName,
    lastName: formatted.lastName,
    name: formatted.name,
    emailVerified: user.emailVerified,
    image: formatted.image,
    roles: formatted.roles,
  };
}

/** better-auth yanıtına JSON + Set-Cookie birleştirme */
export function jsonResponseWithAuthCookies(
  body: unknown,
  authHeaders: Headers,
  status = 200,
): Response {
  const out = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
  const cookies = authHeaders.getSetCookie?.() ?? [];
  for (const c of cookies) {
    out.append('Set-Cookie', c);
  }
  return new Response(JSON.stringify(body), { status, headers: out });
}
