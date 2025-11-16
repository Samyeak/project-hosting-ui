# Project Hosting Manager - Developer Guide

This guide provides comprehensive technical documentation for developers working with the Project Hosting Manager application.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Authentication System](#authentication-system)
- [Authorization System](#authorization-system)
- [Uptime Monitoring Integration](#uptime-monitoring-integration)
- [API Client Architecture](#api-client-architecture)
- [State Management](#state-management)
- [Component Library](#component-library)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Extending the Application](#extending-the-application)

## Architecture Overview

The Project Hosting Manager is built using a modern React-based architecture with Next.js 15 and TypeScript.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  App Router (RSC)  │  Client Components  │  Server Actions  │
├─────────────────────────────────────────────────────────────┤
│           Context Providers (Auth, etc.)                     │
├─────────────────────────────────────────────────────────────┤
│  Axios API Client (with interceptors)                       │
├─────────────────────────────────────────────────────────────┤
│                    Backend API                               │
│  ┌──────────┬──────────┬──────────┬────────────────┐       │
│  │ Projects │ Clients  │ Deploy   │ Uptime Kuma    │       │
│  └──────────┴──────────┴──────────┴────────────────┘       │
├─────────────────────────────────────────────────────────────┤
│                      Database Layer                          │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Next.js App Router**: Utilizes React Server Components (RSC) for optimal performance
2. **Client-Side Auth**: Authentication state managed client-side with localStorage
3. **Axios Interceptors**: Automatic token injection and refresh handling
4. **Ant Design**: Component library for consistent UI/UX
5. **TypeScript**: Strong typing throughout the application
6. **Modular Architecture**: Clear separation of concerns

## Technology Stack

### Frontend

- **Framework**: Next.js 15.3.1
- **React**: 19.0.0
- **TypeScript**: 5.x
- **UI Library**: Ant Design 5.24.9
- **HTTP Client**: Axios 1.9.0
- **Styling**: Tailwind CSS 4.x

### Development Tools

- **Linting**: ESLint with Next.js config
- **Build Tool**: Next.js built-in (Turbopack in dev)
- **Package Manager**: npm

### Runtime Requirements

- **Node.js**: ≥20.0.0

## Project Structure

```
project-hosting-ui/
├── docs/                              # Documentation
│   ├── AUTHENTICATION.md              # Auth system docs
│   ├── UPTIME_KUMA_INTEGRATION.md     # Uptime integration docs
│   ├── USER_GUIDE.md                  # User documentation
│   └── DEVELOPER_GUIDE.md             # This file
├── public/                            # Static assets
├── src/
│   ├── app/                           # Next.js App Router pages
│   │   ├── (auth)/                    # Auth pages group
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Login page
│   │   │   └── register/
│   │   │       └── page.tsx           # Registration page
│   │   ├── clients/                   # Client management pages
│   │   │   ├── page.tsx               # Client list
│   │   │   ├── add/page.tsx           # Add client
│   │   │   └── [id]/edit/page.tsx     # Edit client
│   │   ├── projects/                  # Project management pages
│   │   ├── deployments/               # Deployment management pages
│   │   ├── settings/                  # Settings pages
│   │   │   └── uptime/page.tsx        # Uptime Kuma settings
│   │   ├── layout.tsx                 # Root layout with providers
│   │   ├── page.tsx                   # Dashboard
│   │   └── globals.css                # Global styles
│   ├── components/                    # React components
│   │   ├── auth/                      # Auth-related components
│   │   │   ├── Can.tsx                # Permission-based rendering
│   │   │   └── ProtectedRoute.tsx     # Route protection HOC
│   │   ├── clients/                   # Client components
│   │   ├── projects/                  # Project components
│   │   ├── deployments/               # Deployment components
│   │   ├── uptime/                    # Uptime monitoring components
│   │   │   ├── UptimeStatusBadge.tsx  # Status badge component
│   │   │   └── UptimePercentageBar.tsx # Percentage bar component
│   │   ├── layout/                    # Layout components
│   │   │   ├── Header.tsx             # App header with user menu
│   │   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   │   └── MainLayout.tsx         # Main layout wrapper
│   │   └── ui/                        # Shared UI components
│   ├── contexts/                      # React contexts
│   │   └── AuthContext.tsx            # Authentication context
│   ├── hooks/                         # Custom React hooks
│   │   └── usePermission.ts           # Permission checking hook
│   ├── lib/                           # Utility libraries
│   │   ├── api.ts                     # API client & functions
│   │   ├── types.ts                   # TypeScript type definitions
│   │   └── authorization.ts           # Authorization utilities
│   └── middleware.ts                  # Next.js middleware
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.js                 # Tailwind CSS configuration
├── next.config.ts                     # Next.js configuration
└── README.md                          # Project README
```

## Authentication System

### Overview

The authentication system uses JWT tokens with automatic refresh capabilities.

### Components

#### 1. AuthContext (`src/contexts/AuthContext.tsx`)

Central authentication state management using React Context.

**Key Features**:
- User state management
- Login/logout/register functions
- Automatic token refresh
- Loading states
- Error handling

**Usage**:
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Welcome, {user.username}!</div>;
}
```

#### 2. ProtectedRoute Component (`src/components/auth/ProtectedRoute.tsx`)

Higher-order component that protects routes from unauthenticated access.

**Features**:
- Redirects to login if not authenticated
- Shows loading spinner during auth check
- Preserves intended destination in redirect

**Usage**:
```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function SecurePage() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  );
}
```

#### 3. Login/Register Pages

- **Login**: `src/app/login/page.tsx`
- **Register**: `src/app/register/page.tsx`

**Features**:
- Form validation using Ant Design
- Error message display
- Redirect after successful auth
- Automatic redirect if already authenticated

### Authentication Flow

```
┌─────────────┐
│   Login     │
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  POST /api/auth/login               │
│  { email, password }                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend validates credentials      │
│  Generates JWT token                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Response: { user, token,           │
│             refreshToken }          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Store in localStorage:             │
│  - token                            │
│  - refreshToken                     │
│  - user (JSON)                      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Update AuthContext state           │
│  Redirect to dashboard              │
└─────────────────────────────────────┘
```

### Token Refresh Flow

Implemented via Axios interceptors in `src/lib/api.ts`:

```typescript
// Automatic token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Attempt token refresh
      // Retry original request with new token
    }
    return Promise.reject(error);
  }
);
```

### Security Considerations

1. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
2. **XSS Protection**: Never expose sensitive operations in client-side code
3. **HTTPS**: Always use HTTPS in production
4. **Token Expiration**: Implement short-lived access tokens (15min-1hr)
5. **Refresh Tokens**: Use longer-lived refresh tokens (7-30 days)

## Authorization System

### Role-Based Access Control (RBAC)

Implemented in `src/lib/authorization.ts`.

### Roles and Permissions

**Roles** (`UserRole` enum):
```typescript
enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer',
}
```

**Permissions** (`Permission` enum):
```typescript
enum Permission {
  CREATE_PROJECT = 'create:project',
  READ_PROJECT = 'read:project',
  UPDATE_PROJECT = 'update:project',
  DELETE_PROJECT = 'delete:project',
  // ... more permissions
}
```

### Permission Mapping

```typescript
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission),
  [UserRole.MANAGER]: [
    Permission.CREATE_PROJECT,
    Permission.READ_PROJECT,
    // ...
  ],
  // ...
};
```

### Authorization Utilities

**Functions**:
- `hasRole(user, role)`: Check if user has specific role
- `hasPermission(user, permission)`: Check specific permission
- `hasAnyPermission(user, permissions[])`: Check any of permissions
- `hasAllPermissions(user, permissions[])`: Check all permissions
- `isAdmin(user)`: Quick admin check
- `getUserPermissions(user)`: Get all user permissions

### Permission-Based Rendering

#### Can Component

```tsx
import Can from '@/components/auth/Can';
import { Permission } from '@/lib/authorization';

