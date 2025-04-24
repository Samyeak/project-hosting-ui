'use client';

import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Typography, Spin } from 'antd';
import { CloudServerOutlined, ProjectOutlined, TeamOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import { getProjects, getClients, getDeployments } from '@/lib/api';

const { Title } = Typography;

export default function Home() {
  const [projectCount, setProjectCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [deploymentCount, setDeploymentCount] = useState(0);
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
      )}
    </MainLayout>
  );
}