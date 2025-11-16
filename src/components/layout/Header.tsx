// components/layout/Header.tsx
'use client';

import React from 'react';
import { Layout, Button, Typography, Avatar, Dropdown, Space } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, toggleCollapsed }) => {
  const { user, logout } = useAuth();

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
      className="flex justify-between items-center px-6 animate-slide-in"
      style={{
        background: 'var(--card-bg)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        height: '72px'
      }}
    >
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className="modern-button"
          style={{
            width: 42,
            height: 42,
            borderRadius: '10px',
            fontSize: '18px',
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
            fontSize: '20px'
          }}
        >
          Project Hosting Manager
        </Title>
      </div>

      {user && (
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <div
            className="cursor-pointer"
            style={{
              padding: '8px 16px',
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
            <Space size={12}>
              <Avatar
                icon={<UserOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  width: 40,
                  height: 40
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
      )}
    </AntHeader>
  );
};

export default Header;