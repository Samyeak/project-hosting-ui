# Authentication and Authorization Documentation

This document provides a comprehensive guide to the authentication and authorization system implemented in the Project Hosting Manager application.

## Table of Contents

- [Overview](#overview)
- [Authentication Flow](#authentication-flow)
- [Authorization System](#authorization-system)
- [API Integration](#api-integration)
- [Usage Examples](#usage-examples)
- [Backend Requirements](#backend-requirements)

## Overview

The application implements a complete authentication and authorization system with the following features:

- User registration and login
- JWT token-based authentication
- Automatic token refresh
- Protected routes
- Role-based access control (RBAC)
- Permission-based UI rendering

## Authentication Flow

### 1. User Registration

**Route:** `/register`

Users can create a new account by providing:
- Username (minimum 3 characters)
- Email (valid email format)
- Password (minimum 6 characters)
- Password confirmation

Upon successful registration:
- User receives a JWT token and optional refresh token
- Tokens are stored in localStorage
- User is redirected to the dashboard

### 2. User Login

**Route:** `/login`

Users can sign in with:
- Email
- Password

Upon successful login:
- User receives a JWT token and optional refresh token
- Tokens are stored in localStorage
- User is redirected to the dashboard or the page they were trying to access

### 3. Token Management

**Access Token:**
- Stored in localStorage
- Automatically included in all API requests via axios interceptor
- Expires after a set period (determined by backend)

**Refresh Token:**
- Stored in localStorage
- Used to obtain a new access token when it expires
- Automatically triggers on 401 Unauthorized responses

### 4. Logout

Users can logout from:
- Header dropdown menu (clicking on their avatar)

Upon logout:
- All tokens are removed from localStorage
- User session is cleared
- User is redirected to login page

## Authorization System

### Roles

The system supports four default roles:

1. **Admin** - Full access to all features
2. **Manager** - Can create, read, and update most resources
3. **User** - Can read and update assigned resources
4. **Viewer** - Read-only access

Roles are defined in `src/lib/authorization.ts`:

```typescript
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}
```

### Permissions

Granular permissions for specific actions:

**Projects:**
- `create:project`
- `read:project`
- `update:project`
- `delete:project`

**Clients:**
- `create:client`
- `read:client`
- `update:client`
- `delete:client`

**Deployments:**
- `create:deployment`
- `read:deployment`
- `update:deployment`
- `delete:deployment`

**Users:**
- `manage:users`

### Permission Mapping

Each role has associated permissions:

```typescript
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission), // All permissions
  [UserRole.MANAGER]: [
    Permission.CREATE_PROJECT,
    Permission.READ_PROJECT,
    Permission.UPDATE_PROJECT,
    // ... more permissions
  ],
  // ... other roles
};
```

## API Integration

### Authentication Endpoints

The system expects these backend endpoints:

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### Request/Response Formats

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Register Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Auth Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Token Handling

All authenticated API requests automatically include the Authorization header:

```
Authorization: Bearer <token>
```

This is handled by the axios interceptor in `src/lib/api.ts`.

## Usage Examples

### 1. Protecting Routes

All pages wrapped in `MainLayout` are automatically protected:

```tsx
import MainLayout from '@/components/layout/MainLayout';

export default function ProjectsPage() {
  return (
    <MainLayout>
      {/* Your content here */}
    </MainLayout>
  );
}
```

### 2. Using Auth Context

Access authentication state and methods:

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 3. Permission-Based Rendering

Use the `Can` component to conditionally render UI elements:

```tsx
import Can from '@/components/auth/Can';
import { Permission } from '@/lib/authorization';

export default function ProjectList() {
  return (
    <div>
      <h1>Projects</h1>

      <Can permission={Permission.CREATE_PROJECT}>
        <button>Create New Project</button>
      </Can>

      <Can permission={Permission.DELETE_PROJECT}>
        <button>Delete Project</button>
      </Can>
    </div>
  );
}
```

**Multiple permissions (any):**
```tsx
<Can
  permissions={[Permission.UPDATE_PROJECT, Permission.DELETE_PROJECT]}
  requireAll={false}
>
  <button>Edit or Delete</button>
</Can>
```

**Multiple permissions (all):**
```tsx
<Can
  permissions={[Permission.UPDATE_PROJECT, Permission.DELETE_PROJECT]}
  requireAll={true}
>
  <button>Edit and Delete</button>
</Can>
```

**With fallback:**
```tsx
<Can
  permission={Permission.CREATE_PROJECT}
  fallback={<p>You don't have permission to create projects</p>}
>
  <button>Create Project</button>
</Can>
```

### 4. Using Permission Hook

Check permissions programmatically:

```tsx
'use client';

import { usePermission } from '@/hooks/usePermission';
import { Permission } from '@/lib/authorization';

export default function ProjectForm() {
  const { hasPermission } = usePermission();

  const handleSubmit = () => {
    if (!hasPermission(Permission.CREATE_PROJECT)) {
      alert('You do not have permission to create projects');
      return;
    }

    // Submit logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 5. Role-Based Logic

Check user roles:

```tsx
import { usePermission } from '@/hooks/usePermission';
import { UserRole } from '@/lib/authorization';

export default function AdminPanel() {
  const { hasRole } = usePermission();

  if (!hasRole(UserRole.ADMIN)) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      {/* Admin panel content */}
    </div>
  );
}
```

## Backend Requirements

### Expected Backend Implementation

The backend should implement the following:

1. **User Registration Endpoint**
   - Validate email and password
   - Hash passwords securely (bcrypt, argon2, etc.)
   - Create user in database
   - Return user object and tokens

2. **Login Endpoint**
   - Validate credentials
   - Generate JWT access token
   - Generate refresh token (optional)
   - Return user object and tokens

3. **Token Refresh Endpoint**
   - Validate refresh token
   - Generate new access token
   - Return new token

4. **Logout Endpoint**
   - Invalidate tokens (if using token blacklist)
   - Clean up session data

5. **Get Current User Endpoint**
   - Validate access token
   - Return current user information

### Token Configuration

**Recommended JWT Payload:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Recommended Token Expiry:**
- Access Token: 15 minutes to 1 hour
- Refresh Token: 7 days to 30 days

### Security Considerations

1. **Password Storage**
   - Never store passwords in plain text
   - Use bcrypt, argon2, or similar for hashing
   - Implement password complexity requirements

2. **Token Security**
   - Use strong secret keys for JWT signing
   - Implement token rotation for refresh tokens
   - Consider implementing token blacklist for logout

3. **HTTPS**
   - Always use HTTPS in production
   - Never send tokens over unencrypted connections

4. **CORS Configuration**
   - Configure CORS properly to only allow your frontend domain

5. **Rate Limiting**
   - Implement rate limiting on auth endpoints
   - Protect against brute force attacks

## File Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Registration page
│   └── layout.tsx                # Root layout with AuthProvider
├── components/
│   ├── auth/
│   │   ├── Can.tsx               # Permission-based rendering component
│   │   └── ProtectedRoute.tsx   # Route protection component
│   └── layout/
│       ├── Header.tsx            # Header with user menu and logout
│       └── MainLayout.tsx        # Main layout with route protection
├── contexts/
│   └── AuthContext.tsx           # Auth context and provider
├── hooks/
│   └── usePermission.ts          # Permission checking hook
├── lib/
│   ├── api.ts                    # API client with auth interceptors
│   ├── authorization.ts          # Role and permission definitions
│   └── types.ts                  # TypeScript type definitions
└── middleware.ts                 # Next.js middleware
```

## Troubleshooting

### Token Not Being Sent

Check that:
1. Token is stored in localStorage
2. Axios interceptor is properly configured
3. API calls are using the configured axios instance from `src/lib/api.ts`

### Automatic Redirect to Login

This happens when:
1. No token is found in localStorage
2. Token has expired and refresh failed
3. User manually logged out

### Permission Checks Not Working

Ensure that:
1. Backend is returning the user's role in the auth response
2. Role matches one of the defined UserRole enum values
3. Permissions are properly mapped in `src/lib/authorization.ts`

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, update to your production API URL.

## Next Steps

1. Implement the backend authentication endpoints
2. Configure environment variables
3. Test the authentication flow
4. Customize roles and permissions based on your needs
5. Add additional auth features (2FA, password reset, etc.)

---

For questions or issues, please refer to the main project README or contact the development team.
