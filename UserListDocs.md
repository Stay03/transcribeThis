# User Activity List API Documentation

## Overview
The User Activity List API provides a comprehensive, sortable, and paginated view of users who have been active within a specified time period. This endpoint shows both registered users and guests with their online/offline status and activity metrics.

## Endpoint
```
GET /api/admin/activity/users-list
```

**Authentication Required**: Yes (Admin only)
**Headers**: 
- `Authorization: Bearer {admin_token}`
- `Content-Type: application/json`

## Query Parameters

| Parameter | Type | Default | Options | Description |
|-----------|------|---------|---------|-------------|
| `duration` | string | `24h` | `1h`, `24h`, `7d`, `30d` | Time period to analyze |
| `sort_by` | string | `last_activity` | `name`, `email`, `last_activity`, `online_status`, `total_sessions`, `type` | Field to sort by |
| `sort_order` | string | `desc` | `asc`, `desc` | Sort direction |
| `per_page` | integer | `25` | `1-100` | Number of results per page |
| `page` | integer | `1` | `1+` | Page number |
| `status_filter` | string | `all` | `online`, `offline`, `all` | Filter by online status |
| `user_type` | string | `all` | `registered`, `guest`, `all` | Filter by user type |

## Response Format

### Success Response (200)
```json
{
  "message": "Users list retrieved successfully",
  "data": [
    {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "type": "registered",
      "role": "user", 
      "online_status": "online",
      "first_activity_in_period": "2025-06-21T09:00:00.000000Z",
      "last_activity": "2025-06-21T15:30:00.000000Z",
      "total_sessions": 3,
      "ip_addresses": ["192.168.1.1", "10.0.0.5"],
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    {
      "id": "guest_abc123",
      "name": "Guest User",
      "email": null,
      "type": "guest",
      "role": "guest",
      "online_status": "offline", 
      "first_activity_in_period": "2025-06-21T14:20:00.000000Z",
      "last_activity": "2025-06-21T14:45:00.000000Z",
      "total_sessions": 1,
      "ip_addresses": ["203.45.67.89"],
      "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)"
    }
  ],
  "meta": {
    "total": 87,
    "per_page": 25,
    "current_page": 1,
    "last_page": 4,
    "from": 1,
    "to": 25
  },
  "filters": {
    "duration": "24h",
    "sort_by": "last_activity",
    "sort_order": "desc",
    "status_filter": "all",
    "user_type": "all"
  }
}
```

### Error Responses

#### Validation Error (422)
```json
{
  "error": "Validation failed",
  "message": "Invalid request parameters",
  "errors": {
    "sort_by": ["The selected sort_by is invalid."],
    "per_page": ["The per_page must be between 1 and 100."]
  }
}
```

#### Server Error (500)
```json
{
  "error": "Failed to retrieve users list",
  "message": "An error occurred while fetching users activity data"
}
```

## Data Field Descriptions

### User Fields
- **`id`**: User ID for registered users, session ID for guests
- **`name`**: User's display name or "Guest User" for guests
- **`email`**: User's email address (null for guests)
- **`type`**: `"registered"` or `"guest"`
- **`role`**: User's role (`"admin"`, `"user"`, `"guest"`)

### Activity Fields
- **`online_status`**: `"online"` (active within 5 minutes) or `"offline"`
- **`first_activity_in_period`**: First activity timestamp within the selected duration
- **`last_activity`**: Most recent activity timestamp
- **`total_sessions`**: Number of distinct activity sessions in the period
- **`ip_addresses`**: Array of IP addresses used during the period
- **`user_agent`**: Browser/device information from most recent session

## Notes for Frontend Developers

1. **Authentication**: All requests require an admin bearer token
2. **Real-time Updates**: Online status is updated every 5 minutes server-side
4. **Error Handling**: Always handle validation errors (422) and server errors (500)
7. **Caching**: Consider implementing client-side caching for better UX
