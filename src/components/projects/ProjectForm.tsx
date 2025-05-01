// components/projects/ProjectForm.tsx
'use client';

import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Project, CreateProject, UpdateProject } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface ProjectFormProps {
  initialValues?: Project;
  onSubmit: (data: CreateProject | UpdateProject) => Promise<void>;
  loading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialValues,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: CreateProject | UpdateProject) => {
    try {
      setSubmitting(true);
      await onSubmit(values);
      message.success(`Project ${initialValues ? 'updated' : 'created'} successfully!`);
      router.push('/projects');
    } catch (error) {
      message.error(`Failed to ${initialValues ? 'update' : 'create'} project. Please try again.`);
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
        label="Project Name"
        rules={[{ required: true, message: 'Please enter project name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="gitUrl"
        label="Git URL"
      >
        <Input placeholder="https://github.com/username/repo" />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-between">
          <Button onClick={() => router.push('/projects')}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={submitting || loading}>
            {initialValues ? 'Update' : 'Create'} Project
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default ProjectForm;