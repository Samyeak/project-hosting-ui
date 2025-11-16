// components/layout/MainLayout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Drawer } from 'antd';
import Header from './Header';
import Sidebar from './Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleCollapsed = () => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const closeMobileDrawer = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <ProtectedRoute>
      <Layout className="min-h-screen" style={{ background: 'var(--background)' }}>
        {/* Desktop Sidebar */}
        {!isMobile && <Sidebar collapsed={collapsed} />}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            placement="left"
            onClose={closeMobileDrawer}
            open={mobileDrawerOpen}
            bodyStyle={{ padding: 0 }}
            width={240}
            styles={{ header: { display: 'none' } }}
          >
            <Sidebar collapsed={false} onMenuClick={closeMobileDrawer} />
          </Drawer>
        )}

        <Layout>
          <Header
            collapsed={collapsed}
            toggleCollapsed={toggleCollapsed}
            isMobile={isMobile}
          />
          <Content
            className="animate-fade-in"
            style={{
              background: 'transparent',
              minHeight: 'calc(100vh - 120px)',
              margin: isMobile ? '12px' : '24px',
              padding: isMobile ? '12px' : '24px'
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