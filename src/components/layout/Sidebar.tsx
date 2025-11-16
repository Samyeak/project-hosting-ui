
// components/layout/Sidebar.tsx
import React from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  ProjectOutlined,
  TeamOutlined,
  CloudServerOutlined,
  SettingOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const pathname = usePathname();

  const getSelectedKeys = () => {
    if (pathname?.includes('/settings/uptime')) return ['settings-uptime'];
    if (pathname?.includes('/settings')) return ['settings'];
    if (pathname?.includes('/projects')) return ['projects'];
    if (pathname?.includes('/clients')) return ['clients'];
    if (pathname?.includes('/deployments')) return ['deployments'];
    return ['dashboard'];
  };

  const getOpenKeys = () => {
    if (pathname?.includes('/settings')) return ['settings'];
    return [];
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      style={{
        background: 'var(--card-bg)',
        borderRight: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.03)'
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          height: '72px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          padding: '0 24px'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: collapsed ? '8px 12px' : '8px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          <h1
            className="text-xl font-bold"
            style={{
              margin: 0,
              color: 'white',
              fontSize: collapsed ? '16px' : '20px',
              letterSpacing: '0.5px'
            }}
          >
            {collapsed ? 'PHM' : 'PHM'}
          </h1>
        </div>
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        style={{
          borderRight: 0,
          padding: '16px 12px',
          background: 'transparent'
        }}
        items={[
          {
            key: 'dashboard',
            icon: <HomeOutlined style={{ fontSize: '18px' }} />,
            label: <Link href="/" style={{ fontSize: '14px', fontWeight: 500 }}>Dashboard</Link>,
            style: {
              margin: '4px 0',
              borderRadius: '10px',
              height: '48px',
              display: 'flex',
              alignItems: 'center'
            }
          },
          {
            key: 'projects',
            icon: <ProjectOutlined style={{ fontSize: '18px' }} />,
            label: <Link href="/projects" style={{ fontSize: '14px', fontWeight: 500 }}>Projects</Link>,
            style: {
              margin: '4px 0',
              borderRadius: '10px',
              height: '48px',
              display: 'flex',
              alignItems: 'center'
            }
          },
          {
            key: 'clients',
            icon: <TeamOutlined style={{ fontSize: '18px' }} />,
            label: <Link href="/clients" style={{ fontSize: '14px', fontWeight: 500 }}>Clients</Link>,
            style: {
              margin: '4px 0',
              borderRadius: '10px',
              height: '48px',
              display: 'flex',
              alignItems: 'center'
            }
          },
          {
            key: 'deployments',
            icon: <CloudServerOutlined style={{ fontSize: '18px' }} />,
            label: <Link href="/deployments" style={{ fontSize: '14px', fontWeight: 500 }}>Deployments</Link>,
            style: {
              margin: '4px 0',
              borderRadius: '10px',
              height: '48px',
              display: 'flex',
              alignItems: 'center'
            }
          },
          {
            key: 'settings',
            icon: <SettingOutlined style={{ fontSize: '18px' }} />,
            label: 'Settings',
            style: {
              margin: '4px 0',
              borderRadius: '10px',
              height: '48px',
              display: 'flex',
              alignItems: 'center'
            },
            children: [
              {
                key: 'settings-uptime',
                icon: <DashboardOutlined />,
                label: <Link href="/settings/uptime">Uptime Kuma</Link>
              }
            ]
          }
        ]}
      />
    </Sider>
  );
};

export default Sidebar;