// components/auth/Can.tsx
'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Permission, hasPermission, hasAnyPermission } from '@/lib/authorization';

interface CanProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component for conditional rendering based on user permissions
 *
 * Usage:
 * <Can permission={Permission.CREATE_PROJECT}>
 *   <Button>Create Project</Button>
 * </Can>
 *
 * <Can permissions={[Permission.CREATE_PROJECT, Permission.UPDATE_PROJECT]} requireAll={false}>
 *   <Button>Edit Project</Button>
 * </Can>
 */
const Can: React.FC<CanProps> = ({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children
}) => {
  const { user } = useAuth();

  let isAuthorized = false;

  if (permission) {
    isAuthorized = hasPermission(user, permission);
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      isAuthorized = permissions.every(perm => hasPermission(user, perm));
    } else {
      isAuthorized = hasAnyPermission(user, permissions);
    }
  }

  if (!isAuthorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default Can;
