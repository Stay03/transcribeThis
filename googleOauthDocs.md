# Google OAuth API Documentation

## Overview
This API provides Google OAuth authentication integration, allowing users to sign up and log in using their Google accounts. The implementation works alongside existing email/password authentication.

## Environment Setup
Ensure these environment variables are configured:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret  
GOOGLE_REDIRECT_URI=https://apimagic.website/transcribeThis/api/auth/google/callback
FRONTEND_URL=https://your-frontend-domain.com
```

## API Endpoints

### 1. Get Google OAuth Redirect URL
**Endpoint:** `GET /api/auth/google/redirect`

**Description:** Returns the Google OAuth authorization URL for frontend redirection.

**Response:**
```json
{
  "redirect_url": "https://accounts.google.com/oauth/authorize?client_id=..."
}
```

**Frontend Usage:**
```javascript
// Get OAuth URL
const response = await fetch('/api/auth/google/redirect');
const { redirect_url } = await response.json();

// Redirect user to Google OAuth
window.location.href = redirect_url;
```

### 2. Google OAuth Callback
**Endpoint:** `GET /api/auth/google/callback`

**Description:** Handles the OAuth callback from Google. This endpoint processes the authorization code and either returns JSON (for API calls) or redirects to the frontend (for browser requests).

**Browser Requests (Default):**
- **Success:** Redirects to `{FRONTEND_URL}/auth/success?token={token}&user={base64_encoded_user_data}`
- **Error:** Redirects to `{FRONTEND_URL}/auth/error?message={error_message}&error={error_details}`

**API Requests (with Accept: application/json header):**
- **Success Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://lh3.googleusercontent.com/...",
    "google_id": "1234567890",
    "role": "user",
    "created_at": "2025-06-20T00:55:42.000000Z",
    "updated_at": "2025-06-20T00:55:42.000000Z"
  },
  "token": "1|abc123def456...",
  "token_type": "Bearer"
}
```

- **Error Response:**
```json
{
  "success": false,
  "message": "Authentication failed",
  "error": "Error details..."
}
```

## Integration Flow

### Frontend Implementation Example

```javascript
class GoogleAuth {
  async initiateLogin() {
    try {
      // Step 1: Get Google OAuth URL
      const response = await fetch('/api/auth/google/redirect');
      const { redirect_url } = await response.json();
      
      // Step 2: Redirect to Google
      window.location.href = redirect_url;
    } catch (error) {
      console.error('Failed to initiate Google login:', error);
    }
  }
  
  // Handle the success callback (create this route in your frontend)
  handleAuthSuccess() {
    // This runs on your frontend /auth/success page
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userData = urlParams.get('user');
    
    if (token && userData) {
      // Store token
      localStorage.setItem('auth_token', token);
      
      // Decode user data
      const user = JSON.parse(atob(userData));
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to dashboard or main app
      window.location.href = '/dashboard';
    }
  }
  
  // Handle the error callback (create this route in your frontend)
  handleAuthError() {
    // This runs on your frontend /auth/error page
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const error = urlParams.get('error');
    
    console.error('OAuth Error:', message, error);
    // Show error to user and redirect to login
    alert('Authentication failed: ' + message);
    window.location.href = '/login';
  }
}
```

### Alternative: Direct Redirect Method
**Endpoint:** `GET /api/auth/google`

**Description:** Directly redirects to Google OAuth (302 redirect response).

**Frontend Usage:**
```javascript
// Direct redirect approach
window.location.href = '/api/auth/google';
```

## Authentication Token Usage

After successful OAuth login, use the returned token for authenticated API requests:

```javascript
// Store token
localStorage.setItem('auth_token', token);

// Use token in API requests
const response = await fetch('/api/some-protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## User Account Behavior

- **New Users:** Automatically creates account with Google profile data
- **Existing Users (same email):** Links Google account to existing user
- **Returning OAuth Users:** Updates profile data from Google and authenticates
- **Email Verification:** Google OAuth users are automatically verified

## Error Handling

Common error scenarios:
- Invalid OAuth state/code
- Google API errors  
- Network connectivity issues
- Missing environment configuration

Always handle errors gracefully and provide fallback to email/password login.

## Frontend Routes Required

Your frontend application needs these routes:

1. **`/auth/success`** - Handles successful OAuth redirects
   - Extracts token and user data from URL parameters
   - Stores authentication data
   - Redirects to main application

2. **`/auth/error`** - Handles failed OAuth redirects
   - Shows error message to user
   - Redirects back to login page

## Testing

For development, ensure your Google OAuth app is configured with:
- Authorized redirect URIs including your local development URL
- Proper scopes (email, profile, openid)
- Test users added if in development mode
- `FRONTEND_URL` environment variable set to your frontend domain