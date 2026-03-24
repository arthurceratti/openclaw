/**
 * Production Configuration for Frontend
 */
const productionConfig = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'production',
  
  // API Configuration
  API_URL: process.env.API_URL || 'https://api.yourcompany.com',
  REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'https://api.yourcompany.com',
  
  // Database (for SSR/backend calls)
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/production_db',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'error',
  DEBUG: process.env.DEBUG === 'true',
  
  // Security
  SECURE_COOKIES: true,
  HTTP_ONLY: true,
  
  // Performance
  CACHE_TTL: 3600, // 1 hour in seconds
  
  // Feature flags
  ENABLE_ANALYTICS: true,
  ENABLE_ERROR_TRACKING: true,
  
  // API Keys (should be loaded from secure env vars)
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};

module.exports = productionConfig;
