// lib/authorization.ts
import { User } from './types';

// Define roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

// Define permissions
export enum Permission {
  CREATE_PROJECT = 'create:project',
  READ_PROJECT = 'read:project',
  UPDATE_PROJECT = 'update:project',
  DELETE_PROJECT = 'delete:project',

  CREATE_CLIENT = 'create:client',
  READ_CLIENT = 'read:client',
  UPDATE_CLIENT = 'update:client',
  DELETE_CLIENT = 'delete:client',

  CREATE_DEPLOYMENT = 'create:deployment',
  READ_DEPLOYMENT = 'read:deployment',
  UPDATE_DEPLOYMENT = 'update:deployment',
  DELETE_DEPLOYMENT = 'delete:deployment',

  MANAGE_USERS = 'manage:users',
}

// Role-to-permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission),
  [UserRole.MANAGER]: [
    Permission.CREATE_PROJECT,
    Permission.READ_PROJECT,
    Permission.UPDATE_PROJECT,
    Permission.CREATE_CLIENT,
    Permission.READ_CLIENT,
    Permission.UPDATE_CLIENT,
    Permission.CREATE_DEPLOYMENT,
    Permission.READ_DEPLOYMENT,
    Permission.UPDATE_DEPLOYMENT,
  ],
  [UserRole.USER]: [
    Permission.READ_PROJECT,
    Permission.UPDATE_PROJECT,
    Permission.READ_CLIENT,
    Permission.READ_DEPLOYMENT,
    Permission.CREATE_DEPLOYMENT,
  ],
  [UserRole.VIEWER]: [
    Permission.READ_PROJECT,
    Permission.READ_CLIENT,
    Permission.READ_DEPLOYMENT,
  ],
};

// Check if user has a specific role
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user || !user.role) return false;
  return user.role === role;
};

// Check if user has admin role
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, UserRole.ADMIN);
};

// Check if user has a specific permission
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user || !user.role) return false;

  const userRole = user.role as UserRole;
  const permissions = rolePermissions[userRole] || [];

  return permissions.includes(permission);
};

// Check if user has any of the specified permissions
export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(user, permission));
};

// Check if user has all of the specified permissions
export const hasAllPermissions = (user: User | null, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(user, permission));
};

// Get all permissions for a user
export const getUserPermissions = (user: User | null): Permission[] => {
  if (!user || !user.role) return [];

  const userRole = user.role as UserRole;
  return rolePermissions[userRole] || [];
};
