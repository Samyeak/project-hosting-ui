
  // lib/api.ts
  import axios from 'axios';
  import {
    Project, CreateProject, UpdateProject,
    Client, CreateClient, UpdateClient,
    Deployment, CreateDeployment, UpdateDeployment, DeploymentFilter,
    LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest,
    UptimeMonitor, UptimeStats, CreateUptimeMonitor, UptimeKumaSettings, DeploymentWithUptime
  } from './types';

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests
  api.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle token refresh on 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await axios.post<AuthResponse>(
                `${API_BASE_URL}/auth/refresh`,
                { refreshToken }
              );
              const { token } = response.data;
              localStorage.setItem('token', token);
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            } catch (refreshError) {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }
        }
      }

      return Promise.reject(error);
    }
  );
  
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

  // Authentication API
  export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  };

  export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  };

  export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
  };

  export const refreshToken = async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, data);
    return response.data;
  };

  export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
  };

  // Uptime Kuma API
  export const getUptimeMonitors = async (): Promise<UptimeMonitor[]> => {
    const response = await api.get<UptimeMonitor[]>('/uptime/monitors');
    return response.data;
  };

  export const getUptimeMonitor = async (id: number): Promise<UptimeMonitor> => {
    const response = await api.get<UptimeMonitor>(`/uptime/monitors/${id}`);
    return response.data;
  };

  export const createUptimeMonitor = async (monitor: CreateUptimeMonitor): Promise<UptimeMonitor> => {
    const response = await api.post<UptimeMonitor>('/uptime/monitors', monitor);
    return response.data;
  };

  export const updateUptimeMonitor = async (id: number, monitor: Partial<CreateUptimeMonitor>): Promise<UptimeMonitor> => {
    const response = await api.put<UptimeMonitor>(`/uptime/monitors/${id}`, monitor);
    return response.data;
  };

  export const deleteUptimeMonitor = async (id: number): Promise<void> => {
    await api.delete(`/uptime/monitors/${id}`);
  };

  export const getUptimeStats = async (): Promise<UptimeStats> => {
    const response = await api.get<UptimeStats>('/uptime/stats');
    return response.data;
  };

  export const syncUptimeMonitor = async (deploymentId: number): Promise<UptimeMonitor> => {
    const response = await api.post<UptimeMonitor>(`/uptime/sync/${deploymentId}`);
    return response.data;
  };

  export const getDeploymentsWithUptime = async (): Promise<DeploymentWithUptime[]> => {
    const response = await api.get<DeploymentWithUptime[]>('/deployments/with-uptime');
    return response.data;
  };

  export const getUptimeSettings = async (): Promise<UptimeKumaSettings> => {
    const response = await api.get<UptimeKumaSettings>('/uptime/settings');
    return response.data;
  };

  export const updateUptimeSettings = async (settings: UptimeKumaSettings): Promise<UptimeKumaSettings> => {
    const response = await api.put<UptimeKumaSettings>('/uptime/settings', settings);
    return response.data;
  };

  export const testUptimeConnection = async (settings: UptimeKumaSettings): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>('/uptime/test-connection', settings);
    return response.data;
  };