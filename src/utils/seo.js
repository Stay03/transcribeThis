export const SEO_CONFIG = {
  siteName: 'TranscribeThis',
  siteUrl: 'https://transcribethis.com',
  defaultTitle: 'TranscribeThis - Lightning-Fast AI Audio Transcription | 99% Accuracy',
  defaultDescription: 'Convert audio to text in seconds with our AI-powered transcription service. 99% accuracy, multiple formats (verbatim, subtitle, readable), supports MP3, WAV, M4A. Start free today!',
  defaultImage: '/android-chrome-512x512.png',
  twitterHandle: '@transcribethis',
  themeColor: '#2563eb'
}

export const PAGE_SEO = {
  home: {
    title: 'TranscribeThis - Lightning-Fast AI Audio Transcription | 99% Accuracy',
    description: 'Convert audio to text in seconds with our AI-powered transcription service. 99% accuracy, multiple formats (verbatim, subtitle, readable), supports MP3, WAV, M4A. Start free today!',
    keywords: 'audio transcription, speech to text, AI transcription, fast transcription, accurate transcription, verbatim transcription, subtitle generation, readable format'
  },
  transcribe: {
    title: 'Transcribe Audio Online - Upload & Convert to Text | TranscribeThis',
    description: 'Upload your audio file and get instant, accurate transcription. Supports multiple formats: verbatim word-for-word, subtitle timing, and readable formatting. Try free now!',
    keywords: 'upload audio transcription, convert audio to text online, instant transcription, file upload transcription, audio file converter'
  },
  dashboard: {
    title: 'Dashboard - Manage Your Transcriptions | TranscribeThis',
    description: 'View and manage all your audio transcriptions in one place. Download, edit, and organize your converted text files with our intuitive dashboard.',
    keywords: 'transcription dashboard, manage audio files, transcription history, download transcriptions'
  },
  history: {
    title: 'Transcription History - All Your Audio Files | TranscribeThis',
    description: 'Access your complete transcription history. Search, filter, and download all your converted audio files with timestamps and metadata.',
    keywords: 'transcription history, audio file history, past transcriptions, search transcriptions'
  },
  settings: {
    title: 'Account Settings - Customize Your Experience | TranscribeThis',
    description: 'Manage your TranscribeThis account settings, subscription plans, and transcription preferences. Optimize your audio-to-text workflow.',
    keywords: 'account settings, transcription settings, subscription management, user preferences'
  },
  login: {
    title: 'Login - Access Your Transcriptions | TranscribeThis',
    description: 'Sign in to your TranscribeThis account to access your audio transcriptions, manage files, and continue converting speech to text.',
    keywords: 'login transcription service, sign in audio converter, access account'
  },
  signup: {
    title: 'Sign Up Free - Start Transcribing Audio Today | TranscribeThis',
    description: 'Create your free TranscribeThis account and get 10 audio transcriptions per month. No credit card required. Start converting audio to text now!',
    keywords: 'free transcription account, sign up audio converter, create transcription account, free speech to text'
  }
}

export const TRANSCRIPTION_FORMATS = {
  verbatim: {
    name: 'Verbatim Transcription',
    description: 'Word-for-word exact transcription including filler words, pauses, and speech patterns. Perfect for legal, research, and detailed analysis.',
    keywords: 'verbatim transcription, exact word transcription, legal transcription, research transcription'
  },
  subtitle: {
    name: 'Subtitle Format',
    description: 'Time-coded transcription optimized for video subtitles and captions. Includes precise timing for seamless video integration.',
    keywords: 'subtitle transcription, video captions, time-coded transcription, subtitle generation'
  },
  readable: {
    name: 'Readable Format',
    description: 'Clean, formatted transcription with proper punctuation and paragraph breaks. Ideal for content creation, notes, and documentation.',
    keywords: 'readable transcription, clean transcription, formatted text, content transcription'
  }
}

export const SUPPORTED_FORMATS = [
  { extension: '.mp3', mime: 'audio/mpeg', description: 'MP3 audio files' },
  { extension: '.wav', mime: 'audio/wav', description: 'WAV audio files' },
  { extension: '.m4a', mime: 'audio/m4a', description: 'M4A audio files' },
  { extension: '.mp4', mime: 'audio/mp4', description: 'MP4 audio files' },
  { extension: '.webm', mime: 'audio/webm', description: 'WebM audio files' }
]

export const FEATURE_KEYWORDS = [
  'lightning fast transcription',
  '99% accuracy AI',
  'instant audio conversion',
  'multiple transcription formats',
  'professional transcription service',
  'secure audio processing',
  'bulk audio transcription',
  'real-time transcription',
  'multilingual transcription',
  'custom transcription prompts'
]

export function generateMetaTags({ title, description, keywords, image, url, type = 'website' }) {
  return {
    title: title || SEO_CONFIG.defaultTitle,
    description: description || SEO_CONFIG.defaultDescription,
    keywords: keywords || PAGE_SEO.home.keywords,
    canonical: url ? `${SEO_CONFIG.siteUrl}${url}` : SEO_CONFIG.siteUrl,
    openGraph: {
      title: title || SEO_CONFIG.defaultTitle,
      description: description || SEO_CONFIG.defaultDescription,
      image: image || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultImage}`,
      url: url ? `${SEO_CONFIG.siteUrl}${url}` : SEO_CONFIG.siteUrl,
      type,
      siteName: SEO_CONFIG.siteName
    },
    twitter: {
      card: 'summary_large_image',
      title: title || SEO_CONFIG.defaultTitle,
      description: description || SEO_CONFIG.defaultDescription,
      image: image || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultImage}`,
      creator: SEO_CONFIG.twitterHandle
    }
  }
}

export function getPageSEO(pageName) {
  return PAGE_SEO[pageName] || PAGE_SEO.home
}