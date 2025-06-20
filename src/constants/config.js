// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3
}

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE_FREE: 10, // MB
  MAX_SIZE_PRO: 50, // MB
  MAX_SIZE_ENTERPRISE: 100, // MB
  SUPPORTED_FORMATS: [
    'audio/mpeg',
    'audio/mp3',
    'audio/mp4', 
    'audio/wav',
    'audio/x-m4a',
    'audio/m4a',
    'audio/webm'
  ],
  SUPPORTED_EXTENSIONS: ['.mp3', '.mp4', '.wav', '.m4a', '.webm']
}

// Plan Limits
export const PLAN_LIMITS = {
  FREE: {
    MONTHLY_TRANSCRIPTIONS: 10,
    TOTAL_PROMPTS: 50,
    MAX_FILE_SIZE_MB: 10
  },
  PRO: {
    MONTHLY_TRANSCRIPTIONS: 100,
    TOTAL_PROMPTS: 500,
    MAX_FILE_SIZE_MB: 50
  },
  ENTERPRISE: {
    MONTHLY_TRANSCRIPTIONS: 1000,
    TOTAL_PROMPTS: 5000,
    MAX_FILE_SIZE_MB: 100
  }
}

// UI Constants
export const UI_CONFIG = {
  ITEMS_PER_PAGE: 10,
  SEARCH_DEBOUNCE: 300,
  NOTIFICATION_DURATION: 4000,
  ANIMATION_DURATION: 200
}

// Status Types
export const TRANSCRIPTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing', 
  COMPLETED: 'completed',
  FAILED: 'failed'
}

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  PENDING: 'pending'
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  FILE_TOO_LARGE: 'File size exceeds the limit for your plan.',
  UNSUPPORTED_FORMAT: 'File format not supported. Please use MP3, WAV, M4A, or WEBM.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
}