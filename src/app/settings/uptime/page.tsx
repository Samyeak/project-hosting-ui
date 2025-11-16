'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Card, Typography, message, Switch, Space, Divider } from 'antd';
import { SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import { getUptimeSettings, updateUptimeSettings, testUptimeConnection } from '@/lib/api';
import { UptimeKumaSettings } from '@/lib/types';

const { Title, Text, Paragraph } = Typography;

export default function UptimeSettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setInitialLoading(true);
      const settings = await getUptimeSettings();
      form.setFieldsValue(settings);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Set default values if settings don't exist
      form.setFieldsValue({
        baseUrl: '',
        apiKey: '',
        enabled: false,
      });
    } finally {
      setInitialLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (values: UptimeKumaSettings) => {
    try {
      setLoading(true);
      await updateUptimeSettings(values);
      message.success('Settings saved successfully');
    } catch (error) {
      message.error('Failed to save settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      const values = form.getFieldsValue();
      const result = await testUptimeConnection(values);

      if (result.success) {
        message.success(result.message || 'Connection successful!');
      } else {
        message.error(result.message || 'Connection failed');
      }
    } catch (error) {
      message.error('Failed to test connection');
      console.error(error);
    } finally {
      setTesting(false);
    }
  };

  if (initialLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Text>Loading settings...</Text>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Title level={2}>Uptime Kuma Settings</Title>

      <Card className="mt-6">
        <Paragraph>
          Configure your Uptime Kuma instance to enable automatic monitoring
          of your deployments. This will allow the system to track uptime
          statistics and display them in the dashboard and deployment lists.
        </Paragraph>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            baseUrl: '',
            apiKey: '',
            enabled: false,
          }}
        >
          <Form.Item
            name="enabled"
            label="Enable Uptime Kuma Integration"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="baseUrl"
            label="Uptime Kuma Base URL"
            rules={[
              { required: true, message: 'Please enter the Uptime Kuma base URL' },
              { type: 'url', message: 'Please enter a valid URL' },
            ]}
            extra="Example: https://uptime.example.com"
          >
            <Input placeholder="https://uptime.example.com" />
          </Form.Item>

          <Form.Item
            name="apiKey"
            label="API Key (Optional)"
            extra="If your Uptime Kuma instance requires authentication"
          >
            <Input.Password placeholder="Enter API key" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save Settings
              </Button>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={handleTestConnection}
                loading={testing}
              >
                Test Connection
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Divider />

        <div>
          <Title level={4}>How it works</Title>
          <Paragraph>
            <ul>
              <li>When enabled, the system will sync deployments with Uptime Kuma</li>
              <li>Each deployment with a domain URL can be monitored</li>
              <li>Uptime statistics will be displayed in the deployment list and dashboard</li>
              <li>You can manually sync monitors using the sync button in the deployment list</li>
            </ul>
          </Paragraph>

          <Title level={4}>Backend Requirements</Title>
          <Paragraph>
            <Text type="secondary">
              Your backend should implement the following endpoints to communicate with Uptime Kuma:
              <ul>
                <li><Text code>GET /api/uptime/monitors</Text> - Get all monitors</li>
                <li><Text code>POST /api/uptime/monitors</Text> - Create a monitor</li>
                <li><Text code>PUT /api/uptime/monitors/:id</Text> - Update a monitor</li>
                <li><Text code>DELETE /api/uptime/monitors/:id</Text> - Delete a monitor</li>
                <li><Text code>GET /api/uptime/stats</Text> - Get uptime statistics</li>
                <li><Text code>POST /api/uptime/sync/:deploymentId</Text> - Sync deployment with Uptime Kuma</li>
              </ul>
            </Text>
          </Paragraph>
        </div>
      </Card>
    </MainLayout>
  );
}
