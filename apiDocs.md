# PowerTranscriber API Documentation

A comprehensive guide for React frontend developers to integrate with the PowerTranscriber API.

## Base URL
```
http://localhost:8000/api
```

## Authentication

All authenticated endpoints require an `Authorization` header with a Bearer token:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Response Format

All API responses follow this structure:
```javascript
// Success Response
{
  "message": "Success message",
  "data": { ... }, // Response data
  // Additional fields specific to endpoint
}

// Error Response  
{
  "error": "Error message",
  "messages": { ... } // Validation errors (if applicable)
}
```

---

## 🔐 Authentication Endpoints

### Register User
```javascript
POST /auth/register

// Request Body
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "password_confirmation": "password123"
}

// Response (201)
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe", 
    "email": "john@example.com",
    "role": "user"
  },
  "access_token": "1|abc123...",
  "token_type": "Bearer"
}
```

### Login User
```javascript
POST /auth/login

// Request Body
{
  "email": "john@example.com",
  "password": "password123"
}

// Response (200)
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com", 
    "role": "user"
  },
  "access_token": "1|abc123...",
  "token_type": "Bearer"
}
```

### Logout User
```javascript
POST /auth/logout
// Requires: Authorization header

// Response (200)
{
  "message": "Logged out successfully"
}
```

### Get User Profile
```javascript
GET /auth/profile
// Requires: Authorization header

// Response (200)
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000000Z"
  },
  "current_plan": {
    "id": 1,
    "name": "Free",
    "slug": "free",
    "limits": {
      "max_file_size_mb": 10,
      "monthly_transcriptions": 10,
      "total_prompts": 50
    }
  }
}
```

---

## 🎵 Transcription Endpoints

### Upload & Transcribe Audio
```javascript
POST /transcribe
// Requires: Authorization header
// Content-Type: multipart/form-data

// FormData
const formData = new FormData();
formData.append('audio_file', audioFile); // File object
formData.append('prompt', 'Transcribe this meeting'); // Optional

// Response (200)
{
  "message": "Transcription completed successfully",
  "transcription": {
    "id": 1,
    "original_filename": "meeting.mp3",
    "file_size_mb": 5.2,
    "prompt": "Transcribe this meeting",
    "transcription_result": "Hello, welcome to today's meeting...",
    "status": "completed",
    "processing_time": 12.34,
    "created_at": "2024-01-01T00:00:00.000000Z"
  },
  "usage_info": {
    "plan": {
      "name": "Free",
      "slug": "free"
    },
    "current_usage": {
      "transcriptions_used": 1,
      "prompts_used": 1,
      "total_file_size_mb": 5
    },
    "limits": {
      "monthly_transcriptions": 10,
      "total_prompts": 50,
      "max_file_size_mb": 10
    },
    "remaining": {
      "transcriptions": 9,
      "prompts": 49,
      "percentage_used": {
        "transcriptions": 10.0,
        "prompts": 2.0
      }
    }
  }
}

// Error Response (400/429)
{
  "error": "Monthly transcription limit reached (10)",
  "usage_info": { ... }
}
```

### Get User Transcriptions
```javascript
GET /transcriptions?page=1&per_page=15
// Requires: Authorization header

// Response (200)
{
  "transcriptions": [
    {
      "id": 1,
      "original_filename": "meeting.mp3",
      "file_size_mb": 5.2,
      "prompt": "Transcribe this meeting",
      "transcription_result": "Hello, welcome...",
      "status": "completed",
      "processing_time": 12.34,
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 25,
    "last_page": 2,
    "from": 1,
    "to": 15
  }
}
```

### Get Specific Transcription
```javascript
GET /transcriptions/{id}
// Requires: Authorization header

// Response (200)
{
  "transcription": {
    "id": 1,
    "original_filename": "meeting.mp3",
    "file_size_mb": 5.2,
    "prompt": "Transcribe this meeting",
    "transcription_result": "Hello, welcome to today's meeting...",
    "status": "completed",
    "error_message": null,
    "processing_time": 12.34,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:05:00.000000Z"
  }
}
```

### Delete Transcription
```javascript
DELETE /transcriptions/{id}
// Requires: Authorization header

// Response (200)
{
  "message": "Transcription deleted successfully"
}

// Error Response (404)
{
  "error": "Transcription not found"
}
```

---

## 💳 Subscription Endpoints

### Get Available Plans
```javascript
GET /plans

// Response (200)
{
  "plans": [
    {
      "id": 1,
      "name": "Free",
      "slug": "free",
      "description": "Perfect for getting started",
      "price": 0.00,
      "limits": {
        "max_file_size_mb": 10,
        "monthly_transcriptions": 10,
        "total_prompts": 50
      },
      "is_free": true
    },
    {
      "id": 2,
      "name": "Pro", 
      "slug": "pro",
      "description": "Ideal for professionals",
      "price": 19.99,
      "limits": {
        "max_file_size_mb": 50,
        "monthly_transcriptions": 100,
        "total_prompts": 500
      },
      "is_free": false
    }
  ]
}
```

