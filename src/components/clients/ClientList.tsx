
// components/clients/ClientList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography, Card, Tag, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Client } from '@/lib/types';
import { getClients, deleteClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Client</span>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              width: 36,
              height: 36
            }}
          />
          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
            {text}
          </span>
        </div>
      )
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Contact Info</span>,
      dataIndex: 'contactInfo',
      key: 'contactInfo',
      ellipsis: true,
      render: (text: string) => text ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
          <MailOutlined style={{ color: '#06b6d4' }} />
          {text}
        </div>
      ) : <span style={{ color: '#94a3b8' }}>-</span>
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Notes</span>,
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: '#64748b', fontSize: '13px' }}>
          {text || '-'}
        </span>
      )
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Actions</span>,
      key: 'actions',
      width: 120,
      render: (_: number, record: Client) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => router.push(`/clients/${record.id}/edit`)}
            style={{
              borderRadius: '8px',
              color: '#06b6d4',
              transition: 'all 0.3s ease'
            }}
          />
          <Popconfirm
            title="Delete this client?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              style={{
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: isMobile ? '16px' : '32px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '12px' : '0',
            marginBottom: '12px'
          }}
        >
          <Title
            level={2}
            style={{
              margin: 0,
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: isMobile ? '24px' : '32px'
            }}
          >
            Clients
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/clients/add')}
            size={isMobile ? 'middle' : 'large'}
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              border: 'none',
              borderRadius: '10px',
              height: isMobile ? '36px' : '44px',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            Add Client
          </Button>
        </div>
        <Paragraph style={{ fontSize: isMobile ? '13px' : '15px', color: '#64748b', margin: 0 }}>
          Manage your client information and contacts
        </Paragraph>
      </div>

      <Card
        className="modern-card"
        bordered={false}
        style={{ overflow: 'hidden' }}
      >
        <Table
          columns={columns}
          dataSource={clients}
          rowKey="id"
          loading={loading}
          scroll={isMobile ? { x: 600 } : undefined}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} clients`,
            style: { marginTop: '20px' },
            size: isMobile ? 'small' : 'default'
          }}
          style={{
            background: 'transparent'
          }}
        />
      </Card>
    </div>
  );
  };

  export default ClientList;