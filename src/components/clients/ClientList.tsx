
// components/clients/ClientList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Client } from '@/lib/types';
import { getClients, deleteClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      setClients(data);
    } catch (error) {
      message.error('Failed to fetch clients');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClient(id);
      message.success('Client deleted successfully');
      fetchClients();
    } catch (error) {
      message.error('Failed to delete client');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact Info',
      dataIndex: 'contactInfo',
      key: 'contactInfo',
      ellipsis: true,},
      {
        title: 'Notes',
        dataIndex: 'notes',
        key: 'notes',
        ellipsis: true,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: Client) => (
          <Space size="small">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => router.push(`/clients/${record.id}/edit`)}
            />
            <Popconfirm
              title="Delete this client?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        )
      }
    ];
  
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>Clients</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => router.push('/clients/add')}
          >
            Add Client
          </Button>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={clients} 
          rowKey="id" 
          loading={loading}
        />
      </div>
    );
  };
  
  export default ClientList;