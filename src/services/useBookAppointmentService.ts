/* eslint-disable @typescript-eslint/no-explicit-any */

import { deleteAxios, getAxios, patchAxios, postAxios } from '@/axios/generic-api-calls';
import { toast } from '@/lib/toast';
import { extractErrorMsg, formatResponse, logoutFunc } from '@/utils/commonUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const BOOK_APPOINTMENT_ENDPOINT = '/book-appointment';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type TBookAppointment = {
	id: string;
	name: string;
	phoneNumber: string;
	email: string;
	companyName: string;
	service: string;
	additionalNotes?: string;
	date: string;
	slotTime: string;
	status: AppointmentStatus;
	createdAt?: string;
	updatedAt?: string;
};

export type CreateAppointmentPayload = Omit<TBookAppointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

export type UpdateAppointmentStatusPayload = {
	status: AppointmentStatus;
};

export interface AppointmentListParams {
	page?: number;
	limit?: number;
	searchTerm?: string;
	status?: AppointmentStatus;
	service?: string;
	[key: string]: any;
}

export interface PaginatedAppointmentResponse<T> {
	success: boolean;
	message: string;
	meta: { page: number; limit: number; total: number };
	data: T[];
}

export interface SingleAppointmentResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

/**
 * Fetch appointments (GET /book-appointment?page=1&limit=10&searchTerm=booking&status=PENDING&service=Visa Consultation)
 */
export function useFetchAppointments(params: AppointmentListParams = {}, enabled = true) {
	return useQuery<PaginatedAppointmentResponse<TBookAppointment>, unknown>({
		queryFn: async ({ signal }) => {
			try {
				const response = await getAxios<PaginatedAppointmentResponse<TBookAppointment>>(BOOK_APPOINTMENT_ENDPOINT, params, signal);
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
		queryKey: ['book-appointments', params],
		enabled,
	});
}

/**
 * Fetch a single appointment (GET /book-appointment/:appointmentId)
 */
export function useFetchAppointment(appointmentId: string | undefined, enabled = true) {
	return useQuery<SingleAppointmentResponse<TBookAppointment>, unknown>({
		queryFn: async ({ signal }) => {
			if (!appointmentId) return Promise.reject(new Error('Missing appointment id'));
			try {
				const response = await getAxios<SingleAppointmentResponse<TBookAppointment>>(
					`${BOOK_APPOINTMENT_ENDPOINT}/${appointmentId}`,
					undefined,
					signal,
				);
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
		queryKey: ['book-appointment', appointmentId],
		enabled: Boolean(appointmentId) && enabled,
	});
}

/**
 * Create appointment (POST /book-appointment/create-appointment)
 */
export function useCreateAppointment() {
	const queryClient = useQueryClient();

	return useMutation<SingleAppointmentResponse<TBookAppointment>, unknown, CreateAppointmentPayload>({
		mutationFn: async (payload) => {
			const response = await postAxios<SingleAppointmentResponse<TBookAppointment>, CreateAppointmentPayload>(
				`${BOOK_APPOINTMENT_ENDPOINT}/create-appointment`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to book appointment');
				return;
			}
			toast.success(data.message || 'Appointment booked successfully');
			queryClient.invalidateQueries({ queryKey: ['book-appointments'] });
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
 * Update appointment status (PATCH /book-appointment/update-status/:appointmentId)
 */
export function useUpdateAppointmentStatus() {
	const queryClient = useQueryClient();

	return useMutation<SingleAppointmentResponse<TBookAppointment>, unknown, { id: string; payload: UpdateAppointmentStatusPayload }>({
		mutationFn: async ({ id, payload }) => {
			const response = await patchAxios<SingleAppointmentResponse<TBookAppointment>, UpdateAppointmentStatusPayload>(
				`${BOOK_APPOINTMENT_ENDPOINT}/update-status/${id}`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data, variables) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to update appointment status');
				return;
			}
			toast.success(data.message || 'Appointment status updated successfully');
			queryClient.invalidateQueries({ queryKey: ['book-appointments'] });
			if (variables?.id) queryClient.invalidateQueries({ queryKey: ['book-appointment', variables.id] });
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
 * Delete appointment (DELETE /book-appointment/delete-appointment/:appointmentId)
 */
export function useDeleteAppointment() {
	const queryClient = useQueryClient();

	return useMutation<SingleAppointmentResponse<TBookAppointment>, unknown, string>({
		mutationFn: async (appointmentId: string) => {
			const response = await deleteAxios<SingleAppointmentResponse<TBookAppointment>>(
				`${BOOK_APPOINTMENT_ENDPOINT}/delete-appointment/${appointmentId}`,
			);
			return formatResponse(response);
		},
		onSuccess: (data, appointmentId) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to delete appointment');
				return;
			}
			toast.success(data.message || 'Appointment deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['book-appointments'] });
			if (appointmentId) queryClient.invalidateQueries({ queryKey: ['book-appointment', appointmentId] });
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
