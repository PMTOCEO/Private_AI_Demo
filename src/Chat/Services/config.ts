import { env } from './env';

export const API_CONFIG = {
  clientId: env.clientId,
  clientSecret: env.clientSecret,
  authDomain: 'hathr.auth-fips.us-gov-west-1.amazoncognito.com',
  apiBase: 'https://api.hathr.ai/v1'
};