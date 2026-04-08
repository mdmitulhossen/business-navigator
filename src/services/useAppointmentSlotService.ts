/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAxios, patchAxios } from '@/axios/generic-api-calls';
import { toast } from '@/lib/toast';
import { extractErrorMsg, formatResponse, logoutFunc } from '@/utils/commonUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const APPOINTMENT_SLOT_ENDPOINT = '/appointment-slot';

export type TAppointmentSlotConfig = {
  id: string;
  key: string;
  timeSlots: string[];
  createdAt?: string;
  updatedAt?: string;
};

export interface AppointmentSlotResponse {
  success: boolean;
  message: string;
  data: TAppointmentSlotConfig;
}

export type UpdateAppointmentSlotsPayload = {
  timeSlots: string[];
};

export function useFetchAppointmentSlots(enabled = true) {
  return useQuery<AppointmentSlotResponse, unknown>({
    queryFn: async ({ signal }) => {
      try {
        const response = await getAxios<AppointmentSlotResponse>(APPOINTMENT_SLOT_ENDPOINT, undefined, signal);
        return formatResponse(response);
      } catch (error: unknown) {
        const msg = extractErrorMsg(error);
        return await Promise.reject(new Error(msg));
      }
    },
    queryKey: ['appointment-slots'],
    enabled,
  });
}

export function useUpdateAppointmentSlots() {
  const queryClient = useQueryClient();

  return useMutation<AppointmentSlotResponse, unknown, UpdateAppointmentSlotsPayload>({
    mutationFn: async (payload) => {
      const response = await patchAxios<AppointmentSlotResponse, UpdateAppointmentSlotsPayload>(
        `${APPOINTMENT_SLOT_ENDPOINT}/update`,
        payload,
      );
      return formatResponse(response);
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to update appointment slots');
        return;
      }
      toast.success(data.message || 'Appointment slots updated successfully');
      queryClient.invalidateQueries({ queryKey: ['appointment-slots'] });
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
