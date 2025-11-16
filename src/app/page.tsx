'use client';

import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Typography, Spin, Progress } from 'antd';
import {
  CloudServerOutlined,
  ProjectOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import { getProjects, getClients, getDeployments, getUptimeStats } from '@/lib/api';
import { UptimeStats } from '@/lib/types';

const { Title } = Typography;

export default function Home() {
  const [projectCount, setProjectCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [deploymentCount, setDeploymentCount] = useState(0);
  const [uptimeStats, setUptimeStats] = useState<UptimeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [projects, clients, deployments] = await Promise.all([
          getProjects(),
          getClients(),
          getDeployments()
        ]);

        setProjectCount(projects.length);
        setClientCount(clients.length);
        setDeploymentCount(deployments.length);

        // Fetch uptime stats (non-blocking)
        try {
          const stats = await getUptimeStats();
          setUptimeStats(stats);
        } catch (uptimeError) {
          console.log('Uptime stats not available:', uptimeError);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <MainLayout>
      <Title level={2}>Dashboard</Title>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={16} className="mt-6">
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Projects"
                  value={projectCount}
                  prefix={<ProjectOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Clients"
                  value={clientCount}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Deployments"
                  value={deploymentCount}
                  prefix={<CloudServerOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {uptimeStats && (
            <>
              <Title level={3} className="mt-8">Uptime Monitoring</Title>
              <Row gutter={16} className="mt-4">
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Monitors"
                      value={uptimeStats.totalMonitors}
                      prefix={<DashboardOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Up"
                      value={uptimeStats.upMonitors}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Down"
                      value={uptimeStats.downMonitors}
                      prefix={<CloseCircleOutlined />}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Average Uptime"
                      value={uptimeStats.avgUptime.toFixed(2)}
                      suffix="%"
                      valueStyle={{
                        color: uptimeStats.avgUptime >= 99.5 ? '#52c41a' :
                               uptimeStats.avgUptime >= 95 ? '#faad14' : '#ff4d4f'
                      }}
                    />
                    <Progress
                      percent={uptimeStats.avgUptime}
                      strokeColor={
                        uptimeStats.avgUptime >= 99.5 ? '#52c41a' :
                        uptimeStats.avgUptime >= 95 ? '#faad14' : '#ff4d4f'
                      }
                      showInfo={false}
                      className="mt-2"
                    />
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </MainLayout>
  );
}