// components/deployments/DeploymentForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import { Deployment, CreateDeployment, UpdateDeployment, Project, Client } from '@/lib/types';
import { getProjects, getClients } from '@/lib/api';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface DeploymentFormProps {
  initialValues?: Deployment;
  onSubmit: (data: CreateDeployment | UpdateDeployment) => Promise<void>;
  loading?: boolean;
}

const DeploymentForm: React.FC<DeploymentFormProps> = ({
  initialValues,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm<Deployment>();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      setLoadingData(true);
      const [projectsData, clientsData] = await Promise.all([
        getProjects(),
        getClients()
      ]);
      setProjects(projectsData);
      setClients(clientsData);
    } catch (error) {
      message.error('Failed to load form data');
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (values: Deployment) => {
    const submissionData = {
      ...values,
      // deploymentDate: values.deploymentDate ? values.deploymentDate.format('YYYY-MM-DD') : null
    };

    try {
      setSubmitting(true);
      await onSubmit(submissionData);
      message.success(`Deployment ${initialValues ? 'updated' : 'created'} successfully!`);
      router.push('/deployments');
    } catch (error) {
      message.error(`Failed to ${initialValues ? 'update' : 'create'} deployment. Please try again.`);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const initialFormValues = initialValues
    ? {
        ...initialValues,
        deploymentDate: initialValues.deploymentDate ? dayjs(initialValues.deploymentDate) : null
      }
    : undefined;

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialFormValues}
      onFinish={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="projectId"
          label="Project"
          rules={[{ required: true, message: 'Please select a project' }]}
        >
          <Select
            placeholder="Select a project"
            loading={loadingData}
          >
            {projects.map(project => (
              <Option key={project.id} value={project.id}>{project.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="clientId"
          label="Client"
          rules={[{ required: true, message: 'Please select a client' }]}
        >
          <Select
            placeholder="Select a client"
            loading={loadingData}
          >
            {clients.map(client => (
              <Option key={client.id} value={client.id}>{client.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: 'Please select a type' }]}
        >
          <Select placeholder="Select type">
            <Option value="UI">UI</Option>
            <Option value="API">API</Option>
            <Option value="Database">Database</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="environment"
          label="Environment"
          rules={[{ required: true, message: 'Please select an environment' }]}
        >
          <Select placeholder="Select environment">
            <Option value="Development">Development</Option>
            <Option value="Testing">Testing</Option>
            <Option value="Staging">Staging</Option>
            <Option value="UAT">UAT</Option>
            <Option value="Production">Production</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="deploymentDate"
          label="Deployment Date"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="hostingPlatform"
          label="Hosting Platform"
        >
          <Input placeholder="AWS, Azure, GCP, etc." />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
        >
          <Select placeholder="Select status">
            <Option value="Planned">Planned</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Failed">Failed</Option>
          </Select>
        </Form.Item>
      </div>

      <Form.Item
        name="domainUrl"
        label="Domain URL"
      >
        <Input placeholder="https://example.com" />
      </Form.Item>

      <Form.Item
        name="remarks"
        label="Remarks"
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-between">
          <Button onClick={() => router.push('/deployments')}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={submitting || loading}
          >
            {initialValues ? 'Update' : 'Create'} Deployment
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default DeploymentForm;
