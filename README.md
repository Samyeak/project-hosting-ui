# Project Hosting Manager

A comprehensive web application for managing project deployments, clients, and uptime monitoring. Built with Next.js 15, React 19, and TypeScript.

![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.24.9-1890ff)

## ✨ Features

### 🔐 Authentication & Authorization
- **User Authentication**: Secure JWT-based authentication with automatic token refresh
- **Role-Based Access Control (RBAC)**: Four pre-configured roles (Admin, Manager, User, Viewer)
- **Permission-Based UI**: Components automatically hide/show based on user permissions
- **Protected Routes**: Automatic redirection for unauthorized access
- **Session Management**: Persistent sessions with secure token storage

### 📊 Project Management
- Create, read, update, and delete projects
- Track project details (name, description, Git URL)
- Link projects to deployments
- Search and filter capabilities

### 👥 Client Management
- Manage client/customer information
- Store contact details and notes
- Associate clients with deployments
- Quick client lookup and editing

### 🚀 Deployment Tracking
- Track deployments across multiple environments
- Support for various hosting platforms (AWS, Azure, Cloudflare, etc.)
- Environment-specific configurations (Dev, Testing, Staging, UAT, Production)
- Status tracking (Active, Inactive, Maintenance)
- Domain URL management
- Deployment date tracking
- Custom remarks and notes

### 📈 Uptime Monitoring
- **Uptime Kuma Integration**: Real-time uptime monitoring
- **Dashboard Statistics**: Overview of all monitors, up/down status, and average uptime
- **Visual Indicators**: Color-coded status badges and percentage bars
- **Detailed Metrics**: Uptime percentage, average response time, last check time
- **Manual Sync**: On-demand synchronization with Uptime Kuma
- **Settings Management**: Configure Uptime Kuma connection via UI

### 🎨 Modern UI/UX
- Responsive design for desktop and mobile
- Clean, intuitive interface with Ant Design
- Dark mode support (can be extended)
- Loading states and error handling
- Toast notifications for user feedback
- Collapsible sidebar navigation

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15.3.1 (App Router with React Server Components)
- **UI Library**: React 19.0.0
- **Language**: TypeScript 5.x
- **Component Library**: Ant Design 5.24.9
- **Styling**: Tailwind CSS 4.x
- **HTTP Client**: Axios 1.9.0
- **Icons**: Ant Design Icons

### Development Tools
- **Linting**: ESLint with Next.js configuration
- **Build Tool**: Next.js (Turbopack in development)
- **Package Manager**: npm

### Runtime
- **Node.js**: ≥20.0.0

## 📋 Prerequisites

- Node.js 20.0.0 or higher
- npm or yarn
- Backend API (see Backend Requirements below)
- (Optional) Uptime Kuma instance for monitoring

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-hosting-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### First Time Setup

1. **Register an account** at `/register`
2. **Login** with your credentials
3. **Configure Uptime Kuma** (optional) at `/settings/uptime`
4. Start managing your projects, clients, and deployments!

## 📖 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[User Guide](./docs/USER_GUIDE.md)** - Complete guide for end users
- **[Developer Guide](./docs/DEVELOPER_GUIDE.md)** - Technical documentation for developers
- **[Authentication Documentation](./docs/AUTHENTICATION.md)** - Auth system details
- **[Uptime Kuma Integration](./docs/UPTIME_KUMA_INTEGRATION.md)** - Monitoring setup guide

## 🎯 Quick Start Guide

### For Users
1. Navigate to the application URL
2. Create an account or login
3. Start by adding your first client
4. Create a project
5. Add a deployment linking the project and client
6. (Optional) Enable uptime monitoring for deployments with URLs

### For Developers
1. Review the [Developer Guide](./docs/DEVELOPER_GUIDE.md)
2. Understand the project structure
3. Check the API client implementation in `src/lib/api.ts`
4. Review component patterns in `src/components/`
5. See type definitions in `src/lib/types.ts`

## 🏗 Project Structure

```
project-hosting-ui/
├── docs/                      # Documentation
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/           # Authentication pages
│   │   ├── clients/          # Client management
│   │   ├── projects/         # Project management
│   │   ├── deployments/      # Deployment management
│   │   ├── settings/         # Settings pages
│   │   └── page.tsx          # Dashboard
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   ├── clients/         # Client components
│   │   ├── projects/        # Project components
│   │   ├── deployments/     # Deployment components
│   │   ├── uptime/          # Uptime monitoring components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Shared UI components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utilities and API client
└── package.json
```

## 🔌 Backend Requirements

The application requires a backend API with the following endpoints:

