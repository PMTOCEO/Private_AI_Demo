import { User } from '@auth0/auth0-react';

// Convert Auth0 ID to UUID using SHA-256
export async function generateUserUuid(auth0Id: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(auth0Id);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Format as UUID (8-4-4-4-12)
  return `${hashHex.slice(0, 8)}-${hashHex.slice(8, 12)}-${hashHex.slice(12, 16)}-${hashHex.slice(16, 20)}-${hashHex.slice(20, 32)}`;
}

// Get current user's UUID
export async function getCurrentUserUuid(user: User | undefined | null): Promise<string | null> {
  if (!user?.sub) return null;
  return generateUserUuid(user.sub);
}