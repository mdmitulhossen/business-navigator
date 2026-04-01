/* eslint-disable @typescript-eslint/no-explicit-any */

import { deleteAxios, getAxios, patchAxios, postAxios } from '@/axios/generic-api-calls';
import { toast } from '@/lib/toast';
import { extractErrorMsg, formatResponse, logoutFunc } from '@/utils/commonUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const SERVICES_ENDPOINT = '/service';

export type TServiceNode = {
	id: string;
	title: string;
	titleAr: string;
	requirements?: string[];
	process?: string[];
	children?: TServiceNode[];
};

export type TService = {
	id: string;
	icon: string;
	titleKey: string;
	descKey: string;
	requirements: string[];
	process: string[];
	subServices?: TServiceNode[];
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type CreateServicePayload = Partial<Omit<TService, 'id'>> & {
	id: string;
};

export type UpdateServicePayload = Partial<Omit<CreateServicePayload, 'id'>>;

export interface ServiceListParams {
	page?: number;
	limit?: number;
	isActive?: boolean;
	searchTerm?: string;
	[key: string]: any;
}

export interface PaginatedServiceResponse<T> {
	success: boolean;
	message: string;
	meta: { page: number; limit: number; total: number };
	data: T[];
}

export interface SingleServiceResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

/**
 * Fetch services (GET /service?page=1&limit=10&isActive=true)
 */
export function useFetchServices(params: ServiceListParams = {}, enabled = true) {
	return useQuery<PaginatedServiceResponse<TService>, unknown>({
		queryFn: async ({ signal }) => {
			try {
				const response = await getAxios<PaginatedServiceResponse<TService>>(SERVICES_ENDPOINT, params, signal);
				return formatResponse(response);
			} catch (error: unknown) {
				const msg = extractErrorMsg(error);
				if ((error as any)?.response?.status === 401) {
					logoutFunc(msg);
					return await Promise.reject(new Error(msg));
				}
				return await Promise.reject(new Error(msg));
			}
		},
		queryKey: ['services', params],
		enabled,
	});
}

/**
 * Fetch single service (GET /service/single?id={{serviceId}})
 */
export function useFetchService(id: string | undefined, enabled = true) {
	return useQuery<SingleServiceResponse<TService>, unknown>({
		queryFn: async ({ signal }) => {
			if (!id) return Promise.reject(new Error('Missing service id'));
			try {
				const response = await getAxios<SingleServiceResponse<TService>>(`${SERVICES_ENDPOINT}/single`, { id }, signal);
				return formatResponse(response);
			} catch (error: unknown) {
				const msg = extractErrorMsg(error);
				if ((error as any)?.response?.status === 401) {
					logoutFunc(msg);
					return await Promise.reject(new Error(msg));
				}
				return await Promise.reject(new Error(msg));
			}
		},
		queryKey: ['service', id],
		enabled: Boolean(id) && enabled,
	});
}

/**
 * Create service (POST /service/create-service)
 */
export function useCreateService() {
	const queryClient = useQueryClient();

	return useMutation<SingleServiceResponse<TService>, unknown, CreateServicePayload>({
		mutationFn: async (payload) => {
			const response = await postAxios<SingleServiceResponse<TService>, CreateServicePayload>(
				`${SERVICES_ENDPOINT}/create-service`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to create service');
				return;
			}
			toast.success(data.message || 'Service created successfully');
			queryClient.invalidateQueries({ queryKey: ['services'] });
		},
		onError: (err: unknown) => {
			const msg = extractErrorMsg(err);
			if ((err as any)?.response?.status === 401) {
				logoutFunc(msg);
			}
			toast.error(msg);
			return Promise.reject(err);
		},
	});
}

/**
 * Update service (PATCH /service/update-service/:serviceId)
 */
export function useUpdateService() {
	const queryClient = useQueryClient();

	return useMutation<SingleServiceResponse<TService>, unknown, { id: string; payload: UpdateServicePayload }>({
		mutationFn: async ({ id, payload }) => {
			const response = await patchAxios<SingleServiceResponse<TService>, UpdateServicePayload>(
				`${SERVICES_ENDPOINT}/update-service/${id}`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data, variables) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to update service');
				return;
			}
			toast.success(data.message || 'Service updated successfully');
			queryClient.invalidateQueries({ queryKey: ['services'] });
			if (variables?.id) queryClient.invalidateQueries({ queryKey: ['service', variables.id] });
		},
		onError: (err: unknown) => {
			const msg = extractErrorMsg(err);
			if ((err as any)?.response?.status === 401) {
				logoutFunc(msg);
			}
			toast.error(msg);
			return Promise.reject(err);
		},
	});
}

/**
 * Delete service (DELETE /service/delete-service/:serviceId)
 */
export function useDeleteService() {
	const queryClient = useQueryClient();

	return useMutation<SingleServiceResponse<TService>, unknown, string>({
		mutationFn: async (id: string) => {
			const response = await deleteAxios<SingleServiceResponse<TService>>(`${SERVICES_ENDPOINT}/delete-service/${id}`);
			return formatResponse(response);
		},
		onSuccess: (data, id) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to delete service');
				return;
			}
			toast.success(data.message || 'Service deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['services'] });
			if (id) queryClient.invalidateQueries({ queryKey: ['service', id] });
		},
		onError: (err: unknown) => {
			const msg = extractErrorMsg(err);
			if ((err as any)?.response?.status === 401) {
				logoutFunc(msg);
			}
			toast.error(msg);
			return Promise.reject(err);
		},
	});
}