### Authentication
```
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login
POST   /api/auth/logout        # User logout
POST   /api/auth/refresh       # Token refresh
GET    /api/auth/me            # Get current user
```

### Projects
```
GET    /api/projects           # List all projects
GET    /api/projects/:id       # Get project details
POST   /api/projects           # Create project
PUT    /api/projects/:id       # Update project
DELETE /api/projects/:id       # Delete project
```

### Clients
```
GET    /api/clients            # List all clients
GET    /api/clients/:id        # Get client details
POST   /api/clients            # Create client
PUT    /api/clients/:id        # Update client
DELETE /api/clients/:id        # Delete client
```

### Deployments
```
GET    /api/deployments              # List all deployments
GET    /api/deployments/:id          # Get deployment details
GET    /api/deployments/filter       # Filter deployments
GET    /api/deployments/with-uptime  # Get deployments with uptime data
POST   /api/deployments              # Create deployment
PUT    /api/deployments/:id          # Update deployment
DELETE /api/deployments/:id          # Delete deployment
```

### Uptime Monitoring (Optional)
```
GET    /api/uptime/monitors          # List monitors
POST   /api/uptime/monitors          # Create monitor
PUT    /api/uptime/monitors/:id      # Update monitor
DELETE /api/uptime/monitors/:id      # Delete monitor
GET    /api/uptime/stats             # Get uptime statistics
POST   /api/uptime/sync/:id          # Sync deployment monitor
GET    /api/uptime/settings          # Get Uptime Kuma settings
PUT    /api/uptime/settings          # Update settings
POST   /api/uptime/test-connection   # Test connection
```

See [Backend API Documentation](./docs/DEVELOPER_GUIDE.md#api-client-architecture) for detailed request/response formats.

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Automatic Token Refresh**: Seamless session management
- **Role-Based Access Control**: Granular permission system
- **Protected Routes**: Client-side route protection
- **XSS Prevention**: Input sanitization
- **HTTPS Support**: Production-ready security

## 🎨 User Roles

### Admin
- Full system access
- Manage all resources
- Manage users and settings

### Manager
- Create and manage projects, clients, deployments
- Limited deletion permissions
- No user management access

### User
- View and update assigned resources
- Create deployments
- Limited administrative access

### Viewer
- Read-only access to all resources
- No create/update/delete permissions

## 📊 Dashboard Features

The dashboard provides an at-a-glance view:
- Total projects count
- Total clients count
- Total deployments count
- Uptime monitoring statistics (when enabled):
  - Total monitors
  - Monitors up/down
  - Average uptime percentage

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Environment Variables

Create a `.env.local` file:

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional (defaults shown)
# Add additional environment variables as needed
```

## 🚢 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Docker
```bash
# Build image
docker build -t project-hosting-ui .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com/api \
  project-hosting-ui
```

### Manual Deployment
```bash
# Build production version
npm run build

# Start production server
npm start
```

See [Deployment Guide](./docs/DEVELOPER_GUIDE.md#deployment) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [Developer Guide](./docs/DEVELOPER_GUIDE.md#contributing) for coding standards and guidelines.

## 🐛 Troubleshooting

Common issues and solutions:

### Cannot connect to backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Ensure backend server is running
- Check CORS configuration on backend

### Authentication issues
- Clear browser localStorage
- Check token expiration settings
- Verify backend auth endpoints are working

### Uptime monitoring not showing
- Ensure Uptime Kuma is configured in settings
- Verify deployments have valid domain URLs
- Check backend Uptime Kuma integration

See [User Guide - Troubleshooting](./docs/USER_GUIDE.md#troubleshooting) for more solutions.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Ant Design](https://ant.design/)
- Icons from [Ant Design Icons](https://ant.design/components/icon/)
- Monitoring integration with [Uptime Kuma](https://github.com/louislam/uptime-kuma)

## 📧 Support

For support, please:
1. Check the [User Guide](./docs/USER_GUIDE.md)
2. Review [Developer Guide](./docs/DEVELOPER_GUIDE.md)
3. Search existing issues
4. Create a new issue with detailed information

## 🗺 Roadmap

Future enhancements planned:
- [ ] Advanced analytics dashboard
- [ ] Email notifications for uptime alerts
- [ ] Bulk operations for deployments
- [ ] Export data to CSV/PDF
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Webhook integrations
- [ ] Advanced filtering and search
- [ ] Activity audit logs
- [ ] Two-factor authentication

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Ant Design Documentation](https://ant.design/components/overview)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Version**: 1.0.0
**Last Updated**: November 2025
**Maintained by**: Development Team

For detailed technical information, see the [Developer Guide](./docs/DEVELOPER_GUIDE.md).
