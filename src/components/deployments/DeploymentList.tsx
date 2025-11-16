// components/deployments/DeploymentList.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Typography,
  Tag,
  Tooltip,
  Card,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SyncOutlined, CloudServerOutlined, LinkOutlined } from "@ant-design/icons";
import { DeploymentWithUptime, Project, Client, DeploymentFilter } from "@/lib/types";
import {
  getDeploymentsWithUptime,
  deleteDeployment,
  getProjects,
  getClients,
  getFilteredDeployments,
  syncUptimeMonitor,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import StatusBadge from "../ui/StatusBadge";
import SearchBar from "../ui/SearchBar";
import UptimeStatusBadge from "../uptime/UptimeStatusBadge";
import UptimePercentageBar from "../uptime/UptimePercentageBar";

const { Title, Paragraph } = Typography;

const DeploymentList: React.FC = () => {
  const [deployments, setDeployments] = useState<DeploymentWithUptime[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [syncing, setSyncing] = useState<number | null>(null);
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
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [deploymentsData, projectsData, clientsData] = await Promise.all([
        getDeploymentsWithUptime(),
        getProjects(),
        getClients(),
      ]);
      setDeployments(deploymentsData);
      setProjects(projectsData);
      setClients(clientsData);
    } catch (error) {
      message.error("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncMonitor = async (deploymentId: number) => {
    try {
      setSyncing(deploymentId);
      await syncUptimeMonitor(deploymentId);
      message.success("Monitor synced successfully");
      fetchInitialData();
    } catch (error) {
      message.error("Failed to sync monitor");
      console.error(error);
    } finally {
      setSyncing(null);
    }
  };

  const handleSearch = async (values: DeploymentFilter) => {
    try {
      setSearching(true);
      const filteredDeployments = await getFilteredDeployments(values);
      setDeployments(filteredDeployments);
    } catch (error) {
      message.error("Failed to search deployments");
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDeployment(id);
      message.success("Deployment deleted successfully");
      fetchInitialData();
    } catch (error) {
      message.error("Failed to delete deployment");
      console.error(error);
    }
  };

  const columns = [
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Project</span>,
      dataIndex: "projectName",
      key: "projectName",
      render: (text: string) => (
        <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
          {text}
        </span>
      )
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Client</span>,
      dataIndex: "clientName",
      key: "clientName",
      render: (text: string) => (
        <span style={{ color: '#64748b', fontSize: '13px' }}>
          {text}
        </span>
      )
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Type</span>,
      dataIndex: "type",
      key: "type",
      render: (text: string) => (
        <Tag
          style={{
            borderRadius: '8px',
            fontSize: '12px',
            padding: '4px 12px',
            border: 'none',
            background: 'rgba(79, 70, 229, 0.1)',
            color: '#4f46e5'
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Environment</span>,
      dataIndex: "environment",
      key: "environment",
      render: (text: string) => {
        const envConfig: Record<string, { gradient: string; color: string }> = {
          production: { gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#ef4444' },
          staging: { gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#f59e0b' },
          uat: { gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#f59e0b' },
          testing: { gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#06b6d4' },
          development: { gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#10b981' },
        };
        const config = envConfig[text.toLowerCase()] || { gradient: 'rgba(148, 163, 184, 0.1)', color: '#64748b' };

        return (
          <Tag
            style={{
              borderRadius: '8px',
              fontSize: '12px',
              padding: '4px 12px',
              border: 'none',
              background: config.gradient,
              color: 'white',
              fontWeight: 600
            }}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Hosting Platform</span>,
      dataIndex: "hostingPlatform",
      key: "hostingPlatform",
      ellipsis: true,
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CloudServerOutlined style={{ color: '#10b981' }} />
          <span style={{ color: '#64748b', fontSize: '13px' }}>{text}</span>
        </div>
      )
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Domain</span>,
      dataIndex: "domainUrl",
      key: "domainUrl",
      width: "30%",
      render: (text: string) => {
        if (text) {
          return text.split(",").map((item) => {
            return (
              <a
                href={item}
                key={item}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#4f46e5',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '4px'
                }}
              >
                <LinkOutlined /> {item}
              </a>
            );
          });
        } else {
          return <span style={{ color: '#94a3b8' }}>-</span>;
        }
      },
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (text: string) => <StatusBadge status={text} />,
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Uptime</span>,
      key: "uptime",
      width: 150,
      render: (_: unknown, record: DeploymentWithUptime) => (
        <UptimeStatusBadge monitor={record.monitor} showDetails />
      ),
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Uptime %</span>,
      key: "uptimePercentage",
      width: 150,
      render: (_: unknown, record: DeploymentWithUptime) => {
        if (record.monitor?.uptimePercentage !== undefined) {
          return (
            <UptimePercentageBar
              percentage={record.monitor.uptimePercentage}
              size="small"
              showInfo={false}
            />
          );
        }
        return <span style={{ color: '#94a3b8' }}>-</span>;
      },
    },
    {
      title: <span style={{ fontWeight: 600, fontSize: '14px' }}>Actions</span>,
      key: "actions",
      width: 140,
      render: (_: number, record: DeploymentWithUptime) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => router.push(`/deployments/${record.id}/edit`)}
            style={{
              borderRadius: '8px',
              color: '#10b981',
              transition: 'all 0.3s ease'
            }}
          />
          {record.domainUrl && (
            <Tooltip title="Sync with Uptime Kuma">
              <Button
                type="text"
                icon={<SyncOutlined />}
                onClick={() => handleSyncMonitor(record.id)}
                loading={syncing === record.id}
                style={{
                  borderRadius: '8px',
                  color: '#06b6d4',
                  transition: 'all 0.3s ease'
                }}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Delete this deployment?"
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
      ),
    },
  ];

  const projectOptions = projects.map((p) => ({
    value: p.name,
    label: p.name,
  }));
  const clientOptions = clients.map((c) => ({ value: c.name, label: c.name }));
  const environmentOptions = [
    { value: "Development", label: "Development" },
    { value: "Testing", label: "Testing" },
    { value: "Staging", label: "Staging" },
    { value: "UAT", label: "UAT" },
    { value: "Production", label: "Production" },
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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: isMobile ? '24px' : '32px'
            }}
          >
            Deployments
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/deployments/add")}
            size={isMobile ? 'middle' : 'large'}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '10px',
              height: isMobile ? '36px' : '44px',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            Add Deployment
          </Button>
        </div>
        <Paragraph style={{ fontSize: isMobile ? '13px' : '15px', color: '#64748b', margin: 0 }}>
          Monitor and manage your deployment environments
        </Paragraph>
      </div>

      <Card
        className="modern-card"
        bordered={false}
        style={{ marginBottom: isMobile ? '16px' : '24px' }}
      >
        <SearchBar
          onSearch={handleSearch}
          projectOptions={projectOptions}
          clientOptions={clientOptions}
          environmentOptions={environmentOptions}
          loading={searching}
        />
      </Card>

      <Card
        className="modern-card"
        bordered={false}
        style={{ overflow: 'hidden' }}
      >
        <Table
          columns={columns}
          dataSource={deployments}
          rowKey="id"
          loading={loading}
          scroll={isMobile ? { x: 1200 } : undefined}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} deployments`,
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

export default DeploymentList;
