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
    <AntHeader className="flex justify-between items-center bg-white px-4 border-b border-gray-200">
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className="mr-4"
        />
        <Title level={4} className="m-0">Project Hosting Manager</Title>
      </div>

      {user && (
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <div className="cursor-pointer">
            <Space>
              <Avatar icon={<UserOutlined />} />
              <div className="hidden md:block">
                <Text strong>{user.username}</Text>
              </div>
            </Space>
          </div>
        </Dropdown>
      )}
    </AntHeader>
  );
};

export default Header;