// components/projects/ProjectList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography, Card, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, GithubOutlined } from '@ant-design/icons';
import { Project } from '@/lib/types';
import { getProjects, deleteProject } from '@/lib/api';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      message.error('Failed to fetch projects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id);
      message.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      message.error('Failed to delete project');
      console.error(error);
    }
  };

  const columns = [
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Name</span>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
          {text}
        </span>
      )
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Description</span>,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: '#64748b', fontSize: '13px' }}>
          {text || '-'}
        </span>
      )
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Git URL</span>,
      dataIndex: 'gitUrl',
      key: 'gitUrl',
      ellipsis: true,
      render: (text: string) => text ? (
        <a
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#4f46e5',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <GithubOutlined /> {text}
        </a>
      ) : <span style={{ color: '#94a3b8' }}>-</span>
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Created At</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => (
        <Tag
          color="blue"
          style={{
            borderRadius: '8px',
            fontSize: '12px',
            padding: '4px 12px',
            border: 'none',
            background: 'rgba(79, 70, 229, 0.1)',
            color: '#4f46e5'
          }}
        >
          {new Date(text).toLocaleDateString()}
        </Tag>
      )
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Actions</span>,
      key: 'actions',
      width: 120,
      render: (_: number, record: Project) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => router.push(`/projects/${record.id}/edit`)}
            style={{
              borderRadius: '8px',
              color: '#4f46e5',
              transition: 'all 0.3s ease'
            }}
          />
          <Popconfirm
            title="Delete this project?"
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
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <Title
            level={2}
            style={{
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700
            }}
          >
            Projects
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/projects/add')}
            size="large"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '10px',
              height: '44px',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Add Project
          </Button>
        </div>
        <Paragraph style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
          Manage your project repositories and configurations
        </Paragraph>
      </div>

      <Card
        className="modern-card"
        bordered={false}
        style={{ overflow: 'hidden' }}
      >
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} projects`,
            style: { marginTop: '20px' }
          }}
          style={{
            background: 'transparent'
          }}
        />
      </Card>
    </div>
  );
};

export default ProjectList;