### Subscribe to Plan
```javascript
POST /subscribe
// Requires: Authorization header

// Request Body
{
  "plan_id": 2
}

// Response (200)
{
  "message": "Successfully subscribed to plan",
  "subscription": {
    "id": 5,
    "plan": {
      "id": 2,
      "name": "Pro",
      "slug": "pro",
      "price": 19.99
    },
    "status": "active",
    "starts_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### Get Current Subscription
```javascript
GET /subscription/current
// Requires: Authorization header

// Response (200)
{
  "current_plan": {
    "id": 2,
    "name": "Pro",
    "slug": "pro", 
    "description": "Ideal for professionals",
    "price": 19.99,
    "limits": {
      "max_file_size_mb": 50,
      "monthly_transcriptions": 100,
      "total_prompts": 500
    }
  },
  "subscription": {
    "id": 5,
    "status": "active",
    "starts_at": "2024-01-01T00:00:00.000000Z",
    "ends_at": null
  }
}
```

### Get Usage Statistics
```javascript
GET 
// Requires: Authorization header

// Response (200)
{
  "usage": {
    "plan": {
      "name": "Pro",
      "slug": "pro"
    },
    "current_usage": {
      "transcriptions_used": 15,
      "prompts_used": 23,
      "total_file_size_mb": 125
    },
    "limits": {
      "monthly_transcriptions": 100,
      "total_prompts": 500,
      "max_file_size_mb": 50
    },
    "remaining": {
      "transcriptions": 85,
      "prompts": 477,
      "percentage_used": {
        "transcriptions": 15.0,
        "prompts": 4.6
      }
    }
  }
}
```

### Cancel Subscription
```javascript
POST /subscription/cancel
// Requires: Authorization header

// Response (200)
{
  "message": "Subscription cancelled successfully. You have been moved to the free plan."
}
```

### Get Subscription History
```javascript
GET /subscription/history
// Requires: Authorization header

