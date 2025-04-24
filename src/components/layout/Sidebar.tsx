
// components/layout/Sidebar.tsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  HomeOutlined, 
  ProjectOutlined, 
  TeamOutlined, 
  CloudServerOutlined 
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const pathname = usePathname();

  const getSelectedKeys = () => {
    if (pathname?.includes('/projects')) return ['projects'];
    if (pathname?.includes('/clients')) return ['clients'];
    if (pathname?.includes('/deployments')) return ['deployments'];
    return ['dashboard'];
  };

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed} 
      width={200} 
      className="bg-white border-r border-gray-200"
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">
          {collapsed ? 'PHM' : 'PHM'}
        </h1>
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        className="border-r-0"
      >
        <Menu.Item key="dashboard" icon={<HomeOutlined />}>
          <Link href="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="projects" icon={<ProjectOutlined />}>
          <Link href="/projects">Projects</Link>
        </Menu.Item>
        <Menu.Item key="clients" icon={<TeamOutlined />}>
          <Link href="/clients">Clients</Link>
        </Menu.Item>
        <Menu.Item key="deployments" icon={<CloudServerOutlined />}>
          <Link href="/deployments">Deployments</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;