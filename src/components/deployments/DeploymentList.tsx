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
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";
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

const { Title } = Typography;

const DeploymentList: React.FC = () => {
  const [deployments, setDeployments] = useState<DeploymentWithUptime[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [syncing, setSyncing] = useState<number | null>(null);
  const router = useRouter();

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
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Environment",
      dataIndex: "environment",
      key: "environment",
      render: (text: string) => {
        let color = "default";
        switch (text.toLowerCase()) {
          case "production":
            color = "red";
            break;
          case "staging":
            color = "orange";
            break;
          case "uat":
            color = "gold";
            break;
          case "testing":
            color = "blue";
            break;
          case "development":
            color = "green";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Hosting Platform",
      dataIndex: "hostingPlatform",
      key: "hostingPlatform",
      ellipsis: true,
    },
    {
      title: "Domain",
      dataIndex: "domainUrl",
      key: "domainUrl",
      width: "30%",

      // ellipsis: true,
      render: (text: string) => {
        if (text) {
          return text.split(",").map((item) => {
            return (
              <a
                href={item}
                key={item}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item}
              </a>
            );
          });
        } else {
          return "-";
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => <StatusBadge status={text} />,
    },
    {
      title: "Uptime",
      key: "uptime",
      width: 150,
      render: (_: unknown, record: DeploymentWithUptime) => (
        <UptimeStatusBadge monitor={record.monitor} showDetails />
      ),
    },
    {
      title: "Uptime %",
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
        return <span style={{ color: '#999' }}>-</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: number, record: DeploymentWithUptime) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => router.push(`/deployments/${record.id}/edit`)}
          />
          {record.domainUrl && (
            <Tooltip title="Sync with Uptime Kuma">
              <Button
                icon={<SyncOutlined />}
                onClick={() => handleSyncMonitor(record.id)}
                loading={syncing === record.id}
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
            <Button danger icon={<DeleteOutlined />} />
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>Deployments</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/deployments/add")}
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
