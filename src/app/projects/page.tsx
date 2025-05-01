// app/projects/page.tsx
'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProjectList from '@/components/projects/ProjectList';

export default function ProjectsPage() {
  return (
    <MainLayout>
      <ProjectList />
    </MainLayout>
  );
}
