
// app/projects/add/page.tsx
'use client';

import React from 'react';
import { Typography, Card } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import ProjectForm from '@/components/projects/ProjectForm';
import { createProject } from '@/lib/api';
import { CreateProject } from '@/lib/types';

const { Title } = Typography;

export default function AddProjectPage() {
  const handleSubmit = async (data: CreateProject) => {
    await createProject(data);
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <Title level={3}>Add New Project</Title>
      </div>
      
      <Card>
        <ProjectForm onSubmit={handleSubmit} />
      </Card>
    </MainLayout>
  );
}
