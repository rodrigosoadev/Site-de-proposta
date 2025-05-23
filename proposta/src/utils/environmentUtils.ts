
/**
 * Environment utilities for handling production vs development settings
 */

// Determine if we're in a production environment
export const isProduction = (): boolean => {
  return window.location.hostname !== 'localhost' && 
         window.location.hostname !== '127.0.0.1';
};

// Get the base URL for the current environment
export const getBaseUrl = (): string => {
  if (isProduction()) {
    return 'https://elegant-biz-proposals.vercel.app';
  }
  return `${window.location.protocol}//${window.location.host}`;
};

// Get the appropriate redirect URL for authentication
export const getAuthRedirectUrl = (): string => {
  return `${getBaseUrl()}/dashboard`;
};
