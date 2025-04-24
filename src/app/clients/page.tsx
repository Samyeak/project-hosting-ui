// app/clients/page.tsx
'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ClientList from '@/components/clients/ClientList';

export default function ClientsPage() {
  return (
    <MainLayout>
      <ClientList />
    </MainLayout>
  );
}
