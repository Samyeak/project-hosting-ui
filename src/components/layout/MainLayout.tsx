// components/layout/MainLayout.tsx
'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sidebar from './Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ProtectedRoute>
      <Layout className="min-h-screen" style={{ background: 'var(--background)' }}>
        <Sidebar collapsed={collapsed} />
        <Layout>
          <Header collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
          <Content
            className="m-6 p-6 animate-fade-in"
            style={{
              background: 'transparent',
              minHeight: 'calc(100vh - 120px)'
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
};

export default MainLayout;