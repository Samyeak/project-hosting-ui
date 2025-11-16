// components/uptime/UptimeStatusBadge.tsx
'use client';

import React from 'react';
import { Badge, Tag, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, ToolOutlined } from '@ant-design/icons';
import { UptimeMonitor } from '@/lib/types';

interface UptimeStatusBadgeProps {
  monitor?: UptimeMonitor;
  showDetails?: boolean;
}

const UptimeStatusBadge: React.FC<UptimeStatusBadgeProps> = ({ monitor, showDetails = false }) => {
  if (!monitor) {
    return <Tag color="default">No Monitor</Tag>;
  }

  const getStatusConfig = (): {
    color: 'success' | 'error' | 'warning' | 'processing' | 'default';
    icon: React.ReactNode;
    text: string;
  } => {
    switch (monitor.status) {
      case 'up':
        return {
          color: 'success' as const,
          icon: <CheckCircleOutlined />,
          text: 'Up',
        };
      case 'down':
        return {
          color: 'error' as const,
          icon: <CloseCircleOutlined />,
          text: 'Down',
        };
      case 'maintenance':
        return {
          color: 'warning' as const,
          icon: <ToolOutlined />,
          text: 'Maintenance',
        };
      case 'pending':
      default:
        return {
          color: 'processing' as const,
          icon: <ClockCircleOutlined />,
          text: 'Pending',
        };
    }
  };

  const config = getStatusConfig();

  const tooltipContent = monitor.uptimePercentage !== undefined ? (
    <div>
      <div>Status: {config.text}</div>
      <div>Uptime: {monitor.uptimePercentage.toFixed(2)}%</div>
      {monitor.avgResponseTime && (
        <div>Avg Response: {monitor.avgResponseTime}ms</div>
      )}
      {monitor.lastCheck && (
        <div>Last Check: {new Date(monitor.lastCheck).toLocaleString()}</div>
      )}
    </div>
  ) : config.text;

  if (showDetails && monitor.uptimePercentage !== undefined) {
    return (
      <Tooltip title={tooltipContent}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge status={config.color} text={config.text} />
          <span style={{ fontSize: '12px', color: '#888' }}>
            {monitor.uptimePercentage.toFixed(2)}%
          </span>
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltipContent}>
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    </Tooltip>
  );
};

export default UptimeStatusBadge;