<Can permission={Permission.CREATE_PROJECT}>
  <Button>Create Project</Button>
</Can>

// Multiple permissions (any)
<Can permissions={[Permission.UPDATE_PROJECT, Permission.DELETE_PROJECT]}>
  <Button>Manage</Button>
</Can>

// Multiple permissions (all)
<Can
  permissions={[Permission.UPDATE_PROJECT, Permission.DELETE_PROJECT]}
  requireAll={true}
>
  <Button>Full Management</Button>
</Can>

// With fallback
<Can
  permission={Permission.CREATE_PROJECT}
  fallback={<p>No permission</p>}
>
  <Button>Create</Button>
</Can>
```

#### usePermission Hook

```tsx
import { usePermission } from '@/hooks/usePermission';
import { Permission, UserRole } from '@/lib/authorization';

function MyComponent() {
  const { hasPermission, hasRole } = usePermission();

  if (!hasPermission(Permission.CREATE_PROJECT)) {
    return <div>Access denied</div>;
  }

  const isAdmin = hasRole(UserRole.ADMIN);

  return <div>Content</div>;
}
```

## Uptime Monitoring Integration

### Architecture

```
┌──────────────────────────────────────────────────────┐
│              Frontend Application                     │
│  ┌────────────────┐  ┌──────────────────────┐       │
│  │  Dashboard     │  │  Deployment List     │       │
│  │  - Stats       │  │  - Status Badges     │       │
│  │  - Monitors    │  │  - Percentage Bars   │       │
│  └────────┬───────┘  └──────────┬───────────┘       │
│           │                     │                     │
│           └──────────┬──────────┘                     │
│                      │                                │
│              ┌───────▼────────┐                       │
│              │   API Client   │                       │
│              └───────┬────────┘                       │
└──────────────────────┼──────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│              Backend API                              │
│  ┌────────────────────────────────────────────┐     │
│  │  /api/uptime/*                              │     │
│  │  - Monitor CRUD                             │     │
│  │  - Stats aggregation                        │     │
│  │  - Deployment sync                          │     │
│  └────────────────┬───────────────────────────┘     │
└───────────────────┼───────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│            Uptime Kuma Instance                       │
│  - HTTP monitoring                                   │
│  - Status tracking                                   │
│  - Response time metrics                             │
└──────────────────────────────────────────────────────┘
```

### Key Components

#### 1. UptimeStatusBadge (`src/components/uptime/UptimeStatusBadge.tsx`)

Displays monitor status with color-coded badges.

**Props**:
```typescript
interface UptimeStatusBadgeProps {
  monitor?: UptimeMonitor;
  showDetails?: boolean;  // Show uptime percentage
}
```

**Status Colors**:
- Up: Green
- Down: Red
- Pending: Blue (processing)
- Maintenance: Orange

**Tooltip Information**:
- Current status
- Uptime percentage
- Average response time
- Last check timestamp

#### 2. UptimePercentageBar (`src/components/uptime/UptimePercentageBar.tsx`)

Visual progress bar for uptime percentage.

**Props**:
```typescript
interface UptimePercentageBarProps {
  percentage: number;
  showInfo?: boolean;
  size?: 'small' | 'default';
}
```

**Color Coding**:
- ≥99.5%: Green (Excellent)
- ≥95%: Orange (Fair)
- <95%: Red (Poor)

### API Integration

#### Uptime API Functions

Located in `src/lib/api.ts`:

```typescript
// Monitor Management
getUptimeMonitors(): Promise<UptimeMonitor[]>
getUptimeMonitor(id): Promise<UptimeMonitor>
createUptimeMonitor(monitor): Promise<UptimeMonitor>
updateUptimeMonitor(id, monitor): Promise<UptimeMonitor>
deleteUptimeMonitor(id): Promise<void>

// Deployment Integration
getDeploymentsWithUptime(): Promise<DeploymentWithUptime[]>
syncUptimeMonitor(deploymentId): Promise<UptimeMonitor>

// Statistics
getUptimeStats(): Promise<UptimeStats>

// Settings
getUptimeSettings(): Promise<UptimeKumaSettings>
updateUptimeSettings(settings): Promise<UptimeKumaSettings>
testUptimeConnection(settings): Promise<{ success, message }>
```

### Type Definitions

Located in `src/lib/types.ts`:

```typescript
interface UptimeMonitor {
  id: number;
  name: string;
  url: string;
  type: string;
  interval: number;
  active: boolean;
  uptimePercentage?: number;
  avgResponseTime?: number;
  status?: 'up' | 'down' | 'pending' | 'maintenance';
  lastCheck?: string;
}

interface UptimeStats {
  totalMonitors: number;
  upMonitors: number;
  downMonitors: number;
  pausedMonitors: number;
  avgUptime: number;
}

interface UptimeKumaSettings {
  id?: number;
  baseURL: string;
  apiKey?: string;
  enabled: boolean;
}

interface DeploymentWithUptime extends Deployment {
  monitor?: UptimeMonitor;
  monitorId?: number;
}
```

## API Client Architecture

### Axios Instance Configuration

Located in `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Interceptors

#### Request Interceptor

Automatically injects authentication token:

```typescript
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

#### Response Interceptor

Handles token refresh on 401:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Attempt to refresh token
      // Retry original request with new token
    }

    return Promise.reject(error);
  }
);
```

### API Function Patterns

All API functions follow a consistent pattern:

```typescript
export const getResource = async (): Promise<Resource[]> => {
  const response = await api.get<Resource[]>('/resources');
  return response.data;
};

export const createResource = async (data: CreateResource): Promise<Resource> => {
  const response = await api.post<Resource>('/resources', data);
  return response.data;
};

export const updateResource = async (id: number, data: UpdateResource): Promise<Resource> => {
  const response = await api.put<Resource>(`/resources/${id}`, data);
  return response.data;
};

export const deleteResource = async (id: number): Promise<void> => {
  await api.delete(`/resources/${id}`);
};
```

## State Management

### Global State (Context API)

#### AuthContext

Manages authentication state globally:

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}
```

**Provider Setup** (`src/app/layout.tsx`):

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
```

### Local State

Component-level state managed with `useState`:

```tsx
function DeploymentList() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    setLoading(true);
    try {
      const data = await getDeployments();
      setDeployments(data);
    } finally {
      setLoading(false);
    }
  };
}
```

## Component Library

### Layout Components

#### MainLayout

Wraps authenticated pages with navigation:

```tsx
<MainLayout>
  <YourContent />
</MainLayout>
```

Features:
- Header with user menu
- Collapsible sidebar
- Protected route wrapper
- Responsive design

#### Header

Top navigation bar with:
- Menu toggle button
- Application title
- User avatar and dropdown
- Logout functionality

#### Sidebar

Left navigation menu with:
- Dashboard link
- Projects link
- Clients link
- Deployments link
- Settings submenu
  - Uptime Kuma settings

### Form Components

Using Ant Design Form components:

```tsx
<Form
  form={form}
  layout="vertical"
  onFinish={handleSubmit}
>
  <Form.Item
    name="name"
    label="Name"
    rules={[{ required: true, message: 'Required' }]}
  >
    <Input placeholder="Enter name" />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit">
      Submit
    </Button>
  </Form.Item>
</Form>
```

### Table Components

Using Ant Design Table:

```tsx
<Table
  columns={columns}
  dataSource={data}
  rowKey="id"
  loading={loading}
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
  }}
/>
```

## Development Workflow

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-hosting-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   ```
   http://localhost:3000
   ```

### Available Scripts

```json
{
  "dev": "next dev --turbopack",      // Development with Turbopack
  "build": "next build",              // Production build
  "start": "next start",              // Production server
  "lint": "next lint"                 // Run ESLint
}
```

### Environment Variables

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Add other variables as needed
```

### Code Style

Follow these conventions:

1. **TypeScript**: Use explicit types
2. **Components**: Functional components with TypeScript
3. **Naming**:
   - Components: PascalCase (`MyComponent.tsx`)
   - Functions: camelCase (`getUserData`)
   - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
4. **File Organization**: Group related files
5. **Comments**: Document complex logic

### Git Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to remote**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create pull request**

### Commit Message Convention

Follow conventional commits:

```
feat: add new feature
fix: fix bug in component
docs: update documentation
style: format code
refactor: refactor component
test: add tests
chore: update dependencies
```

## Testing

### Unit Testing (To Be Implemented)

Recommended setup with Jest and React Testing Library:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Example test:

```typescript
import { render, screen } from '@testing-library/react';
import UptimeStatusBadge from '@/components/uptime/UptimeStatusBadge';

describe('UptimeStatusBadge', () => {
  it('renders up status correctly', () => {
    const monitor = {
      id: 1,
      name: 'Test',
      status: 'up',
      uptimePercentage: 99.9,
    };

    render(<UptimeStatusBadge monitor={monitor} />);
    expect(screen.getByText('Up')).toBeInTheDocument();
  });
});
```

### Integration Testing

Test API integration:

```typescript
import { getDeployments } from '@/lib/api';
import { server } from './mocks/server';

describe('API Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('fetches deployments successfully', async () => {
    const deployments = await getDeployments();
    expect(deployments).toHaveLength(10);
  });
});
```

### E2E Testing (To Be Implemented)

Recommended setup with Playwright or Cypress.

## Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in `.next` directory.

### Environment Configuration

Production environment variables:

```env
NEXT_PUBLIC_API_URL=https://api.example.com/api
NODE_ENV=production
```

### Deployment Platforms

#### Vercel (Recommended for Next.js)

1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

#### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t project-hosting-ui .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.example.com/api project-hosting-ui
```

### Performance Optimization

1. **Code Splitting**: Automatic with Next.js
2. **Image Optimization**: Use `next/image`
3. **Font Optimization**: Use `next/font`
4. **Bundle Analysis**:
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

## Extending the Application

### Adding a New Resource Type

1. **Define Types** (`src/lib/types.ts`):
   ```typescript
   export interface NewResource {
     id: number;
     name: string;
     // ... other fields
   }

   export interface CreateNewResource {
     name: string;
     // ... other fields
   }
   ```

2. **Create API Functions** (`src/lib/api.ts`):
   ```typescript
   export const getNewResources = async (): Promise<NewResource[]> => {
     const response = await api.get<NewResource[]>('/new-resources');
     return response.data;
   };

   export const createNewResource = async (data: CreateNewResource): Promise<NewResource> => {
     const response = await api.post<NewResource>('/new-resources', data);
     return response.data;
   };
   ```

3. **Create Components**:
   - List component: `src/components/newresources/NewResourceList.tsx`
   - Form component: `src/components/newresources/NewResourceForm.tsx`

4. **Create Pages**:
   - List: `src/app/newresources/page.tsx`
   - Add: `src/app/newresources/add/page.tsx`
   - Edit: `src/app/newresources/[id]/edit/page.tsx`

5. **Add Navigation** (`src/components/layout/Sidebar.tsx`):
   ```tsx
   <Menu.Item key="newresources" icon={<Icon />}>
     <Link href="/newresources">New Resources</Link>
   </Menu.Item>
   ```

6. **Add Permissions** (if needed):
   ```typescript
   enum Permission {
     // ... existing permissions
     CREATE_NEW_RESOURCE = 'create:newresource',
     READ_NEW_RESOURCE = 'read:newresource',
     UPDATE_NEW_RESOURCE = 'update:newresource',
     DELETE_NEW_RESOURCE = 'delete:newresource',
   }
   ```

### Adding a New Permission

1. **Define Permission** (`src/lib/authorization.ts`):
   ```typescript
   export enum Permission {
     // ... existing
     NEW_PERMISSION = 'action:resource',
   }
   ```

2. **Add to Role Mapping**:
   ```typescript
   const rolePermissions: Record<UserRole, Permission[]> = {
     [UserRole.ADMIN]: [
       // ... existing
       Permission.NEW_PERMISSION,
     ],
     // ... other roles
   };
   ```

3. **Use in Components**:
   ```tsx
   <Can permission={Permission.NEW_PERMISSION}>
     <Button>Restricted Action</Button>
   </Can>
   ```

### Creating Custom Hooks

Example custom hook:

```typescript
// src/hooks/useDeployments.ts
import { useState, useEffect } from 'react';
import { getDeployments } from '@/lib/api';
import { Deployment } from '@/lib/types';

export function useDeployments() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    setLoading(true);
    try {
      const data = await getDeployments();
      setDeployments(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { deployments, loading, error, refetch: fetchDeployments };
}

// Usage
function MyComponent() {
  const { deployments, loading, error, refetch } = useDeployments();

  if (loading) return <Spin />;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{deployments.length} deployments</div>;
}
```

### Adding Middleware Logic

Edit `src/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add custom middleware logic here

  // Example: Add custom header
  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'value');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

## Troubleshooting

### Common Issues

#### Build Errors

**Issue**: Type errors during build
```
Solution: Run `npm run lint` to identify issues
Solution: Check TypeScript configuration
Solution: Ensure all imports are correct
```

**Issue**: Module not found
```
Solution: Check import paths use @ alias correctly
Solution: Verify file exists at specified path
Solution: Run `npm install` to ensure dependencies
```

#### Runtime Errors

**Issue**: "Cannot read property of undefined"
```
Solution: Add null/undefined checks
Solution: Use optional chaining (?.)
Solution: Provide default values
```

**Issue**: CORS errors
```
Solution: Configure backend CORS headers
Solution: Check API_BASE_URL configuration
Solution: Verify proxy settings if using one
```

#### Authentication Issues

**Issue**: Token not being sent
```
Solution: Check localStorage contains token
Solution: Verify axios interceptor is configured
Solution: Check API calls use the configured axios instance
```

**Issue**: Redirect loop on login
```
Solution: Check AuthContext initialization
Solution: Verify token validation logic
Solution: Clear localStorage and try again
```

## Best Practices

### React Best Practices

1. **Use functional components** with hooks
2. **Avoid prop drilling** - use Context for global state
3. **Memoize expensive operations** with `useMemo` and `useCallback`
4. **Handle cleanup** in `useEffect` hooks
5. **Extract reusable logic** into custom hooks

### TypeScript Best Practices

1. **Use explicit types** for function parameters and returns
2. **Avoid `any` type** - use `unknown` if type is truly unknown
3. **Use interfaces** for object shapes
4. **Use enums** for fixed sets of values
5. **Leverage type inference** where appropriate

### API Best Practices

1. **Handle errors** consistently
2. **Show loading states** during async operations
3. **Provide user feedback** with messages
4. **Implement retry logic** for failed requests
5. **Cache responses** when appropriate

### Security Best Practices

1. **Never store sensitive data** in client-side code
2. **Validate user input** before sending to API
3. **Sanitize data** before rendering
4. **Use HTTPS** in production
5. **Implement rate limiting** on sensitive operations

## Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Ant Design Documentation](https://ant.design/components/overview)
- [Axios Documentation](https://axios-http.com/docs/intro)

### Related Project Documentation

- [Authentication System](./AUTHENTICATION.md)
- [Uptime Kuma Integration](./UPTIME_KUMA_INTEGRATION.md)
- [User Guide](./USER_GUIDE.md)

## Contributing

### Code Review Checklist

- [ ] Code follows project conventions
- [ ] TypeScript types are properly defined
- [ ] Components are properly tested
- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] User feedback is provided
- [ ] Code is documented where necessary
- [ ] No console.log statements in production code
- [ ] Accessibility considerations met
- [ ] Performance optimizations applied

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

---

**Version**: 1.0.0
**Last Updated**: November 2025
**Maintainer**: Development Team

For user documentation, see `USER_GUIDE.md`
