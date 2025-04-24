
  // lib/api.ts
  import axios from 'axios';
  import { 
    Project, CreateProject, UpdateProject,
    Client, CreateClient, UpdateClient,
    Deployment, CreateDeployment, UpdateDeployment, DeploymentFilter
  } from './types';
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Projects API
  export const getProjects = async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  };
  
  export const getProject = async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  };
  
  export const createProject = async (project: CreateProject): Promise<Project> => {
    const response = await api.post<Project>('/projects', project);
    return response.data;
  };
  
  export const updateProject = async (id: number, project: UpdateProject): Promise<Project> => {
    const response = await api.put<Project>(`/projects/${id}`, project);
    return response.data;
  };
  
  export const deleteProject = async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  };
  
  // Clients API
  export const getClients = async (): Promise<Client[]> => {
    const response = await api.get<Client[]>('/clients');
    return response.data;
  };
  
  export const getClient = async (id: number): Promise<Client> => {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  };
  
  export const createClient = async (client: CreateClient): Promise<Client> => {
    const response = await api.post<Client>('/clients', client);
    return response.data;
  };
  
  export const updateClient = async (id: number, client: UpdateClient): Promise<Client> => {
    const response = await api.put<Client>(`/clients/${id}`, client);
    return response.data;
  };
  
  export const deleteClient = async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  };
  
  // Deployments API
  export const getDeployments = async (): Promise<Deployment[]> => {
    const response = await api.get<Deployment[]>('/deployments');
    return response.data;
  };
  
  export const getDeployment = async (id: number): Promise<Deployment> => {
    const response = await api.get<Deployment>(`/deployments/${id}`);
    return response.data;
  };
  
  export const getFilteredDeployments = async (filter: DeploymentFilter): Promise<Deployment[]> => {
    const params = new URLSearchParams();
    
    if (filter.projectName) {
      params.append('projectName', filter.projectName);
    }
    
    if (filter.environment) {
      params.append('environment', filter.environment);
    }
    
    if (filter.clientName) {
      params.append('clientName', filter.clientName);
    }
    
    const response = await api.get<Deployment[]>(`/deployments/filter?${params.toString()}`);
    return response.data;
  };
  
  export const createDeployment = async (deployment: CreateDeployment): Promise<Deployment> => {
    const response = await api.post<Deployment>('/deployments', deployment);
    return response.data;
  };
  
  export const updateDeployment = async (id: number, deployment: UpdateDeployment): Promise<Deployment> => {
    const response = await api.put<Deployment>(`/deployments/${id}`, deployment);
    return response.data;
  };
  
  export const deleteDeployment = async (id: number): Promise<void> => {
    await api.delete(`/deployments/${id}`);
  };