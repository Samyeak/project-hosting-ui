
// app/projects/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Card, Spin, message } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import ProjectForm from '@/components/projects/ProjectForm';
import { getProject, updateProject } from '@/lib/api';
import { Project, UpdateProject } from '@/lib/types';

const { Title } = Typography;

export default function EditProjectPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const {id} = await params;
        setLoading(true);
        const data = await getProject(parseInt(id));
        setProject(data);
      } catch (error) {
        message.error('Failed to fetch project details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params]);

  const handleSubmit = async (data: UpdateProject) => {
        const {id} = await params;
        await updateProject(parseInt(id), data);
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <Title level={3}>Edit Project</Title>
      </div>
      
      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          project && <ProjectForm initialValues={project} onSubmit={handleSubmit} />
        )}
      </Card>
    </MainLayout>
  );
}

export const runtime = 'edge';
