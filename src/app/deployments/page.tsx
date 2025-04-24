// app/deployments/page.tsx
'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DeploymentList from '@/components/deployments/DeploymentList';

export default function DeploymentsPage() {
  return (
    <MainLayout>
      <DeploymentList />
    </MainLayout>
  );
}
