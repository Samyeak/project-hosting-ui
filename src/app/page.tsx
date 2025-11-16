'use client';

import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Typography, Spin, Progress } from 'antd';
import {
  CloudServerOutlined,
  ProjectOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  RiseOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import { getProjects, getClients, getDeployments, getUptimeStats } from '@/lib/api';
import { UptimeStats } from '@/lib/types';

const { Title, Paragraph } = Typography;

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
      <div className="mb-8 animate-fade-in">
        <Title level={2} style={{ marginBottom: 8, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
          Dashboard
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#64748b' }}>
          Welcome back! Here's an overview of your projects and deployments.
        </Paragraph>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24} sm={8}>
              <Card
                className="modern-card stat-card animate-fade-in"
                bordered={false}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 500 }}>Total Projects</span>}
                  value={projectCount}
                  prefix={<ProjectOutlined style={{ fontSize: '24px', marginRight: '8px' }} />}
                  valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 700 }}
                />
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                  <RiseOutlined style={{ marginRight: '4px' }} />
                  Active and managed
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                className="modern-card stat-card animate-fade-in"
                bordered={false}
                style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  color: 'white',
                  animationDelay: '0.1s'
                }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 500 }}>Total Clients</span>}
                  value={clientCount}
                  prefix={<TeamOutlined style={{ fontSize: '24px', marginRight: '8px' }} />}
                  valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 700 }}
                />
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                  <RiseOutlined style={{ marginRight: '4px' }} />
                  Currently registered
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                className="modern-card stat-card animate-fade-in"
                bordered={false}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  animationDelay: '0.2s'
                }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 500 }}>Total Deployments</span>}
                  value={deploymentCount}
                  prefix={<CloudServerOutlined style={{ fontSize: '24px', marginRight: '8px' }} />}
                  valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 700 }}
                />
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                  <RiseOutlined style={{ marginRight: '4px' }} />
                  Live and running
                </div>
              </Card>
            </Col>
          </Row>

          {uptimeStats && (
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="mt-10 mb-6">
                <Title level={3} style={{ marginBottom: 8, fontWeight: 600 }}>
                  Uptime Monitoring
                </Title>
                <Paragraph style={{ color: '#64748b' }}>
                  Real-time monitoring status of your deployments
                </Paragraph>
              </div>
              <Row gutter={[24, 24]} className="mt-4">
                <Col xs={24} sm={6}>
                  <Card className="modern-card" bordered={false}>
                    <Statistic
                      title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Total Monitors</span>}
                      value={uptimeStats.totalMonitors}
                      prefix={<DashboardOutlined style={{ fontSize: '20px', color: '#4f46e5' }} />}
                      valueStyle={{ color: '#1e293b', fontSize: '28px', fontWeight: 600 }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card className="modern-card" bordered={false}>
                    <Statistic
                      title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Up</span>}
                      value={uptimeStats.upMonitors}
                      prefix={<CheckCircleOutlined style={{ fontSize: '20px', color: '#10b981' }} />}
                      valueStyle={{ color: '#10b981', fontSize: '28px', fontWeight: 600 }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card className="modern-card" bordered={false}>
                    <Statistic
                      title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Down</span>}
                      value={uptimeStats.downMonitors}
                      prefix={<CloseCircleOutlined style={{ fontSize: '20px', color: '#ef4444' }} />}
                      valueStyle={{ color: '#ef4444', fontSize: '28px', fontWeight: 600 }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card className="modern-card" bordered={false}>
                    <Statistic
                      title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Average Uptime</span>}
                      value={uptimeStats.avgUptime.toFixed(2)}
                      suffix="%"
                      valueStyle={{
                        color: uptimeStats.avgUptime >= 99.5 ? '#10b981' :
                               uptimeStats.avgUptime >= 95 ? '#f59e0b' : '#ef4444',
                        fontSize: '28px',
                        fontWeight: 600
                      }}
                    />
                    <Progress
                      percent={uptimeStats.avgUptime}
                      strokeColor={{
                        '0%': uptimeStats.avgUptime >= 99.5 ? '#10b981' :
                              uptimeStats.avgUptime >= 95 ? '#f59e0b' : '#ef4444',
                        '100%': uptimeStats.avgUptime >= 99.5 ? '#059669' :
                                uptimeStats.avgUptime >= 95 ? '#d97706' : '#dc2626'
                      }}
                      showInfo={false}
                      className="mt-3"
                      strokeWidth={8}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}