'use client';

import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterRequest } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const { register, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onFinish = async (values: RegisterRequest) => {
    try {
      await register(values);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        className="modern-card animate-fade-in"
        bordered={false}
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
            }}
          >
            PHM
          </div>
          <Title level={2} style={{ marginBottom: 8, fontWeight: 700, color: '#1a1a2e' }}>
            Create Account
          </Title>
          <Text style={{ fontSize: '15px', color: '#64748b' }}>Sign up to get started</Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters!' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#667eea' }} />}
              placeholder="Username"
              style={{
                borderRadius: '10px',
                height: '48px',
                fontSize: '14px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#667eea' }} />}
              placeholder="Email"
              style={{
                borderRadius: '10px',
                height: '48px',
                fontSize: '14px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#667eea' }} />}
              placeholder="Password"
              style={{
                borderRadius: '10px',
                height: '48px',
                fontSize: '14px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#667eea' }} />}
              placeholder="Confirm Password"
              style={{
                borderRadius: '10px',
                height: '48px',
                fontSize: '14px'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: '48px',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                marginBottom: 16
              }}
            >
              Sign Up
            </Button>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#64748b', fontSize: '14px' }}>
                Already have an account?{' '}
                <Link href="/login">
                  <Text style={{ color: '#667eea', cursor: 'pointer', fontWeight: 600 }}>
                    Sign in
                  </Text>
                </Link>
              </Text>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
