function requireEnvVar(name: string): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  clientId: requireEnvVar('VITE_HATHR_CLIENT_ID'),
  clientSecret: requireEnvVar('VITE_HATHR_CLIENT_SECRET'),
  apiBase: import.meta.env.VITE_API_BASE || 'https://api.hathr.ai/v1',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;