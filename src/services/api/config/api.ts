import { corsConfig } from './cors';

export const API_CONFIG = {
  baseUrl: 'https://api.consigncloud.com',
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  cors: corsConfig,
} as const;

export type ApiConfig = typeof API_CONFIG;