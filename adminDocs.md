# Admin API Documentation

## Overview

This document describes the admin API endpoints for the PowerTranscriber application. All admin endpoints require authentication with the `auth:sanctum` middleware and admin role authorization.

**Base URL**: `/api/admin`

## Authentication

All admin endpoints require:
1. Valid Sanctum token in the `Authorization: Bearer {token}` header
2. User must have `role = 'admin'`

---

## Dashboard Endpoints

### Get Dashboard Overview
**GET** `/admin/dashboard/overview`

Returns system overview statistics and recent activity.

**Response:**
```json
{
  "overview": {
    "users": {
      "total": 150,
      "admins": 2,
      "regular_users": 148,
      "new_this_month": 12
    },
    "transcriptions": {
      "total": 1250,
      "completed": 1180,
      "failed": 45,
      "processing": 25
    },
    "plans": {
      "total_plans": 3,
      "total_active_subscriptions": 140,
      "plans_breakdown": [...]
    },
    "recent_activity": {
      "recent_users": [...],
      "recent_transcriptions": [...]
    }
  }
}
```

### Get Dashboard Statistics
**GET** `/admin/dashboard/stats`

Returns detailed statistics for a specified period.

**Query Parameters:**
- `period` (optional): Number of days to analyze (default: 30)

**Response:**
```json
{
  "stats": {
    "period_days": 30,
    "user_growth": [...],
    "transcription_volume": [...],
    "top_users": [...],
    "summary": {
      "new_users": 12,
      "total_transcriptions": 89,
      "successful_transcriptions": 85,
      "avg_processing_time": 12.5
    }
  }
}
```

---

## User Management

### List Users
**GET** `/admin/users`

Get paginated list of users with filtering and search capabilities.

**Query Parameters:**
- `search` (optional): Search by name or email
- `role` (optional): Filter by role (`user` or `admin`)
- `plan` (optional): Filter by plan slug (`free`, `pro`, `max`)
- `sort_by` (optional): Sort field (default: `created_at`)
- `sort_order` (optional): Sort direction (`asc` or `desc`, default: `desc`)
- `per_page` (optional): Items per page (1-100, default: 15)
- `page` (optional): Page number

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2025-01-15T10:30:00Z",
      "current_subscription": {
        "plan": {
          "id": 2,
          "name": "Pro Plan",
          "slug": "pro"
        }
      },
      "usage": [
        {
          "month": 6,
          "year": 2025,
          "transcriptions_count": 15
        }
      ]
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 15,
    "total": 150
  }
}
```

### Get User Details
**GET** `/admin/users/{id}`

Get detailed information about a specific user.

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2025-01-15T10:30:00Z",
    "subscriptions": [...],
    "transcriptions": [...],
    "usage": [...]
  },
  "stats": {
    "total_transcriptions": 45,
    "completed_transcriptions": 42,
    "failed_transcriptions": 3,
    "current_month_usage": 8,
    "account_age_days": 156
  }
}
```

### Update User
**PUT** `/admin/users/{id}`

