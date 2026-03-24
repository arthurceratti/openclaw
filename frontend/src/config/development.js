/**
 * Development Configuration for Frontend
 */
const developmentConfig = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API Configuration (local development)
  API_URL: process.env.API_URL || 'http://localhost:8080',
  REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  
  // Database (for SSR/backend calls)
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/dev_db',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  DEBUG: process.env.DEBUG === 'true',
  
  // Security (relaxed for development)
  SECURE_COOKIES: false,
  HTTP_ONLY: false,
  
  // Performance (relaxed for development)
  CACHE_TTL: 0, // No caching in development
  
  // Feature flags
  ENABLE_ANALYTICS: false,
  ENABLE_ERROR_TRACKING: true,
  
  // API Keys (local development)
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};

module.exports = developmentConfig;
