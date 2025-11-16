// components/uptime/UptimePercentageBar.tsx
'use client';

import React from 'react';
import { Progress, Tooltip } from 'antd';

interface UptimePercentageBarProps {
  percentage: number;
  showInfo?: boolean;
  size?: 'small' | 'default';
}

const UptimePercentageBar: React.FC<UptimePercentageBarProps> = ({
  percentage,
  showInfo = true,
  size = 'default'
}) => {
  const getStrokeColor = () => {
    if (percentage >= 99.5) return '#52c41a'; // green
    if (percentage >= 95) return '#faad14'; // orange
    return '#ff4d4f'; // red
  };

  const getStatus = () => {
    if (percentage >= 99.5) return 'Excellent';
    if (percentage >= 99) return 'Good';
    if (percentage >= 95) return 'Fair';
    return 'Poor';
  };

  return (
    <Tooltip title={`Uptime: ${percentage.toFixed(2)}% - ${getStatus()}`}>
      <Progress
        percent={percentage}
        strokeColor={getStrokeColor()}
        showInfo={showInfo}
        size={size}
        format={(percent) => `${percent?.toFixed(2)}%`}
      />
    </Tooltip>
  );
};

export default UptimePercentageBar;
