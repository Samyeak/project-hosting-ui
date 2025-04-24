// components/layout/Header.tsx
import React from 'react';
import { Layout, Button, Typography } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, toggleCollapsed }) => {
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
    </AntHeader>
  );
};

export default Header;