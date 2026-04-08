/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from '@/axios/api-config';
import { getAxios } from '@/axios/generic-api-calls';
import { toast } from '@/lib/toast';
import { StorageKeys } from '@/types/generalTypes';
import { extractErrorMsg, formatResponse, logoutFunc } from '@/utils/commonUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const CLIENT_PORTAL_ENDPOINT = '/client-portal';

export type TPortalUserStatus = 'ACTIVE' | 'INACTIVE';
export type TPortalServiceStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

export type TPortalService = {
  id: string;
  serviceName: string;
  status: TPortalServiceStatus;
  adminDocuments: string[];
  customerDocuments: string[];
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type TPortalUser = {
  id: string;
  name: string;
  uniqueCode: string;
  plainPassword: string;
  status: TPortalUserStatus;
  services: TPortalService[];
  createdAt: string;
  updatedAt: string;
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const getPortalToken = () => localStorage.getItem(StorageKeys.portalToken);

const portalApiGet = async <T,>(endpoint: string, params?: Record<string, unknown>) => {
  const token = getPortalToken();
  const response = await api.get<T>(endpoint, {
    headers: {
      Authorization: token || '',
    },
    params,
  });
  return response.data;
};

const portalApiPatch = async <T, B>(endpoint: string, payload: B) => {
  const token = getPortalToken();
  const response = await api.patch<T>(endpoint, payload, {
    headers: {
      Authorization: token || '',
    },
  });
  return response.data;
};

const portalApiPost = async <T, B>(endpoint: string, payload: B) => {
  const token = getPortalToken();
  const response = await api.post<T>(endpoint, payload, {
    headers: {
      Authorization: token || '',
    },
  });
  return response.data;
};

export function usePortalLogin() {
  return useMutation<
    ApiResponse<{ accessToken: string; user: Omit<TPortalUser, 'plainPassword'> }>,
    unknown,
    { uniqueCode: string; password: string }
  >({
    mutationFn: async (payload) => {
      const response = await api.post<ApiResponse<{ accessToken: string; user: Omit<TPortalUser, 'plainPassword'> }>>(
        `${CLIENT_PORTAL_ENDPOINT}/auth/login`,
        payload,
      );
      const formatted = formatResponse(response.data);
      if (formatted.data?.accessToken) {
        localStorage.setItem(StorageKeys.portalToken, formatted.data.accessToken);
      }
      localStorage.setItem(StorageKeys.portalUser, JSON.stringify(formatted.data?.user || null));
      return formatted;
    },
    onError: (error) => {
      toast.error(extractErrorMsg(error));
    },
  });
}

export function usePortalLogout() {
  return useMutation<ApiResponse<null>, unknown, void>({
    mutationFn: async () => {
      const response = await portalApiPost<ApiResponse<null>, Record<string, never>>(
        `${CLIENT_PORTAL_ENDPOINT}/auth/logout`,
        {},
      );
      return formatResponse(response);
    },
    onSettled: () => {
      localStorage.removeItem(StorageKeys.portalToken);
      localStorage.removeItem(StorageKeys.portalUser);
    },
  });
}

export function useFetchPortalProfile(enabled = true) {
  return useQuery<ApiResponse<Omit<TPortalUser, 'plainPassword'>>, unknown>({
    queryKey: ['client-portal-profile'],
    enabled,
    queryFn: async () => {
      try {
        const response = await portalApiGet<ApiResponse<Omit<TPortalUser, 'plainPassword'>>>(
          `${CLIENT_PORTAL_ENDPOINT}/me`,
        );
        return formatResponse(response);
      } catch (error) {
        const msg = extractErrorMsg(error);
        localStorage.removeItem(StorageKeys.portalToken);
        localStorage.removeItem(StorageKeys.portalUser);
        return await Promise.reject(new Error(msg));
      }
    },
  });
}

export function useUpdateMyPortalDocuments() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<{ id: string; services: TPortalService[] }>, unknown, { serviceId: string; documents: string[] }>({
    mutationFn: async ({ serviceId, documents }) => {
      const response = await portalApiPatch<ApiResponse<{ id: string; services: TPortalService[] }>, { documents: string[] }>(
        `${CLIENT_PORTAL_ENDPOINT}/services/${serviceId}/customer-documents`,
        { documents },
      );
      return formatResponse(response);
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Documents updated successfully');
      queryClient.invalidateQueries({ queryKey: ['client-portal-profile'] });
    },
    onError: (error) => {
      toast.error(extractErrorMsg(error));
    },
  });
}

export function useAdminCreatePortalUser() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TPortalUser>, unknown, { name: string }>({
    mutationFn: async (payload) => {
      const response = await api.post<ApiResponse<TPortalUser>>(`${CLIENT_PORTAL_ENDPOINT}/admin/users`, payload, {
        headers: {
          Authorization: localStorage.getItem(StorageKeys.token) || '',
        },
      });
      return formatResponse(response.data);
    },
    onSuccess: (data) => {
      toast.success(data.message || 'User created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-portal-users'] });
    },
    onError: (err) => {
      toast.error(extractErrorMsg(err));
    },
  });
}

