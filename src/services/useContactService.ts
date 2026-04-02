/* eslint-disable @typescript-eslint/no-explicit-any */

import { deleteAxios, getAxios, patchAxios, postAxios } from '@/axios/generic-api-calls';
import { toast } from '@/lib/toast';
import { extractErrorMsg, formatResponse, logoutFunc } from '@/utils/commonUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const CONTACT_ENDPOINT = '/contact';

export type ContactStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | (string & {});

export type TContact = {
	id: string;
	name: string;
	phoneNumber: string;
	email: string;
	companyName: string;
	serviceType: string;
	message: string;
	status: ContactStatus;
	createdAt?: string;
	updatedAt?: string;
};

export type CreateContactPayload = Omit<TContact, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

export type UpdateContactStatusPayload = {
	status: ContactStatus;
};

export interface ContactListParams {
	page?: number;
	limit?: number;
	searchTerm?: string;
	status?: ContactStatus;
	serviceType?: string;
	[key: string]: any;
}

export interface PaginatedContactResponse<T> {
	success: boolean;
	message: string;
	meta: { page: number; limit: number; total: number };
	data: T[];
}

export interface SingleContactResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

/**
 * Fetch contacts (GET /contact?page=1&limit=10&searchTerm=client&status=PENDING&serviceType=Visa Processing)
 */
export function useFetchContacts(params: ContactListParams = {}, enabled = true) {
	return useQuery<PaginatedContactResponse<TContact>, unknown>({
		queryFn: async ({ signal }) => {
			try {
				const response = await getAxios<PaginatedContactResponse<TContact>>(CONTACT_ENDPOINT, params, signal);
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
		queryKey: ['contacts', params],
		enabled,
	});
}

/**
 * Create contact (POST /contact/create-contact)
 */
export function useCreateContact() {
	const queryClient = useQueryClient();

	return useMutation<SingleContactResponse<TContact>, unknown, CreateContactPayload>({
		mutationFn: async (payload) => {
			const response = await postAxios<SingleContactResponse<TContact>, CreateContactPayload>(
				`${CONTACT_ENDPOINT}/create-contact`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to submit contact message');
				return;
			}
			toast.success(data.message || 'Contact message submitted successfully');
			queryClient.invalidateQueries({ queryKey: ['contacts'] });
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
 * Update contact status (PATCH /contact/update-status/:contactId)
 */
export function useUpdateContactStatus() {
	const queryClient = useQueryClient();

	return useMutation<SingleContactResponse<TContact>, unknown, { id: string; payload: UpdateContactStatusPayload }>({
		mutationFn: async ({ id, payload }) => {
			const response = await patchAxios<SingleContactResponse<TContact>, UpdateContactStatusPayload>(
				`${CONTACT_ENDPOINT}/update-status/${id}`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data, variables) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to update contact status');
				return;
			}
			toast.success(data.message || 'Contact status updated successfully');
			queryClient.invalidateQueries({ queryKey: ['contacts'] });
			if (variables?.id) queryClient.invalidateQueries({ queryKey: ['contact', variables.id] });
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
 * Delete contact (DELETE /contact/delete-contact/:contactId)
 */
export function useDeleteContact() {
	const queryClient = useQueryClient();

	return useMutation<SingleContactResponse<TContact>, unknown, string>({
		mutationFn: async (id: string) => {
			const response = await deleteAxios<SingleContactResponse<TContact>>(`${CONTACT_ENDPOINT}/delete-contact/${id}`);
			return formatResponse(response);
		},
		onSuccess: (data, id) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to delete contact');
				return;
			}
			toast.success(data.message || 'Contact deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['contacts'] });
			if (id) queryClient.invalidateQueries({ queryKey: ['contact', id] });
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
