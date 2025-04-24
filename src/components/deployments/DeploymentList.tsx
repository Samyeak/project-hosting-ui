
// components/deployments/DeploymentList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Deployment, Project, Client, DeploymentFilter } from '@/lib/types';
import { getDeployments, deleteDeployment, getProjects, getClients, getFilteredDeployments } from '@/lib/api';
import { useRouter } from 'next/navigation';
import StatusBadge from '../ui/StatusBadge';
import SearchBar from '../ui/SearchBar';

const { Title } = Typography;

const DeploymentList: React.FC = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [deploymentsData, projectsData, clientsData] = await Promise.all([
        getDeployments(),
        getProjects(),
        getClients()
      ]);
      setDeployments(deploymentsData);
      setProjects(projectsData);
      setClients(clientsData);
    } catch (error) {
      message.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values: DeploymentFilter) => {
    try {
      setSearching(true);
      const filteredDeployments = await getFilteredDeployments(values);
      setDeployments(filteredDeployments);
    } catch (error) {
      message.error('Failed to search deployments');
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDeployment(id);
      message.success('Deployment deleted successfully');
      fetchInitialData();
    } catch (error) {
      message.error('Failed to delete deployment');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Project',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <Tag>{text}</Tag>
    },
    {
      title: 'Environment',
      dataIndex: 'environment',
      key: 'environment',
      render: (text: string) => {
        let color = 'default';
        switch (text.toLowerCase()) {
          case 'production':
            color = 'red';
            break;
          case 'staging':
            color = 'orange';
            break;
          case 'uat':
            color = 'gold';
            break;
          case 'testing':
            color = 'blue';
            break;
          case 'development':
            color = 'green';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Hosting Platform',
      dataIndex: 'hostingPlatform',
      key: 'hostingPlatform',
      ellipsis: true,
    },
    {
      title: 'Domain',
      dataIndex: 'domainUrl',
      key: 'domainUrl',
      ellipsis: true,
      render: (text: string) => text ? 
        <a href={text} target="_blank" rel="noopener noreferrer">{text}</a> : '-'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => <StatusBadge status={text} />
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Deployment) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => router.push(`/deployments/${record.id}/edit`)}
          />
          <Popconfirm
            title="Delete this deployment?"
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

  const projectOptions = projects.map(p => ({ value: p.name, label: p.name }));
  const clientOptions = clients.map(c => ({ value: c.name, label: c.name }));
  const environmentOptions = [
    { value: 'Development', label: 'Development' },
    { value: 'Testing', label: 'Testing' },
    { value: 'Staging', label: 'Staging' },
    { value: 'UAT', label: 'UAT' },
    { value: 'Production', label: 'Production' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>Deployments</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => router.push('/deployments/add')}
        >
          Add Deployment
        </Button>
      </div>
      
      <SearchBar 
        onSearch={handleSearch}
        projectOptions={projectOptions}
        clientOptions={clientOptions}
        environmentOptions={environmentOptions}
        loading={searching}
      />
      
      <Table 
        columns={columns} 
        dataSource={deployments} 
        rowKey="id" 
        loading={loading}
      />
    </div>
  );
};

export default DeploymentList;