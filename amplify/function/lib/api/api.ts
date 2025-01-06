export const corsConfig = {
  allowedOrigins: ['*'], // Allow all origins in development
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400, // 24 hours
  credentials: false, // Set to false for third-party APIs
};


export const API_CONFIG = {
  baseUrl: 'https://api.consigncloud.com/api',
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  cors: corsConfig,
  apiKey: process.env.API_KEY,
  configuration: process.env.CONFIGURATION ? JSON.parse(process.env.CONFIGURATION) : {},

} as const;

export type ApiConfig = typeof API_CONFIG;

export interface SimpleResponse {
  statusCode: number;
  body: string;
}