// Response (200)
{
  "subscription_history": [
    {
      "id": 5,
      "plan": {
        "id": 2,
        "name": "Pro",
        "slug": "pro",
        "price": 19.99
      },
      "status": "active",
      "starts_at": "2024-01-01T00:00:00.000000Z",
      "ends_at": null,
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

---

## 👤 Account Management Endpoints

### Update Profile
```javascript
PUT /account/profile
// Requires: Authorization header

// Request Body (all fields optional)
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}

// Response (200)
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "role": "user",
    "updated_at": "2024-01-01T12:00:00.000000Z"
  }
}
```

### Change Password
```javascript
PUT /account/password
// Requires: Authorization header

// Request Body
{
  "current_password": "oldpassword123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}

// Response (200)
{
  "message": "Password updated successfully. Please login again."
}
```

### Delete Account
```javascript
DELETE /account
// Requires: Authorization header

// Request Body
{
  "password": "password123",
  "confirm_deletion": true
}

// Response (200)
{
  "message": "Account deleted successfully"
}
```

### Get Account Statistics
```javascript
GET /account/stats
// Requires: Authorization header

// Response (200)
{
  "account_stats": {
    "member_since": "2024-01-01T00:00:00.000000Z",
    "total_transcriptions": 25,
    "completed_transcriptions": 23,
    "failed_transcriptions": 2,
    "total_processing_time": 425.67,
    "average_processing_time": 18.51,
    "current_plan": {
      "name": "Pro",
      "slug": "pro"
    },
    "total_api_tokens": 2
  }
}
```

---

## 👑 Admin Endpoints

All admin endpoints require admin role and are prefixed with `/admin`.

### Dashboard Overview
```javascript
GET /admin/dashboard/overview
// Requires: Authorization header + Admin role

// Response (200)
{
  "overview": {
    "users": {
      "total": 150,
      "admins": 2,
      "regular_users": 148,
      "new_this_month": 23
    },
    "transcriptions": {
      "total": 1250,
      "completed": 1180,
      "failed": 45,
      "processing": 5,
      "pending": 20,
      "success_rate": 94.4,
      "average_processing_time": 15.67
    },
    "plans": {
      "total_plans": 3,
      "total_active_subscriptions": 148,
      "plans_breakdown": [
        {
          "id": 1,
          "name": "Free",
          "slug": "free",
          "price": 0,
          "active_subscriptions": 100,
          "percentage": 67.57
        }
      ]
    },
    "recent_activity": {
      "recent_users": [...],
      "recent_transcriptions": [...]
    }
  }
}
```

### System Statistics
```javascript
GET /admin/dashboard/stats?period=30
// Requires: Authorization header + Admin role

// Response (200)
{
  "stats": {
    "period_days": 30,
    "user_growth": [
      {
        "date": "2024-01-01",
        "count": 5
      }
    ],
    "transcription_volume": [
      {
        "date": "2024-01-01", 
        "count": 25,
        "avg_time": 14.5
      }
    ],
    "top_users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "transcriptions_count": 45
      }
    ],
    "summary": {
      "new_users": 23,
      "total_transcriptions": 450,
      "successful_transcriptions": 425,
      "avg_processing_time": 15.2
    }
  }
}
```

---

## 📝 React Integration Examples

### Authentication Hook
```javascript
// useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem('token', data.access_token);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
    
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const fetchProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Profile fetch failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  return { user, token, login, logout, loading };
};
```

### Transcription Upload Component
```javascript
// TranscriptionUpload.jsx
import { useState } from 'react';
import { useAuth } from './useAuth';

export const TranscriptionUpload = () => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('audio_file', file);
    if (prompt) formData.append('prompt', prompt);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data.transcription);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".mp3,.mp4,.wav,.m4a,.webm"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Optional prompt..."
        maxLength={1000}
      />
      
      <button type="submit" disabled={loading || !file}>
        {loading ? 'Transcribing...' : 'Upload & Transcribe'}
      </button>

      {result && (
        <div>
          <h3>Transcription Result:</h3>
          <p>{result.transcription_result}</p>
          <small>Processing time: {result.processing_time}s</small>
        </div>
      )}
    </form>
  );
};
```

### Usage Statistics Component
```javascript
// UsageStats.jsx
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const UsageStats = () => {
  const { token } = useAuth();
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/subscription/usage', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsage(data.usage);
        }
      } catch (error) {
        console.error('Failed to fetch usage:', error);
      }
    };

    if (token) fetchUsage();
  }, [token]);

  if (!usage) return <div>Loading...</div>;

  return (
    <div className="usage-stats">
      <h3>Current Plan: {usage.plan.name}</h3>
      
      <div className="usage-item">
        <span>Transcriptions:</span>
        <span>{usage.current_usage.transcriptions_used} / {usage.limits.monthly_transcriptions}</span>
        <div className="progress-bar">
          <div 
            style={{ width: `${usage.remaining.percentage_used.transcriptions}%` }}
            className="progress-fill"
          />
        </div>
      </div>

      <div className="usage-item">
        <span>Prompts:</span>
        <span>{usage.current_usage.prompts_used} / {usage.limits.total_prompts}</span>
        <div className="progress-bar">
          <div 
            style={{ width: `${usage.remaining.percentage_used.prompts}%` }}
            className="progress-fill"
          />
        </div>
      </div>

      <div className="usage-item">
        <span>Max File Size:</span>
        <span>{usage.limits.max_file_size_mb}MB per file</span>
      </div>
    </div>
  );
};
```

---

## 🚨 Error Handling

### Common HTTP Status Codes
- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests (rate limit/usage limit)
- `500` - Server Error

### Error Response Handling
```javascript
const handleApiResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    switch (response.status) {
      case 401:
        // Redirect to login
        logout();
        break;
      case 403:
        // Show access denied message
        showError('Access denied');
        break;
      case 422:
        // Show validation errors
        showValidationErrors(data.messages);
        break;
      case 429:
        // Show rate limit message with usage info
        showUsageLimitError(data.error, data.usage_info);
        break;
      default:
        showError(data.error || 'Something went wrong');
    }
    return null;
  }
  
  return data;
};
```

---

## 📋 File Upload Requirements

### Supported Formats
- **Audio**: MP3, MP4, MPEG, MPGA, M4A, WAV, WEBM
- **Max Size**: Depends on user's plan (10MB/50MB/100MB)

### File Validation
```javascript
const validateAudioFile = (file, maxSizeMB) => {
  const allowedTypes = [
    'audio/mpeg', 'audio/mp4', 'audio/wav', 
    'audio/x-m4a', 'audio/webm'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported file format' };
  }
  
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return { 
      valid: false, 
      error: `File size (${fileSizeMB.toFixed(1)}MB) exceeds limit (${maxSizeMB}MB)` 
    };
  }
  
  return { valid: true };
};
```

---

## 🔒 Security Best Practices

1. **Store tokens securely** - Use httpOnly cookies in production
2. **Handle token expiration** - Implement refresh logic or re-login
3. **Validate file uploads** - Check file type and size client-side
4. **Sanitize user input** - Escape HTML in transcription results
5. **Use HTTPS** - Always use HTTPS in production
6. **Rate limiting** - Respect API rate limits and usage quotas

---

This documentation provides everything needed to build a complete React frontend for the PowerTranscriber API. Each endpoint includes request/response examples and practical React integration patterns.