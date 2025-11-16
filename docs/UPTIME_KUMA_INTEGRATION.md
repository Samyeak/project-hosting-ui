# Uptime Kuma Integration

This document describes the Uptime Kuma integration in the Project Hosting Manager application.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup](#setup)
- [Backend Requirements](#backend-requirements)
- [Frontend Components](#frontend-components)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## Overview

The Uptime Kuma integration allows you to automatically monitor the uptime and availability of your deployments. [Uptime Kuma](https://github.com/louislam/uptime-kuma) is a self-hosted monitoring tool that provides real-time uptime tracking, response time monitoring, and alerting capabilities.

## Features

- **Automatic Monitor Creation**: Automatically create monitors in Uptime Kuma for deployments with domain URLs
- **Real-time Status Display**: View uptime status and percentage directly in the deployment list
- **Dashboard Statistics**: See overall uptime metrics in the dashboard
- **Manual Sync**: Manually sync deployment monitors with Uptime Kuma
- **Settings Management**: Configure Uptime Kuma connection settings via UI
- **Connection Testing**: Test connectivity to your Uptime Kuma instance

## Setup

### 1. Install Uptime Kuma

First, set up an Uptime Kuma instance. You can use Docker:

```bash
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

Or follow the [official installation guide](https://github.com/louislam/uptime-kuma#-how-to-install).

### 2. Configure in the Application

1. Navigate to **Settings > Uptime Kuma** in the sidebar
2. Enter your Uptime Kuma base URL (e.g., `https://uptime.example.com`)
3. Optionally enter an API key if your instance requires authentication
4. Enable the integration by toggling the switch
5. Click "Test Connection" to verify the settings
6. Click "Save Settings" to save your configuration

### 3. Backend Implementation

Implement the required backend endpoints (see [Backend Requirements](#backend-requirements) below).

### 4. Start Monitoring

Once configured:
- Existing deployments with domain URLs can be synced using the sync button
- New deployments will automatically create monitors in Uptime Kuma
- Uptime statistics will appear in the dashboard and deployment list

## Backend Requirements

Your backend should implement the following endpoints to integrate with Uptime Kuma:

### Settings Endpoints

```
GET  /api/uptime/settings
PUT  /api/uptime/settings
POST /api/uptime/test-connection
```

### Monitor Management Endpoints

```
GET    /api/uptime/monitors              # Get all monitors
GET    /api/uptime/monitors/:id          # Get a specific monitor
POST   /api/uptime/monitors              # Create a new monitor
PUT    /api/uptime/monitors/:id          # Update a monitor
DELETE /api/uptime/monitors/:id          # Delete a monitor
```

### Deployment Integration Endpoints

```
GET  /api/deployments/with-uptime        # Get deployments with uptime data
POST /api/uptime/sync/:deploymentId     # Sync deployment with Uptime Kuma
GET  /api/uptime/stats                   # Get uptime statistics
```

### Example Backend Implementation (Node.js/Express)

```javascript
// Uptime Kuma SDK or HTTP client
const axios = require('axios');

// Get settings from database
app.get('/api/uptime/settings', async (req, res) => {
  const settings = await UptimeSettings.findOne();
  res.json(settings || {
    baseUrl: '',
    enabled: false
  });
});

// Update settings
app.put('/api/uptime/settings', async (req, res) => {
  const settings = await UptimeSettings.findOneAndUpdate(
    {},
    req.body,
    { upsert: true, new: true }
  );
  res.json(settings);
});

// Create monitor in Uptime Kuma
app.post('/api/uptime/monitors', async (req, res) => {
  const settings = await UptimeSettings.findOne();

  // Call Uptime Kuma API
  const monitor = await axios.post(
    `${settings.baseUrl}/api/monitors`,
    {
      name: req.body.name,
      url: req.body.url,
      type: req.body.type || 'http',
      interval: req.body.interval || 60
    },
    {
      headers: {
        'Authorization': `Bearer ${settings.apiKey}`
      }
    }
  );

  // Save monitor reference in your database
  await Deployment.findByIdAndUpdate(
    req.body.deploymentId,
    { monitorId: monitor.data.id }
  );

  res.json(monitor.data);
});

// Sync deployment with Uptime Kuma
app.post('/api/uptime/sync/:deploymentId', async (req, res) => {
  const deployment = await Deployment.findById(req.params.deploymentId);
  const settings = await UptimeSettings.findOne();

  if (!deployment.monitorId) {
    // Create new monitor
    const monitor = await createMonitorInUptimeKuma(deployment, settings);
    deployment.monitorId = monitor.id;
    await deployment.save();
    return res.json(monitor);
  }

  // Update existing monitor
  const monitor = await updateMonitorInUptimeKuma(deployment, settings);
  res.json(monitor);
});

// Get deployments with uptime data
app.get('/api/deployments/with-uptime', async (req, res) => {
  const deployments = await Deployment.find();
  const settings = await UptimeSettings.findOne();

  if (!settings?.enabled) {
    return res.json(deployments.map(d => ({ ...d.toJSON(), monitor: null })));
  }

  // Fetch monitor data from Uptime Kuma for each deployment
  const deploymentsWithUptime = await Promise.all(
    deployments.map(async (deployment) => {
      if (!deployment.monitorId) {
        return { ...deployment.toJSON(), monitor: null };
      }

      try {
        const monitor = await axios.get(
          `${settings.baseUrl}/api/monitors/${deployment.monitorId}`,
          { headers: { 'Authorization': `Bearer ${settings.apiKey}` } }
        );

        return {
          ...deployment.toJSON(),
          monitor: monitor.data
        };
      } catch (error) {
        return { ...deployment.toJSON(), monitor: null };
      }
    })
  );

  res.json(deploymentsWithUptime);
});

// Get uptime statistics
app.get('/api/uptime/stats', async (req, res) => {
  const settings = await UptimeSettings.findOne();

  if (!settings?.enabled) {
    return res.json({
      totalMonitors: 0,
      upMonitors: 0,
      downMonitors: 0,
      pausedMonitors: 0,
      avgUptime: 0
    });
  }

  // Fetch monitors from Uptime Kuma
  const monitors = await axios.get(
    `${settings.baseUrl}/api/monitors`,
    { headers: { 'Authorization': `Bearer ${settings.apiKey}` } }
  );

  const stats = {
    totalMonitors: monitors.data.length,
    upMonitors: monitors.data.filter(m => m.status === 'up').length,
    downMonitors: monitors.data.filter(m => m.status === 'down').length,
    pausedMonitors: monitors.data.filter(m => !m.active).length,
    avgUptime: monitors.data.reduce((sum, m) => sum + (m.uptimePercentage || 0), 0) / monitors.data.length || 0
  };

  res.json(stats);
});
```

## Frontend Components

### UptimeStatusBadge

Displays the current status of a monitor with color-coded badges and tooltips.

```tsx
import UptimeStatusBadge from '@/components/uptime/UptimeStatusBadge';

<UptimeStatusBadge monitor={deployment.monitor} showDetails />
```

**Props:**
- `monitor?: UptimeMonitor` - The monitor object
- `showDetails?: boolean` - Whether to show detailed uptime percentage

### UptimePercentageBar

Displays uptime percentage as a progress bar with color coding.

```tsx
import UptimePercentageBar from '@/components/uptime/UptimePercentageBar';

<UptimePercentageBar
  percentage={monitor.uptimePercentage}
  size="small"
  showInfo={false}
/>
```

**Props:**
- `percentage: number` - The uptime percentage (0-100)
- `showInfo?: boolean` - Whether to show percentage text
- `size?: 'small' | 'default'` - Size of the progress bar

## Usage

### Viewing Uptime Status

1. **Dashboard**: View overall uptime statistics at the top of the dashboard
   - Total Monitors
   - Monitors Up/Down
   - Average Uptime Percentage

2. **Deployment List**: Each deployment shows:
   - Uptime status badge (Up/Down/Pending/Maintenance)
   - Uptime percentage bar
   - Last check time (in tooltip)

### Syncing Monitors

To manually sync a deployment with Uptime Kuma:

1. Go to the Deployments page
2. Find the deployment you want to sync
3. Click the sync icon (⟳) in the Actions column
4. Wait for the sync to complete

The sync operation will:
- Create a new monitor if one doesn't exist
- Update the existing monitor if changes were made
- Fetch the latest uptime data

### Managing Settings

Navigate to **Settings > Uptime Kuma** to:
- Enable/disable the integration
- Update the Uptime Kuma URL
- Add or change the API key
- Test the connection

## API Endpoints

### Frontend API Functions

The frontend provides these API functions in `src/lib/api.ts`:

```typescript
// Monitor management
getUptimeMonitors(): Promise<UptimeMonitor[]>
getUptimeMonitor(id: number): Promise<UptimeMonitor>
createUptimeMonitor(monitor: CreateUptimeMonitor): Promise<UptimeMonitor>
updateUptimeMonitor(id: number, monitor: Partial<CreateUptimeMonitor>): Promise<UptimeMonitor>
deleteUptimeMonitor(id: number): Promise<void>

// Statistics and sync
getUptimeStats(): Promise<UptimeStats>
syncUptimeMonitor(deploymentId: number): Promise<UptimeMonitor>
getDeploymentsWithUptime(): Promise<DeploymentWithUptime[]>

// Settings
getUptimeSettings(): Promise<UptimeKumaSettings>
updateUptimeSettings(settings: UptimeKumaSettings): Promise<UptimeKumaSettings>
testUptimeConnection(settings: UptimeKumaSettings): Promise<{ success: boolean; message: string }>
```

## Troubleshooting

### Monitors Not Showing Up

1. **Check Settings**: Ensure Uptime Kuma integration is enabled in Settings
2. **Verify Connection**: Use the "Test Connection" button to verify connectivity
3. **Check Domain URLs**: Monitors are only created for deployments with `domainUrl` field populated
4. **Review Backend Logs**: Check your backend logs for API errors

### Uptime Percentage Not Displaying

1. **Sync Monitor**: Click the sync button to update the monitor data
2. **Check Monitor Status**: Ensure the monitor is active in Uptime Kuma
3. **Wait for First Check**: New monitors need at least one check cycle to show data

### Connection Test Failing

1. **Verify URL**: Ensure the Uptime Kuma URL is correct and accessible
2. **Check API Key**: If using authentication, verify the API key is correct
3. **Network Access**: Ensure your backend can reach the Uptime Kuma instance
4. **CORS/Firewall**: Check for CORS issues or firewall rules blocking access

### Statistics Not Appearing on Dashboard

1. **Enable Integration**: Make sure the Uptime Kuma integration is enabled
2. **Check Monitors**: Ensure at least one monitor has been created
3. **Backend Implementation**: Verify the `/api/uptime/stats` endpoint is working
4. **Console Errors**: Check browser console for API errors

## Types

### UptimeMonitor

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
```

### UptimeStats

```typescript
interface UptimeStats {
  totalMonitors: number;
  upMonitors: number;
  downMonitors: number;
  pausedMonitors: number;
  avgUptime: number;
}
```

### UptimeKumaSettings

```typescript
interface UptimeKumaSettings {
  id?: number;
  baseUrl: string;
  apiKey?: string;
  enabled: boolean;
}
```

## Security Considerations

1. **API Keys**: Store API keys securely in your backend, never expose them in the frontend
2. **HTTPS**: Always use HTTPS for Uptime Kuma in production
3. **Authentication**: Implement proper authentication for your backend endpoints
4. **Rate Limiting**: Consider rate limiting monitor creation to prevent abuse
5. **Validation**: Validate all URLs before creating monitors to prevent SSRF attacks

## Future Enhancements

Potential improvements for the integration:

- **Alert Integration**: Display Uptime Kuma alerts in the application
- **Historical Data**: Show uptime history charts
- **Bulk Sync**: Sync all deployments at once
- **Monitor Templates**: Create monitor templates with predefined settings
- **Notification Settings**: Configure notification preferences per deployment
- **Custom Intervals**: Allow custom monitoring intervals per deployment
- **Multi-Region Monitoring**: Support for multiple Uptime Kuma instances

---

For more information about Uptime Kuma, visit the [official documentation](https://github.com/louislam/uptime-kuma/wiki).
