// components/projects/ProjectList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Project } from '@/lib/types';
import { getProjects, deleteProject } from '@/lib/api';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Git URL',
      dataIndex: 'gitUrl',
      key: 'gitUrl',
      ellipsis: true,
      render: (text: string) => text ? 
        <a href={text} target="_blank" rel="noopener noreferrer">{text}</a> : '-'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Project) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => router.push(`/projects/${record.id}/edit`)}
          />
          <Popconfirm
            title="Delete this project?"
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
        <Title level={3}>Projects</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => router.push('/projects/add')}
        >
          Add Project
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={projects} 
        rowKey="id" 
        loading={loading}
      />
    </div>
  );
};

export default ProjectList;