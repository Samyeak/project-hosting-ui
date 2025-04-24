
// app/deployments/add/page.tsx
'use client';

import React from 'react';
import { Typography, Card } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import DeploymentForm from '@/components/deployments/DeploymentForm';
import { createDeployment } from '@/lib/api';
import { CreateDeployment } from '@/lib/types';

const { Title } = Typography;

export default function AddDeploymentPage() {
  const handleSubmit = async (data: CreateDeployment) => {
    await createDeployment(data);
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <Title level={3}>Add New Deployment</Title>
      </div>
      
      <Card>
        <DeploymentForm onSubmit={handleSubmit} />
      </Card>
    </MainLayout>
  );
}