Update user information.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin"
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "role": "admin",
    "current_subscription": {...}
  }
}
```

### Delete User
**DELETE** `/admin/users/{id}`

Delete a user and all their data.

**Response:**
```json
{
  "message": "User deleted successfully",
  "deleted_transcriptions": 45
}
```

**Error Responses:**
- `400` - Cannot delete last admin user
- `400` - Cannot delete your own account from admin panel

### Change User Plan
**POST** `/admin/users/{id}/change-plan`

Change a user's subscription plan.

**Request Body:**
```json
{
  "plan_id": 3
}
```

**Response:**
```json
{
  "message": "User plan changed successfully",
  "subscription": {
    "id": 123,
    "user_id": 1,
    "plan_id": 3,
    "status": "active",
    "starts_at": "2025-06-20T12:00:00Z",
    "plan": {
      "id": 3,
      "name": "Max Plan",
      "slug": "max"
    }
  },
  "user": {...}
}
```

---

## Plan Management

### List Plans
**GET** `/admin/plans`

Get all plans with subscription statistics.

**Query Parameters:**
- `active` (optional): Filter by active status (`true` or `false`)
- `sort_by` (optional): Sort field (default: `price`)
- `sort_order` (optional): Sort direction (`asc` or `desc`, default: `asc`)

**Response:**
```json
{
  "plans": [
    {
      "id": 1,
      "name": "Free Plan",
      "slug": "free",
      "description": "Basic transcription features",
      "price": "0.00",
      "max_file_size_mb": 25,
      "monthly_transcriptions": 10,
      "total_prompts": 5,
      "is_active": true,
      "subscriptions_count": 45,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "stats": {
    "total_plans": 3,
    "total_active_subscriptions": 140,
    "plans_breakdown": [...]
  }
}
```

### Create Plan
**POST** `/admin/plans`

Create a new subscription plan.

**Request Body:**
```json
{
  "name": "Premium Plan",
  "slug": "premium",
  "description": "Advanced features for power users",
  "price": 29.99,
  "max_file_size_mb": 200,
  "monthly_transcriptions": 500,
  "total_prompts": 100,
  "is_active": true
}
```

**Validation Rules:**
- `name`: required, string, max 255 chars
- `slug`: required, string, lowercase alphanumeric with dashes, unique
- `description`: optional, string, max 1000 chars
- `price`: required, numeric, min 0
- `max_file_size_mb`: required, integer, 1-1000
- `monthly_transcriptions`: required, integer, min 0
- `total_prompts`: required, integer, min 0
- `is_active`: optional, boolean

**Response:**
```json
{
  "message": "Plan created successfully",
  "plan": {
    "id": 4,
    "name": "Premium Plan",
    "slug": "premium",
    ...
  }
}
```

### Get Plan Details
**GET** `/admin/plans/{id}`

Get detailed information about a specific plan.

**Response:**
```json
{
  "plan": {
    "id": 2,
    "name": "Pro Plan",
    "slug": "pro",
    "description": "Professional transcription features",
    "price": "19.99",
    "max_file_size_mb": 100,
    "monthly_transcriptions": 100,
    "total_prompts": 25,
    "is_active": true,
    "subscriptions_count": 45,
    "active_subscriptions_count": 42
  },
  "recent_subscriptions": [
    {
      "id": 123,
      "user_id": 15,
      "status": "active",
      "created_at": "2025-06-15T10:00:00Z",
      "user": {
        "id": 15,
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    }
  ]
}
```

### Update Plan
**PUT** `/admin/plans/{id}`

Update an existing plan.

**Request Body:** Same as create plan, all fields optional

**Response:**
```json
{
  "message": "Plan updated successfully",
  "plan": {
    "id": 2,
    "name": "Updated Plan Name",
    ...
  }
}
```

### Delete Plan
**DELETE** `/admin/plans/{id}`

Delete a plan.

**Response:**
```json
{
  "message": "Plan deleted successfully"
}
```

**Error Responses:**
- `400` - Cannot delete the free plan
- `400` - Cannot delete plan with active subscriptions

---

## Transcription Management

### List Transcriptions
**GET** `/admin/transcriptions`

Get paginated list of all transcriptions with filtering capabilities.

**Query Parameters:**
- `search` (optional): Search by filename or user name/email
- `status` (optional): Filter by status (`pending`, `processing`, `completed`, `failed`)
- `user_id` (optional): Filter by user ID
- `date_from` (optional): Filter by creation date from (YYYY-MM-DD)
- `date_to` (optional): Filter by creation date to (YYYY-MM-DD)
- `sort_by` (optional): Sort field (default: `created_at`)
- `sort_order` (optional): Sort direction (`asc` or `desc`, default: `desc`)
- `per_page` (optional): Items per page (1-100, default: 20)
- `page` (optional): Page number

**Response:**
```json
{
  "transcriptions": [
    {
      "id": 123,
      "user_id": 15,
      "original_filename": "meeting-recording.mp3",
      "status": "completed",
      "file_size": 5242880,
      "processing_time": 15.5,
      "created_at": "2025-06-20T10:30:00Z",
      "user": {
        "id": 15,
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 25,
    "per_page": 20,
    "total": 500
  },
  "stats": {
    "total_transcriptions": 1250,
    "completed_today": 45,
    "failed_today": 2,
    "processing_count": 8,
    "avg_processing_time": 12.3,
    "total_file_size_mb": 2048.5
  }
}
```

### Get Transcription Details
**GET** `/admin/transcriptions/{id}`

Get detailed information about a specific transcription.

**Response:**
```json
{
  "transcription": {
    "id": 123,
    "user_id": 15,
    "original_filename": "meeting-recording.mp3",
    "file_path": "transcriptions/user_15/meeting-recording_123.mp3",
    "status": "completed",
    "transcript": "This is the transcribed content...",
    "file_size": 5242880,
    "processing_time": 15.5,
    "created_at": "2025-06-20T10:30:00Z",
    "completed_at": "2025-06-20T10:45:30Z",
    "user": {
      "id": 15,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user",
      "current_subscription": {
        "plan": {
          "id": 2,
          "name": "Pro Plan",
          "slug": "pro"
        }
      }
    }
  },
  "file_info": {
    "exists": true,
    "size_mb": 5.0,
    "mime_type": "audio/mpeg"
  }
}
```

### Delete Transcription
**DELETE** `/admin/transcriptions/{id}`

Delete a transcription and its associated file.

**Response:**
```json
{
  "message": "Transcription deleted successfully",
  "deleted_file": "meeting-recording.mp3",
  "user_id": 15
}
```

---

## System Settings

### Get Settings
**GET** `/admin/settings`

Get all system settings grouped by category and system information.

**Response:**
```json
{
  "settings": {
    "general": [
      {
        "id": 1,
        "key": "general.site_name",
        "value": "PowerTranscriber",
        "type": "string",
        "description": "Application name"
      }
    ],
    "transcription": [
      {
        "id": 2,
        "key": "transcription.max_file_size",
        "value": 100,
        "type": "integer",
        "description": "Maximum file size in MB"
      }
    ]
  },
  "system_info": {
    "php_version": "8.2.0",
    "laravel_version": "10.x",
    "database_connection": "sqlite",
    "cache_driver": "file",
    "queue_driver": "sync",
    "storage_driver": "local",
    "upload_limits": {
      "max_file_size": "100M",
      "post_max_size": "100M",
      "max_execution_time": "300",
      "memory_limit": "512M"
    },
    "disk_usage": {
      "storage_size_mb": 1024.5,
      "public_size_mb": 256.2,
      "total_app_size_mb": 1280.7,
      "free_space_gb": 45.2,
      "total_space_gb": 100.0,
      "used_percentage": 54.8
    }
  }
}
```

### Update Settings
**PUT** `/admin/settings`

Update multiple system settings.

**Request Body:**
```json
{
  "settings": [
    {
      "key": "general.site_name",
      "value": "My Transcription App",
      "type": "string",
      "description": "Application name"
    },
    {
      "key": "transcription.max_file_size",
      "value": 200,
      "type": "integer",
      "description": "Maximum file size in MB"
    }
  ]
}
```

**Validation Rules:**
- `settings`: required, array
- `settings.*.key`: required, string
- `settings.*.value`: required
- `settings.*.type`: required, one of: `string`, `integer`, `float`, `boolean`, `array`, `json`
- `settings.*.description`: optional, string

**Response:**
```json
{
  "message": "Settings updated successfully",
  "updated_settings": [
    {
      "id": 1,
      "key": "general.site_name",
      "value": "My Transcription App",
      "type": "string",
      "description": "Application name"
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "This action is unauthorized."
}
```

### 404 Not Found
```json
{
  "message": "Not found."
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": [
      "Validation error message"
    ]
  }
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error occurred",
  "error": "Detailed error message"
}
```

---

## Usage Examples

### JavaScript/React Examples

```javascript
// Set up axios with auth header
const api = axios.create({
  baseURL: 'http://your-app.com/api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Get users with search and pagination
const getUsers = async (page = 1, search = '', role = '') => {
  const response = await api.get('/admin/users', {
    params: { page, search, role, per_page: 20 }
  });
  return response.data;
};

// Update user
const updateUser = async (userId, userData) => {
  const response = await api.put(`/admin/users/${userId}`, userData);
  return response.data;
};

// Create new plan
const createPlan = async (planData) => {
  const response = await api.post('/admin/plans', planData);
  return response.data;
};

// Get transcriptions with filters
const getTranscriptions = async (filters = {}) => {
  const response = await api.get('/admin/transcriptions', {
    params: filters
  });
  return response.data;
};

// Update system settings
const updateSettings = async (settings) => {
  const response = await api.put('/admin/settings', { settings });
  return response.data;
};
```

### Rate Limiting

Admin endpoints are subject to Laravel's default rate limiting. If you encounter rate limit errors, implement appropriate retry logic with exponential backoff.

### Best Practices

1. **Always handle errors**: Check for 4xx and 5xx status codes
2. **Use pagination**: Don't fetch all records at once for large datasets
3. **Implement loading states**: Show loading indicators during API calls
4. **Cache when appropriate**: Cache relatively static data like plans
5. **Validate on frontend**: Implement client-side validation matching API rules
6. **Use optimistic updates**: Update UI immediately for better UX, rollback on error