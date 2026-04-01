/* eslint-disable @typescript-eslint/no-explicit-any */

import { deleteAxios, getAxios, postAxios, putAxios } from '@/axios/generic-api-calls';
import { toast } from '@/lib/toast';
import { extractErrorMsg, formatResponse, logoutFunc } from '@/utils/commonUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const TEAM_MEMBER_ENDPOINT = '/team-member';

export type TTeamMember = {
	id: string;
	name: string;
	email: string;
	image: string;
	designation: string;
	phoneNumber: string;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type CreateTeamMemberPayload = Omit<TTeamMember, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTeamMemberPayload = Partial<CreateTeamMemberPayload>;

export interface TeamMemberListParams {
	page?: number;
	limit?: number;
	isActive?: boolean;
	searchTerm?: string;
	[key: string]: any;
}

export interface PaginatedTeamMemberResponse<T> {
	success: boolean;
	message: string;
	meta: { page: number; limit: number; total: number };
	data: T[];
}

export interface SingleTeamMemberResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

/**
 * Fetch team members (GET /team-member?page=1&limit=10&searchTerm=john&isActive=true)
 */
export function useFetchTeamMembers(params: TeamMemberListParams = {}, enabled = true) {
	return useQuery<PaginatedTeamMemberResponse<TTeamMember>, unknown>({
		queryFn: async ({ signal }) => {
			try {
				const response = await getAxios<PaginatedTeamMemberResponse<TTeamMember>>(TEAM_MEMBER_ENDPOINT, params, signal);
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
		queryKey: ['team-members', params],
		enabled,
	});
}

/**
 * Create team member (POST /team-member/create-team-member)
 */
export function useCreateTeamMember() {
	const queryClient = useQueryClient();

	return useMutation<SingleTeamMemberResponse<TTeamMember>, unknown, CreateTeamMemberPayload>({
		mutationFn: async (payload) => {
			const response = await postAxios<SingleTeamMemberResponse<TTeamMember>, CreateTeamMemberPayload>(
				`${TEAM_MEMBER_ENDPOINT}/create-team-member`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to create team member');
				return;
			}
			toast.success(data.message || 'Team member created successfully');
			queryClient.invalidateQueries({ queryKey: ['team-members'] });
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
 * Update team member (PUT /team-member/update-team-member/:id)
 */
export function useUpdateTeamMember() {
	const queryClient = useQueryClient();

	return useMutation<SingleTeamMemberResponse<TTeamMember>, unknown, { id: string; payload: UpdateTeamMemberPayload }>({
		mutationFn: async ({ id, payload }) => {
			const response = await putAxios<SingleTeamMemberResponse<TTeamMember>, UpdateTeamMemberPayload>(
				`${TEAM_MEMBER_ENDPOINT}/update-team-member/${id}`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data, variables) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to update team member');
				return;
			}
			toast.success(data.message || 'Team member updated successfully');
			queryClient.invalidateQueries({ queryKey: ['team-members'] });
			if (variables?.id) queryClient.invalidateQueries({ queryKey: ['team-member', variables.id] });
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
 * Delete team member (DELETE /team-member/delete-team-member/:id)
 */
export function useDeleteTeamMember() {
	const queryClient = useQueryClient();

	return useMutation<SingleTeamMemberResponse<TTeamMember>, unknown, string>({
		mutationFn: async (id: string) => {
			const response = await deleteAxios<SingleTeamMemberResponse<TTeamMember>>(
				`${TEAM_MEMBER_ENDPOINT}/delete-team-member/${id}`,
			);
			return formatResponse(response);
		},
		onSuccess: (data, id) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to delete team member');
				return;
			}
			toast.success(data.message || 'Team member deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['team-members'] });
			if (id) queryClient.invalidateQueries({ queryKey: ['team-member', id] });
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
