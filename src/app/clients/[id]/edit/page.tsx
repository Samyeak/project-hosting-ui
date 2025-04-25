
// app/clients/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Card, Spin, message } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import ClientForm from '@/components/clients/ClientForm';
import { getClient, updateClient } from '@/lib/api';
import { Client, UpdateClient } from '@/lib/types';

const { Title } = Typography;

export default function EditClientPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClient = async () => {
      const { id } = await params;
      try {
        setLoading(true);
        const data = await getClient(parseInt(id));
        setClient(data);
      } catch (error) {
        message.error('Failed to fetch client details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [params]);

  const handleSubmit = async (data: UpdateClient) => {
      const { id } = await params;
      await updateClient(parseInt(id), data);
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <Title level={3}>Edit Client</Title>
      </div>
      
      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          client && <ClientForm initialValues={client} onSubmit={handleSubmit} />
        )}
      </Card>
    </MainLayout>
  );
}