export function useAdminFetchPortalUsers(searchTerm?: string) {
  return useQuery<ApiResponse<TPortalUser[]>, unknown>({
    queryKey: ['admin-portal-users', searchTerm || ''],
    queryFn: async ({ signal }) => {
      try {
        const response = await getAxios<ApiResponse<TPortalUser[]>>(
          `${CLIENT_PORTAL_ENDPOINT}/admin/users`,
          searchTerm ? { searchTerm } : undefined,
          signal,
        );
        return formatResponse(response);
      } catch (error) {
        const msg = extractErrorMsg(error);
        if ((error as any)?.response?.status === 401) {
          logoutFunc(msg);
        }
        return await Promise.reject(new Error(msg));
      }
    },
  });
}

export function useAdminFetchPortalUser(userId?: string, enabled = true) {
  return useQuery<ApiResponse<TPortalUser>, unknown>({
    queryKey: ['admin-portal-user', userId || ''],
    enabled: enabled && Boolean(userId),
    queryFn: async ({ signal }) => {
      try {
        const response = await getAxios<ApiResponse<TPortalUser>>(
          `${CLIENT_PORTAL_ENDPOINT}/admin/users/${userId}`,
          undefined,
          signal,
        );
        return formatResponse(response);
      } catch (error) {
        const msg = extractErrorMsg(error);
        if ((error as any)?.response?.status === 401) {
          logoutFunc(msg);
        }
        return await Promise.reject(new Error(msg));
      }
    },
  });
}

export function useAdminUpdatePortalUserStatus() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<TPortalUser>, unknown, { userId: string; status: TPortalUserStatus }>({
    mutationFn: async ({ userId, status }) => {
      const response = await api.patch<ApiResponse<TPortalUser>>(
        `${CLIENT_PORTAL_ENDPOINT}/admin/users/${userId}/status`,
        { status },
        {
          headers: {
            Authorization: localStorage.getItem(StorageKeys.token) || '',
          },
        },
      );
      return formatResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portal-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-portal-user'] });
      toast.success('User status updated');
    },
    onError: (error) => {
      toast.error(extractErrorMsg(error));
    },
  });
}

export function useAdminDeletePortalUser() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, unknown, { userId: string }>({
    mutationFn: async ({ userId }) => {
      const response = await api.delete<ApiResponse<null>>(
        `${CLIENT_PORTAL_ENDPOINT}/admin/users/${userId}`,
        {
          headers: {
            Authorization: localStorage.getItem(StorageKeys.token) || '',
          },
        },
      );
      return formatResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portal-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-portal-user'] });
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMsg(error));
    },
  });
}

export function useAdminAddPortalService() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<TPortalUser>, unknown, { userId: string; payload: Partial<TPortalService> & { serviceName: string } }>({
    mutationFn: async ({ userId, payload }) => {
      const response = await api.post<ApiResponse<TPortalUser>>(
        `${CLIENT_PORTAL_ENDPOINT}/admin/users/${userId}/services`,
        payload,
        {
          headers: {
            Authorization: localStorage.getItem(StorageKeys.token) || '',
          },
        },
      );
      return formatResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portal-user'] });
      queryClient.invalidateQueries({ queryKey: ['admin-portal-users'] });
      toast.success('Service added successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMsg(error));
    },
  });
}

export function useAdminUpdatePortalService() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<TPortalUser>, unknown, { userId: string; serviceId: string; payload: Partial<TPortalService> }>({
    mutationFn: async ({ userId, serviceId, payload }) => {
      const response = await api.patch<ApiResponse<TPortalUser>>(
        `${CLIENT_PORTAL_ENDPOINT}/admin/users/${userId}/services/${serviceId}`,
        payload,
        {
          headers: {
            Authorization: localStorage.getItem(StorageKeys.token) || '',
          },
        },
      );
      return formatResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portal-user'] });
      queryClient.invalidateQueries({ queryKey: ['admin-portal-users'] });
      toast.success('Service updated successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMsg(error));
    },
  });
}

export function useAdminDeletePortalService() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<TPortalUser>, unknown, { userId: string; serviceId: string }>({
    mutationFn: async ({ userId, serviceId }) => {
      const response = await api.delete<ApiResponse<TPortalUser>>(
        `${CLIENT_PORTAL_ENDPOINT}/admin/users/${userId}/services/${serviceId}`,
        {
          headers: {
            Authorization: localStorage.getItem(StorageKeys.token) || '',
          },
        },
      );
      return formatResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portal-user'] });
      queryClient.invalidateQueries({ queryKey: ['admin-portal-users'] });
      toast.success('Service deleted successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMsg(error));
    },
  });
}
