// components/layout/Header.tsx
'use client';

import React from 'react';
import { Layout, Button, Typography, Avatar, Dropdown, Space } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, LogoutOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ collapsed, toggleCollapsed, isMobile = false }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  return (
    <AntHeader
      className="flex justify-between items-center animate-slide-in"
      style={{
        background: 'var(--card-bg)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        height: isMobile ? '64px' : '72px',
        padding: isMobile ? '0 12px' : '0 24px'
      }}
    >
      <div className="flex items-center" style={{ gap: isMobile ? '8px' : '16px' }}>
        <Button
          type="text"
          icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
          onClick={toggleCollapsed}
          className="modern-button"
          style={{
            width: isMobile ? 36 : 42,
            height: isMobile ? 36 : 42,
            borderRadius: '10px',
            fontSize: isMobile ? '16px' : '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        />
        <Title
          level={4}
          className="m-0"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: isMobile ? '16px' : '20px'
          }}
        >
          {isMobile ? 'PHM' : 'Project Hosting Manager'}
        </Title>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px' }}>
        {user && (
          <>
            <Button
              type="text"
              icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              style={{
                width: isMobile ? 36 : 42,
                height: isMobile ? 36 : 42,
                borderRadius: '10px',
                fontSize: isMobile ? '16px' : '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                color: theme === 'dark' ? '#fbbf24' : '#667eea'
              }}
            />
            <Dropdown menu={{ items }} placement="bottomRight" arrow>
              <div
                className="cursor-pointer"
                style={{
                  padding: isMobile ? '6px 10px' : '8px 16px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Space size={isMobile ? 8 : 12}>
                  <Avatar
                    icon={<UserOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      width: isMobile ? 32 : 40,
                      height: isMobile ? 32 : 40
                    }}
                  />
                  <div className="hidden md:block">
                    <Text strong style={{ color: '#1e293b', fontSize: '14px' }}>
                      {user.username}
                    </Text>
                  </div>
                </Space>
              </div>
            </Dropdown>
          </>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;