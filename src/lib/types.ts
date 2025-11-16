// lib/types.ts
export interface Project {
    id: number;
    name: string;
    description?: string;
    gitUrl?: string;
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface CreateProject {
    name: string;
    description?: string;
    gitUrl?: string;
  }
  
  export interface UpdateProject {
    name: string;
    description?: string;
    gitUrl?: string;
  }
  
  export interface Client {
    id: number;
    name: string;
    contactInfo?: string;
    notes?: string;
  }
  
  export interface CreateClient {
    name: string;
    contactInfo?: string;
    notes?: string;
  }
  
  export interface UpdateClient {
    name: string;
    contactInfo?: string;
    notes?: string;
  }
  
  export interface Deployment {
    id: number;
    projectId: number;
    projectName: string;
    clientId: number;
    clientName: string;
    type: string;
    environment: string;
    hostingPlatform?: string;
    domainUrl?: string;
    remarks?: string;
    deploymentDate?: string;
    status?: string;
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface CreateDeployment {
    projectId: number;
    clientId: number;
    type: string;
    environment: string;
    hostingPlatform?: string;
    domainUrl?: string;
    remarks?: string;
    deploymentDate?: string;
    status?: string;
  }
  
  export interface UpdateDeployment {
    projectId: number;
    clientId: number;
    type: string;
    environment: string;
    hostingPlatform?: string;
    domainUrl?: string;
    remarks?: string;
    deploymentDate?: string;
    status?: string;
  }
  
  export interface DeploymentFilter {
    projectName?: string;
    environment?: string;
    clientName?: string;
  }

  // Authentication types
  export interface User {
    id: number;
    email: string;
    username: string;
    role?: string;
    createdAt?: string;
  }

  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
  }

  export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
  }

  export interface RefreshTokenRequest {
    refreshToken: string;
  }

  // Uptime Kuma types
  export interface UptimeMonitor {
    id: number;
    name: string;
    url: string;
    type: string;
    interval: number;
    active: boolean;
    uptimePercentage?: number;
    avgResponseTime?: number;
    status?: 'up' | 'down' | 'pending' | 'maintenance';
    lastCheck?: string;
  }

  export interface UptimeStats {
    totalMonitors: number;
    upMonitors: number;
    downMonitors: number;
    pausedMonitors: number;
    avgUptime: number;
  }

  export interface CreateUptimeMonitor {
    name: string;
    url: string;
    type?: string;
    interval?: number;
    deploymentId?: number;
  }

  export interface UptimeKumaSettings {
    id?: number;
    baseUrl: string;
    apiKey?: string;
    enabled: boolean;
  }

  export interface DeploymentWithUptime extends Deployment {
    monitor?: UptimeMonitor;
    monitorId?: number;
  }
