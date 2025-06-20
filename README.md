# TranscribeThis - AI-Powered Transcription SaaS

A professional React application for AI-powered audio transcription with a modern SaaS interface.

## 🚀 Features

### Core Functionality
- **AI Audio Transcription**: Convert audio files to text with high accuracy
- **Multiple Format Support**: MP3, MP4, WAV, M4A, WEBM
- **Custom Prompts**: Enhance transcription accuracy with specific instructions
- **Real-time Processing**: Fast transcription with progress tracking

### SaaS Features
- **Professional Landing Page**: Modern startup-style hero section and pricing
- **User Authentication**: Secure signup/login with JWT tokens
- **Subscription Management**: Free and Pro plans with usage tracking
- **Usage Dashboard**: Monitor transcription limits and account statistics
- **Transcription History**: View, search, and manage all past transcriptions

### Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI/UX**: Built with Tailwind CSS and Shadcn/ui components
- **Error Handling**: Comprehensive error states and user feedback
- **File Validation**: Client-side validation for file types and sizes
- **Progress Tracking**: Real-time upload and processing status

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4, Shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **API**: REST API integration with JWT authentication
- **State Management**: React Context API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd transcribeThis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Shadcn/ui)
│   ├── Navbar.jsx       # Navigation component
│   └── LoadingSpinner.jsx
├── contexts/
│   └── AuthContext.jsx  # Authentication state management
├── hooks/
│   └── useTranscriptions.js # Custom hook for transcription management
├── pages/
│   ├── LandingPage.jsx  # Public landing page
│   ├── LoginPage.jsx    # User authentication
│   ├── SignupPage.jsx   # User registration
│   ├── DashboardPage.jsx # User dashboard
│   ├── TranscribePage.jsx # Main transcription interface
│   ├── HistoryPage.jsx  # Transcription history
│   └── SettingsPage.jsx # Account and subscription settings
├── services/
│   └── api.js          # API service layer
├── utils/
│   ├── fileValidation.js # File validation utilities
│   └── dateFormat.js   # Date formatting utilities
├── constants/
│   └── config.js       # Application configuration
├── lib/
│   └── utils.js        # Utility functions
└── App.jsx             # Main application component
```

## 🔧 Configuration

### API Configuration
Update the API base URL in `src/constants/config.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api', // Update to your API URL
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
}
```

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=TranscribeThis
```

## 📱 Features Overview

### Landing Page
- Hero section with clear value proposition
- Feature highlights with professional design
- Pricing comparison table
- Social proof and testimonials
- Responsive design optimized for conversions

### Authentication
- Secure user registration and login
- JWT token-based authentication
- Protected routes with automatic redirects
- Session management with token refresh

### Transcription Interface
- Drag-and-drop file upload
- Real-time file validation
- Custom prompt support
- Progress tracking during processing
- Instant results with copy/download options

### Dashboard
- Usage statistics and plan limits
- Recent transcription activity
- Quick action cards
- Account overview and tips

### History Management
- Paginated transcription list
- Search and filter functionality
- Detailed view modal
- Bulk actions (copy, download, delete)

### Settings & Subscription
- Profile management
- Password change
- Plan comparison and upgrades
- Usage monitoring
- Subscription management

## 🔒 Security Features

- JWT token authentication
- Secure API communication
- Client-side input validation
- Protected routes
- Session management
- Error boundary handling

## 📊 API Integration

The application integrates with the PowerTranscriber API providing:

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

### Transcription Endpoints
- `POST /transcribe` - Upload and transcribe audio
- `GET /transcriptions` - Get user transcriptions
- `GET /transcriptions/{id}` - Get specific transcription
- `DELETE /transcriptions/{id}` - Delete transcription

### Subscription Endpoints
- `GET /plans` - Get available plans
- `POST /subscribe` - Subscribe to plan
- `GET /subscription/current` - Get current subscription
- `GET /subscription/usage` - Get usage statistics

## 🎨 Design System

Built with a consistent design system featuring:

- **Colors**: Professional color palette with dark mode support
- **Typography**: Clear hierarchy with readable fonts
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Components**: Reusable UI components from Shadcn/ui
- **Icons**: Lucide React icons throughout the interface
- **Animations**: Subtle animations and transitions

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet support**: Enhanced layout for tablet screens
- **Desktop optimization**: Full-featured desktop experience
- **Touch-friendly**: Large touch targets and smooth interactions

## 🚀 Performance Optimizations

- **Code splitting**: Lazy loading of route components
- **Image optimization**: Optimized assets and loading
- **Bundle optimization**: Tree shaking and minification
- **Caching**: Strategic caching of API responses

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style

- ESLint configuration for consistent code style
- Prettier integration for code formatting
- Component-based architecture
- Custom hooks for reusable logic

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.