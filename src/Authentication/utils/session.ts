import { Session } from '@supabase/supabase-js';
import { AuthSession } from '../types/auth';

export function isValidSession(session: Session | null): session is Session {
  if (!session) return false;
  
  const expiresAt = session.expires_at;
  if (typeof expiresAt !== 'number') return false;
  
  return expiresAt > Date.now() / 1000;
}

export function createAuthSession(session: Session | null): AuthSession {
  return {
    session,
    expiresAt: session?.expires_at ?? null,
    lastRefreshed: Date.now()
  };
}

export function getTimeUntilExpiry(session: Session | null): number | null {
  if (!session?.expires_at) return null;
  return Math.max(0, session.expires_at - Math.floor(Date.now() / 1000));
}
