// hooks/usePermission.ts
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions, hasRole, UserRole } from '@/lib/authorization';

export const usePermission = () => {
  const { user } = useAuth();

  return {
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(user, permissions),
    hasRole: (role: UserRole) => hasRole(user, role),
  };
};
