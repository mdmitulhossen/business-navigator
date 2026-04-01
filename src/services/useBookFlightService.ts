/* eslint-disable @typescript-eslint/no-explicit-any */

import { deleteAxios, getAxios, patchAxios, postAxios } from '@/axios/generic-api-calls';
import { toast } from '@/lib/toast';
import { extractErrorMsg, formatResponse, logoutFunc } from '@/utils/commonUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const FLIGHT_BOOKING_ENDPOINT = '/flight-booking';

export type FlightBookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type FlightClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';

export type TFlightBooking = {
	id: string;
	name: string;
	email: string;
	phoneNumber: string;
	flightFrom: string;
	flightTo: string;
	departureDate: string;
	returnDate: string;
	numberOfPassengers: number;
	flightClass: FlightClass;
	specialRequestNote?: string;
	status: FlightBookingStatus;
	createdAt?: string;
	updatedAt?: string;
};

export type CreateFlightBookingPayload = Omit<TFlightBooking, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

export type UpdateFlightBookingStatusPayload = {
	status: FlightBookingStatus;
};

export interface FlightBookingListParams {
	page?: number;
	limit?: number;
	searchTerm?: string;
	status?: FlightBookingStatus;
	flightFrom?: string;
	flightTo?: string;
	[key: string]: any;
}

export interface PaginatedFlightBookingResponse<T> {
	success: boolean;
	message: string;
	meta: { page: number; limit: number; total: number };
	data: T[];
}

export interface SingleFlightBookingResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

/**
 * Fetch flight bookings (GET /flight-booking?page=1&limit=10&searchTerm=flight&status=PENDING&flightFrom=DAC&flightTo=LHR)
 */
export function useFetchFlightBookings(params: FlightBookingListParams = {}, enabled = true) {
	return useQuery<PaginatedFlightBookingResponse<TFlightBooking>, unknown>({
		queryFn: async ({ signal }) => {
			try {
				const response = await getAxios<PaginatedFlightBookingResponse<TFlightBooking>>(FLIGHT_BOOKING_ENDPOINT, params, signal);
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
		queryKey: ['flight-bookings', params],
		enabled,
	});
}

/**
 * Fetch a single flight booking (GET /flight-booking/:flightBookingId)
 */
export function useFetchFlightBooking(flightBookingId: string | undefined, enabled = true) {
	return useQuery<SingleFlightBookingResponse<TFlightBooking>, unknown>({
		queryFn: async ({ signal }) => {
			if (!flightBookingId) return Promise.reject(new Error('Missing flight booking id'));
			try {
				const response = await getAxios<SingleFlightBookingResponse<TFlightBooking>>(
					`${FLIGHT_BOOKING_ENDPOINT}/${flightBookingId}`,
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
		queryKey: ['flight-booking', flightBookingId],
		enabled: Boolean(flightBookingId) && enabled,
	});
}

/**
 * Create flight booking (POST /flight-booking/create-flight-booking)
 */
export function useCreateFlightBooking() {
	const queryClient = useQueryClient();

	return useMutation<SingleFlightBookingResponse<TFlightBooking>, unknown, CreateFlightBookingPayload>({
		mutationFn: async (payload) => {
			const response = await postAxios<SingleFlightBookingResponse<TFlightBooking>, CreateFlightBookingPayload>(
				`${FLIGHT_BOOKING_ENDPOINT}/create-flight-booking`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to create flight booking');
				return;
			}
			toast.success(data.message || 'Flight booking created successfully');
			queryClient.invalidateQueries({ queryKey: ['flight-bookings'] });
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
 * Update flight booking status (PATCH /flight-booking/update-status/:flightBookingId)
 */
export function useUpdateFlightBookingStatus() {
	const queryClient = useQueryClient();

	return useMutation<SingleFlightBookingResponse<TFlightBooking>, unknown, { id: string; payload: UpdateFlightBookingStatusPayload }>({
		mutationFn: async ({ id, payload }) => {
			const response = await patchAxios<SingleFlightBookingResponse<TFlightBooking>, UpdateFlightBookingStatusPayload>(
				`${FLIGHT_BOOKING_ENDPOINT}/update-status/${id}`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data, variables) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to update flight booking status');
				return;
			}
			toast.success(data.message || 'Flight booking status updated successfully');
			queryClient.invalidateQueries({ queryKey: ['flight-bookings'] });
			if (variables?.id) queryClient.invalidateQueries({ queryKey: ['flight-booking', variables.id] });
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
 * Delete flight booking (DELETE /flight-booking/delete-flight-booking/:flightBookingId)
 */
export function useDeleteFlightBooking() {
	const queryClient = useQueryClient();

	return useMutation<SingleFlightBookingResponse<TFlightBooking>, unknown, string>({
		mutationFn: async (flightBookingId: string) => {
			const response = await deleteAxios<SingleFlightBookingResponse<TFlightBooking>>(
				`${FLIGHT_BOOKING_ENDPOINT}/delete-flight-booking/${flightBookingId}`,
			);
			return formatResponse(response);
		},
		onSuccess: (data, flightBookingId) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to delete flight booking');
				return;
			}
			toast.success(data.message || 'Flight booking deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['flight-bookings'] });
			if (flightBookingId) queryClient.invalidateQueries({ queryKey: ['flight-booking', flightBookingId] });
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
