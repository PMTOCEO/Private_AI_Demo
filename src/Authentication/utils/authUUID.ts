import { User } from '@auth0/auth0-react';

// Get current user's UUID from Auth0 user.sub
export async function getCurrentUserUuid(user: User | undefined | null): Promise<string | null> {
  return user?.sub || null;
}
