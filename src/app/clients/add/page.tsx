
// app/clients/add/page.tsx
'use client';

import React from 'react';
import { Typography, Card } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import ClientForm from '@/components/clients/ClientForm';
import { createClient } from '@/lib/api';
import { CreateClient } from '@/lib/types';

const { Title } = Typography;

export default function AddClientPage() {
  const handleSubmit = async (data: CreateClient) => {
    await createClient(data);
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <Title level={3}>Add New Client</Title>
      </div>
      
      <Card>
        <ClientForm onSubmit={handleSubmit} />
      </Card>
    </MainLayout>
  );
}
