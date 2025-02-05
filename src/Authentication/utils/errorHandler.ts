import { AuthError, AuthErrorType } from '../types/auth';

export function createAuthError(type: AuthErrorType, message: string, originalError?: Error): AuthError {
  return {
    type,
    message,
    originalError,
    timestamp: Date.now()
  };
}

export function logAuthError(error: AuthError): void {
  console.error(`Auth Error [${error.type}]:`, {
    message: error.message,
    originalError: error.originalError,
    timestamp: error.timestamp
  });
}
