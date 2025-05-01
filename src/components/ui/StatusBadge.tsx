// components/ui/StatusBadge.tsx
import React from 'react';
import { Tag } from 'antd';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let color = 'default';
  
  switch (status?.toLowerCase()) {
    case 'active':
    case 'online':
    case 'success':
      color = 'green';
      break;
    case 'pending':
    case 'processing':
      color = 'blue';
      break;
    case 'inactive':
    case 'offline':
      color = 'orange';
      break;
    case 'error':
    case 'failed':
      color = 'red';
      break;
    default:
      color = 'default';
  }
  
  return <Tag color={color}>{status || 'Unknown'}</Tag>;
};

export default StatusBadge;