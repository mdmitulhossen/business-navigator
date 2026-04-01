/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/lib/toast';
import { useAuthStore } from '@/store/authStore';

import { ILoginRequest, ILoginResponse } from '@/types/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postAxios } from '../axios/generic-api-calls';
import { extractErrorMsg, formatResponse } from '../utils/commonUtils';

const AUTH_LOGIN_ENDPOINT = '/auth/login';


/**
 * Hook that performs a login mutation and stores the resulting token.
 */
export function useLogin() {
    const authStore = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation<ILoginResponse, unknown, ILoginRequest>({
        mutationFn: async (credentials: ILoginRequest) => {
            const response = await postAxios<ILoginResponse, ILoginRequest>(AUTH_LOGIN_ENDPOINT, credentials);
            return formatResponse(response);
        },
        onSuccess: (data) => {

            if (!data.success) {
                toast.error(data.message || 'Login failed');
                return;
            }


            authStore.setToken(data.data.accessToken);
            toast.success(data.message || 'Login successful');
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (err: unknown) => {
            const msg = extractErrorMsg(err);
            if ((err as any)?.response?.status === 401) {
                authStore.setToken(null);
            }
            toast.error(msg);
            return Promise.reject(err);
        },
    });
}

