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
  