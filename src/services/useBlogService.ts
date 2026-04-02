/* eslint-disable @typescript-eslint/no-explicit-any */

import { deleteAxios, getAxios, postAxios, putAxios } from '@/axios/generic-api-calls';
import { toast } from '@/lib/toast';
import { extractErrorMsg, formatResponse, logoutFunc } from '@/utils/commonUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const BLOG_ENDPOINT = '/blog';

export type TBlog = {
	id: string;
	title: string;
	subTitle: string;
	description: string;
	bloggerName: string;
	type: string;
	image: string;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type BlogPayloadBase = {
	title: string;
	subTitle: string;
	description: string;
	bloggerName: string;
	type: string;
	image: string;
	isActive: boolean;
};

export type CreateBlogPayload = BlogPayloadBase;
export type UpdateBlogPayload = Partial<BlogPayloadBase>;

export interface BlogListParams {
	page?: number;
	limit?: number;
	isActive?: boolean;
	searchTerm?: string;
	type?: string;
	[key: string]: any;
}

export interface PaginatedBlogResponse<T> {
	success: boolean;
	message: string;
	meta: { page: number; limit: number; total: number };
	data: T[];
}

export interface SingleBlogResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

/**
 * Fetch blogs (GET /blog?page=1&limit=10&searchTerm=visa&type=visa&isActive=true)
 */
export function useFetchBlogs(params: BlogListParams = {}, enabled = true) {
	return useQuery<PaginatedBlogResponse<TBlog>, unknown>({
		queryFn: async ({ signal }) => {
			try {
				const response = await getAxios<PaginatedBlogResponse<TBlog>>(BLOG_ENDPOINT, params, signal);
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
		queryKey: ['blogs', params],
		enabled,
	});
}

/**
 * Fetch single blog (GET /blog/:blogId)
 */
export function useFetchBlog(blogId?: string, enabled = true) {
	return useQuery<SingleBlogResponse<TBlog>, unknown>({
		queryFn: async ({ signal }) => {
			if (!blogId) {
				return await Promise.reject(new Error('Blog id is required'));
			}

			try {
				const response = await getAxios<SingleBlogResponse<TBlog>>(`${BLOG_ENDPOINT}/${blogId}`, undefined, signal);
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
		queryKey: ['blog', blogId],
		enabled: enabled && Boolean(blogId),
	});
}

/**
 * Create blog (POST /blog/create-blog)
 */
export function useCreateBlog() {
	const queryClient = useQueryClient();

	return useMutation<SingleBlogResponse<TBlog>, unknown, CreateBlogPayload>({
		mutationFn: async (payload) => {
			const response = await postAxios<SingleBlogResponse<TBlog>, CreateBlogPayload>(
				`${BLOG_ENDPOINT}/create-blog`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to create blog');
				return;
			}
			toast.success(data.message || 'Blog created successfully');
			queryClient.invalidateQueries({ queryKey: ['blogs'] });
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
 * Update blog (PUT /blog/update-blog/:blogId)
 */
export function useUpdateBlog() {
	const queryClient = useQueryClient();

	return useMutation<SingleBlogResponse<TBlog>, unknown, { id: string; payload: UpdateBlogPayload }>({
		mutationFn: async ({ id, payload }) => {
			const response = await putAxios<SingleBlogResponse<TBlog>, UpdateBlogPayload>(`${BLOG_ENDPOINT}/update-blog/${id}`, payload);
			return formatResponse(response);
		},
		onSuccess: (data, variables) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to update blog');
				return;
			}
			toast.success(data.message || 'Blog updated successfully');
			queryClient.invalidateQueries({ queryKey: ['blogs'] });
			if (variables?.id) queryClient.invalidateQueries({ queryKey: ['blog', variables.id] });
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
 * Delete blog (DELETE /blog/delete-blog/:blogId)
 */
export function useDeleteBlog() {
	const queryClient = useQueryClient();

	return useMutation<SingleBlogResponse<TBlog>, unknown, string>({
		mutationFn: async (id: string) => {
			const response = await deleteAxios<SingleBlogResponse<TBlog>>(`${BLOG_ENDPOINT}/delete-blog/${id}`);
			return formatResponse(response);
		},
		onSuccess: (data, id) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to delete blog');
				return;
			}
			toast.success(data.message || 'Blog deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['blogs'] });
			if (id) queryClient.invalidateQueries({ queryKey: ['blog', id] });
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
