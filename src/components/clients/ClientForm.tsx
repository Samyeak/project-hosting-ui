// components/clients/ClientForm.tsx
'use client';

import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Client, CreateClient, UpdateClient } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface ClientFormProps {
  initialValues?: Client;
  onSubmit: (data: CreateClient | UpdateClient) => Promise<void>;
  loading?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialValues,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: CreateClient | UpdateClient) => {
    try {
      setSubmitting(true);
      await onSubmit(values);
      message.success(`Client ${initialValues ? 'updated' : 'created'} successfully!`);
      router.push('/clients');
    } catch (error) {
      message.error(`Failed to ${initialValues ? 'update' : 'create'} client. Please try again.`);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="Client Name"
        rules={[{ required: true, message: 'Please enter client name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="contactInfo"
        label="Contact Info"
      >
        <Input.TextArea rows={2} />
      </Form.Item>

      <Form.Item
        name="notes"
        label="Notes"
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-between">
          <Button onClick={() => router.push('/clients')}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={submitting || loading}>
            {initialValues ? 'Update' : 'Create'} Client
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default ClientForm;
