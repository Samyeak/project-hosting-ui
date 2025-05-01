
// app/deployments/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Card, Spin, message } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import DeploymentForm from '@/components/deployments/DeploymentForm';
import { getDeployment, updateDeployment } from '@/lib/api';
import { Deployment, UpdateDeployment } from '@/lib/types';

const { Title } = Typography;

export default function EditDeploymentPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeployment = async () => {
        const {id} = await params;
      try {
        setLoading(true);
        const data = await getDeployment(parseInt(id));
        setDeployment(data);
      } catch (error) {
        message.error('Failed to fetch deployment details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeployment();
  }, [params]);

  const handleSubmit = async (data: UpdateDeployment) => {
        const {id} = await params;
        await updateDeployment(parseInt(id), data);
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <Title level={3}>Edit Deployment</Title>
      </div>
      
      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          deployment && <DeploymentForm initialValues={deployment} onSubmit={handleSubmit} />
        )}
      </Card>
    </MainLayout>
  );
}

export const runtime = 'edge';
