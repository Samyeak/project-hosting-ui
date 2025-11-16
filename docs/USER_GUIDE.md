# Project Hosting Manager - User Guide

Welcome to the Project Hosting Manager! This guide will help you get started and make the most of all available features.

## Table of Contents

- [Getting Started](#getting-started)
- [User Authentication](#user-authentication)
- [Managing Projects](#managing-projects)
- [Managing Clients](#managing-clients)
- [Managing Deployments](#managing-deployments)
- [Uptime Monitoring](#uptime-monitoring)
- [User Roles and Permissions](#user-roles-and-permissions)
- [Settings](#settings)
- [Troubleshooting](#troubleshooting)

## Getting Started

### First Time Login

1. **Register an Account**
   - Navigate to the application URL
   - Click "Sign up" on the login page
   - Fill in your details:
     - Username (minimum 3 characters)
     - Email address
     - Password (minimum 6 characters)
     - Confirm password
   - Click "Sign Up"
   - You'll be automatically logged in and redirected to the dashboard

2. **Login to Existing Account**
   - Enter your email and password
   - Click "Sign In"
   - You'll be redirected to the dashboard

### Dashboard Overview

The dashboard provides a quick overview of your project hosting ecosystem:

- **Total Projects**: Number of projects being managed
- **Total Clients**: Number of clients
- **Total Deployments**: Number of active deployments
- **Uptime Monitoring** (if enabled):
  - Total monitors
  - Monitors currently up
  - Monitors currently down
  - Average uptime percentage

## User Authentication

### Logging In

1. Visit the application URL
2. Enter your email and password
3. Click "Sign In"

**Note**: If you navigate to a protected page while not logged in, you'll be redirected to the login page. After successful login, you'll be taken to your originally requested page.

### Logging Out

1. Click on your avatar/username in the top-right corner
2. Select "Logout" from the dropdown menu
3. You'll be redirected to the login page

### Password Security

- Passwords must be at least 6 characters long
- Use a strong password with a mix of letters, numbers, and symbols
- Never share your password with others

## Managing Projects

Projects represent the software applications you're hosting.

### Creating a New Project

1. Navigate to **Projects** in the sidebar
2. Click **Add Project** button
3. Fill in the project details:
   - **Name** (required): Project name
   - **Description**: Brief description of the project
   - **Git URL**: Repository URL (e.g., GitHub, GitLab)
4. Click **Submit**

### Viewing Projects

- All projects are displayed in a table with columns:
  - Name
  - Description
  - Git URL
  - Created date
  - Actions (Edit/Delete)

### Editing a Project

1. Click the **Edit** icon (pencil) next to the project
2. Modify the project details
3. Click **Submit** to save changes

### Deleting a Project

1. Click the **Delete** icon (trash) next to the project
2. Confirm the deletion in the popup
3. The project will be permanently deleted

**Warning**: Deleting a project may affect associated deployments.

## Managing Clients

Clients represent the customers or organizations using your hosted projects.

### Creating a New Client

1. Navigate to **Clients** in the sidebar
2. Click **Add Client** button
3. Fill in the client details:
   - **Name** (required): Client/company name
   - **Contact Info**: Email, phone, or other contact details
   - **Notes**: Additional notes about the client
4. Click **Submit**

### Viewing Clients

- All clients are displayed in a table showing:
  - Name
  - Contact information
  - Notes
  - Actions (Edit/Delete)

### Editing a Client

1. Click the **Edit** icon next to the client
2. Modify the client details
3. Click **Submit**

### Deleting a Client

1. Click the **Delete** icon next to the client
2. Confirm the deletion
3. The client will be permanently deleted

## Managing Deployments

Deployments represent specific instances of your projects hosted for clients.

### Creating a New Deployment

1. Navigate to **Deployments** in the sidebar
2. Click **Add Deployment** button
3. Fill in the deployment details:
   - **Project** (required): Select from existing projects
   - **Client** (required): Select from existing clients
   - **Type**: Deployment type (e.g., Web App, API, Mobile Backend)
   - **Environment** (required): Development, Testing, Staging, UAT, or Production
   - **Hosting Platform**: Where it's hosted (AWS, Azure, Cloudflare, etc.)
   - **Domain URL**: The URL where the deployment is accessible
   - **Status**: Current status (Active, Inactive, Maintenance)
   - **Deployment Date**: When it was deployed
   - **Remarks**: Additional notes
4. Click **Submit**

### Viewing Deployments

The deployment list displays:
- Project name
- Client name
- Type
- Environment (color-coded badge)
- Hosting platform
- Domain URL (clickable link)
- Status
- **Uptime status** (if monitoring enabled)
- **Uptime percentage** (if monitoring enabled)
- Actions (Edit/Sync/Delete)

### Environment Color Codes

- 🔴 **Production**: Red (highest priority)
- 🟠 **Staging**: Orange
- 🟡 **UAT**: Gold
- 🔵 **Testing**: Blue
- 🟢 **Development**: Green

### Filtering Deployments

Use the search bar at the top of the deployments page to filter by:
- **Project Name**: Select from dropdown
- **Environment**: Select from dropdown
- **Client Name**: Select from dropdown

Click **Search** to apply filters or **Reset** to clear them.

### Editing a Deployment

1. Click the **Edit** icon next to the deployment
2. Modify the deployment details
3. Click **Submit**

### Deleting a Deployment

1. Click the **Delete** icon next to the deployment
2. Confirm the deletion
3. The deployment and its monitoring data will be permanently deleted

## Uptime Monitoring

Monitor the uptime and availability of your deployments using Uptime Kuma integration.

### Setting Up Uptime Monitoring

1. Navigate to **Settings > Uptime Kuma** in the sidebar
2. Enter your **Uptime Kuma Base URL** (e.g., `https://uptime.example.com`)
3. (Optional) Enter an **API Key** if your Uptime Kuma instance requires authentication
4. Click **Test Connection** to verify the settings
5. Toggle **Enable Uptime Kuma Integration** to ON
6. Click **Save Settings**

### Understanding Uptime Status

**Status Badges**:
- ✅ **Up** (Green): Service is running normally
- ❌ **Down** (Red): Service is not responding
- 🔄 **Pending** (Blue): Monitor is waiting for first check
- 🔧 **Maintenance** (Orange): Service is in maintenance mode

**Uptime Percentage**:
- 🟢 **≥99.5%**: Excellent (green)
- 🟡 **≥95%**: Fair (orange)
- 🔴 **<95%**: Poor (red)

### Syncing Monitors

To create or update a monitor for a deployment:

1. Go to **Deployments** page
2. Find the deployment with a domain URL
3. Click the **Sync** icon (⟳) in the Actions column
4. Wait for the sync to complete
5. The uptime data will refresh automatically

**Note**: Only deployments with a domain URL can be monitored.

### Viewing Uptime Data

**In Dashboard**:
- Total number of monitors
- Number of monitors currently up
- Number of monitors currently down
- Average uptime percentage across all monitors

**In Deployment List**:
- Uptime status badge with tooltip showing:
  - Current status
  - Uptime percentage
  - Average response time
  - Last check time
- Uptime percentage bar with color coding

### Tooltips

Hover over the uptime status badge or percentage bar to see detailed information:
- Current status
- Uptime percentage
- Average response time (in milliseconds)
- When the monitor last checked

## User Roles and Permissions

The system supports role-based access control (RBAC) with four default roles:

### Admin
- **Full access** to all features
- Can create, read, update, and delete all resources
- Can manage users and settings
- Typically for system administrators

### Manager
- Can create and manage projects, clients, and deployments
- Cannot delete critical resources
- Cannot manage users
- Typically for team leads or project managers

### User
- Can view and update assigned resources
- Can create new deployments
- Limited deletion permissions
- Typically for developers and operators

### Viewer
- **Read-only access** to all resources
- Cannot create, update, or delete anything
- Typically for stakeholders or auditors

### Permission-Based Features

Some UI elements are hidden based on your role:
- **Create buttons**: Only visible if you have create permission
- **Edit buttons**: Only visible if you have update permission
- **Delete buttons**: Only visible if you have delete permission

If you need additional permissions, contact your system administrator.

## Settings

### Uptime Kuma Settings

Configure your Uptime Kuma monitoring instance:

1. Navigate to **Settings > Uptime Kuma**
2. Configure the following:
   - **Enable Integration**: Toggle to enable/disable monitoring
   - **Base URL**: Your Uptime Kuma server URL
   - **API Key**: Authentication key (if required)
3. Use **Test Connection** to verify settings before saving
4. Click **Save Settings** to apply changes

**Backend Requirements**: Your system administrator needs to implement the backend integration. See the technical documentation for details.

## Troubleshooting

### Cannot Login

**Problem**: Login fails with "Invalid credentials"
- **Solution**: Check your email and password are correct
- **Solution**: Ensure Caps Lock is not on
- **Solution**: Try resetting your password (contact admin)

**Problem**: Redirected to login page repeatedly
- **Solution**: Clear your browser cache and cookies
- **Solution**: Try a different browser
- **Solution**: Check if your account is active (contact admin)

### Not Seeing Expected Data

**Problem**: Projects/Clients/Deployments not showing
- **Solution**: Refresh the page
- **Solution**: Check your permissions with an administrator
- **Solution**: Verify filters are not applied

### Uptime Monitoring Not Working

**Problem**: Uptime data not showing
- **Solution**: Verify Uptime Kuma integration is enabled in Settings
- **Solution**: Ensure the deployment has a valid domain URL
- **Solution**: Click the Sync button to manually sync the monitor
- **Solution**: Check Uptime Kuma settings with Test Connection

**Problem**: Uptime percentage showing 0% or incorrect data
- **Solution**: Wait for the monitor to complete at least one check cycle
- **Solution**: Verify the domain URL is correct and accessible
- **Solution**: Check Uptime Kuma is running and accessible

### Permission Errors

**Problem**: "You don't have permission" errors
- **Solution**: Contact your administrator to request appropriate permissions
- **Solution**: Verify you're logged in with the correct account
- **Solution**: Check if your role has been changed recently

### Sync Button Not Appearing

**Problem**: Cannot sync deployment with Uptime Kuma
- **Solution**: Ensure the deployment has a domain URL set
- **Solution**: Verify Uptime Kuma integration is enabled
- **Solution**: Check if you have the required permissions

## Best Practices

### Project Management
1. Use clear, descriptive project names
2. Always include Git URLs for version tracking
3. Keep descriptions up to date
4. Archive projects instead of deleting when possible

### Client Management
1. Maintain accurate contact information
2. Use notes field for important details
3. Regularly review and update client data

### Deployment Management
1. Use consistent naming conventions
2. Always specify the correct environment
3. Keep domain URLs accurate and up to date
4. Document deployment dates
5. Use remarks for deployment-specific notes
6. Set appropriate status (Active/Inactive/Maintenance)

### Uptime Monitoring
1. Sync monitors after updating domain URLs
2. Review dashboard statistics regularly
3. Investigate any monitors showing Down status
4. Monitor uptime percentages, especially for production deployments
5. Set appropriate monitoring intervals in Uptime Kuma

### Security
1. Use strong, unique passwords
2. Log out when finished, especially on shared computers
3. Don't share your account credentials
4. Report any suspicious activity to administrators
5. Regularly review your account activity

## Keyboard Shortcuts

While there are no built-in keyboard shortcuts, you can use standard browser shortcuts:
- **Ctrl/Cmd + R**: Refresh the current page
- **Ctrl/Cmd + W**: Close the current tab
- **Ctrl/Cmd + T**: Open a new tab
- **Ctrl/Cmd + F**: Search within the page

## Getting Help

If you encounter issues not covered in this guide:

1. **Check the documentation**: Review this guide and technical documentation
2. **Contact your administrator**: Reach out to your system administrator
3. **Report bugs**: Use your organization's bug reporting process
4. **Request features**: Submit feature requests through appropriate channels

## Updates and Changes

This application is regularly updated with new features and improvements. Check with your administrator for:
- Version update notifications
- New feature announcements
- Breaking changes
- Scheduled maintenance windows

---

**Version**: 1.0.0
**Last Updated**: November 2025

For technical documentation, see `DEVELOPER_GUIDE.md`
