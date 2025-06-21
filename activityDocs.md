# Activity API Documentation

## Overview
The Activity API provides endpoints to track and analyze user activity across the PowerTranscriber platform. These endpoints are exclusively available to admin users and provide insights into online users, daily/weekly/monthly active users, and activity trends.

## Base URL
All activity endpoints are prefixed with `/admin/activity` and require admin authentication.

## Authentication
All endpoints require:
- `auth:sanctum` middleware (valid Sanctum token)
- `admin` middleware (admin role required)

## Headers
```
Authorization: Bearer {your_sanctum_token}
Content-Type: application/json
Accept: application/json
```

## Endpoints

### 1. Get Online Users
**Endpoint:** `GET /admin/activity/online`

**Description:** Retrieves current online users (active within the last 5 minutes)

**Parameters:** None

**Response:**
```json
{
  "message": "Online users retrieved successfully",
  "data": {
    "registered_users": 15,
    "guests": 8,
    "total": 23,
    "timestamp": "2025-06-21T10:30:00.000000Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Failed to retrieve online users",
  "message": "An error occurred while fetching online user data"
}
```

---

### 2. Get Daily Active Users
**Endpoint:** `GET /admin/activity/daily`

**Description:** Retrieves active users for a specific date

**Parameters:**
- `date` (optional, query parameter): Date in YYYY-MM-DD format. Defaults to today.

**Example Request:**
```
GET /admin/activity/daily?date=2025-06-20
```

**Response:**
```json
{
  "message": "Daily active users retrieved successfully",
  "data": {
    "date": "2025-06-20",
    "registered_users": 45,
    "guests": 12,
    "total": 57
  }
}
```

**Error Response:**
```json
{
  "error": "Failed to retrieve daily active users",
  "message": "An error occurred while fetching daily activity data"
}
```

---

### 3. Get Weekly Active Users
**Endpoint:** `GET /admin/activity/weekly`

**Description:** Retrieves active users for a specific week

**Parameters:**
- `start_date` (optional, query parameter): Start date of the week in YYYY-MM-DD format. Defaults to current week start (Monday).

**Example Request:**
```
GET /admin/activity/weekly?start_date=2025-06-16
```

**Response:**
```json
{
  "message": "Weekly active users retrieved successfully",
  "data": {
    "start_date": "2025-06-16",
    "end_date": "2025-06-22",
    "registered_users": 120,
    "guests": 35,
    "total": 155
  }
}
```

**Error Response:**
```json
{
  "error": "Failed to retrieve weekly active users",
  "message": "An error occurred while fetching weekly activity data"
}
```

---

### 4. Get Monthly Active Users
**Endpoint:** `GET /admin/activity/monthly`

**Description:** Retrieves active users for a specific month

**Parameters:**
- `month` (optional, query parameter): Month number (1-12). Defaults to current month.
- `year` (optional, query parameter): Year (YYYY). Defaults to current year.

**Example Request:**
```
GET /admin/activity/monthly?month=6&year=2025
```

**Response:**
```json
{
  "message": "Monthly active users retrieved successfully",
  "data": {
    "month": 6,
    "year": 2025,
    "registered_users": 450,
    "guests": 120,
    "total": 570
  }
}
```

**Error Response:**
```json
{
  "error": "Failed to retrieve monthly active users",
  "message": "An error occurred while fetching monthly activity data"
}
```

---

### 5. Get Activity Analytics
**Endpoint:** `GET /admin/activity/analytics`

**Description:** Retrieves comprehensive activity analytics including online, daily, weekly, and monthly data

**Parameters:** None

**Response:**
```json
{
  "message": "Activity analytics retrieved successfully",
  "data": {
    "online": {
      "registered_users": 15,
      "guests": 8,
      "total": 23,
      "timestamp": "2025-06-21T10:30:00.000000Z"
    },
    "daily": {
      "date": "2025-06-21",
      "registered_users": 45,
      "guests": 12,
      "total": 57
    },
    "weekly": {
      "start_date": "2025-06-16",
      "end_date": "2025-06-22",
      "registered_users": 120,
      "guests": 35,
      "total": 155
    },
    "monthly": {
      "month": 6,
      "year": 2025,
      "registered_users": 450,
      "guests": 120,
      "total": 570
    },
    "last_updated": "2025-06-21T10:30:00.000000Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Failed to retrieve activity analytics",
  "message": "An error occurred while fetching activity analytics"
}
```

---

### 6. Get Activity Trends
**Endpoint:** `GET /admin/activity/trends`

**Description:** Retrieves daily activity trends over a specified period

**Parameters:**
- `days` (optional, query parameter): Number of days to include in trends (default: 30)

**Example Request:**
```
GET /admin/activity/trends?days=7
```

**Response:**
```json
{
  "message": "Activity trends retrieved successfully",
  "data": {
    "trends": [
      {
        "date": "2025-06-15",
        "registered_users": 42,
        "guests": 15,
        "total": 57
      },
      {
        "date": "2025-06-16",
        "registered_users": 38,
        "guests": 12,
        "total": 50
      },
      {
        "date": "2025-06-17",
        "registered_users": 45,
        "guests": 18,
        "total": 63
      }
      // ... more daily data
    ],
    "period_days": 7
  }
}
```

**Error Response:**
```json
{
  "error": "Failed to retrieve activity trends",
  "message": "An error occurred while fetching activity trends"
}
```

## Data Types

### User Activity Data
- `registered_users`: Number of logged-in users
- `guests`: Number of anonymous/guest users  
- `total`: Total count (registered + guests)
- `date`: Date in YYYY-MM-DD format
- `timestamp`: ISO 8601 timestamp

## Notes for Frontend Developers

### Activity Tracking
- Users are considered "online" if they've been active within the last 5 minutes
- Activity is tracked via sessions and automatically recorded through middleware
- Guest users are tracked by session ID, registered users by user ID

### Error Handling
All endpoints return consistent error responses with:
- HTTP status code (typically 500 for server errors, 401/403 for auth errors)
- `error` field with brief error description
- `message` field with detailed error message

### Caching Considerations
- Online user data relies on cache (Redis preferred, file-based fallback)
- Cache unavailability will return zero counts with error flag
- Historical data (daily/weekly/monthly) is retrieved from database

### Date Handling
- All dates are in UTC timezone
- Use ISO 8601 format for date parameters
- Weekly data starts from Monday (ISO week standard)
- Monthly data includes full calendar month

### Rate Limiting
Consider implementing appropriate rate limiting for these endpoints as they may be called frequently for dashboard updates.