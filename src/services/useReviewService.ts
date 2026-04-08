/* eslint-disable @typescript-eslint/no-explicit-any */

import { deleteAxios, getAxios, patchAxios, postAxios } from '@/axios/generic-api-calls';
import { toast } from '@/lib/toast';
import { extractErrorMsg, formatResponse, logoutFunc } from '@/utils/commonUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const REVIEW_ENDPOINT = '/review';

export type TReview = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  comment: string;
  rating: number;
  isFeature: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateReviewPayload = {
  name: string;
  email?: string;
  phone?: string;
  comment: string;
  rating: number;
};

export type UpdateReviewPayload = Partial<CreateReviewPayload> & {
  isFeature?: boolean;
};

export interface ReviewListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isFeature?: boolean;
  rating?: number;
  [key: string]: any;
}

export interface PaginatedReviewResponse<T> {
  success: boolean;
  message: string;
  meta: { page: number; limit: number; total: number };
  data: T[];
}

export interface SingleReviewResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useFetchReviews(params: ReviewListParams = {}, enabled = true) {
  return useQuery<PaginatedReviewResponse<TReview>, unknown>({
    queryFn: async ({ signal }) => {
      try {
        const response = await getAxios<PaginatedReviewResponse<TReview>>(REVIEW_ENDPOINT, params, signal);
        return formatResponse(response);
      } catch (error: unknown) {
        const msg = extractErrorMsg(error);
        return await Promise.reject(new Error(msg));
      }
    },
    queryKey: ['reviews', params],
    enabled,
  });
}

export function useFetchReview(reviewId: string | undefined, enabled = true) {
  return useQuery<SingleReviewResponse<TReview>, unknown>({
    queryFn: async ({ signal }) => {
      if (!reviewId) return Promise.reject(new Error('Missing review id'));

      try {
        const response = await getAxios<SingleReviewResponse<TReview>>(`${REVIEW_ENDPOINT}/${reviewId}`, undefined, signal);
        return formatResponse(response);
      } catch (error: unknown) {
        const msg = extractErrorMsg(error);
        return await Promise.reject(new Error(msg));
      }
    },
    queryKey: ['review', reviewId],
    enabled: Boolean(reviewId) && enabled,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation<SingleReviewResponse<TReview>, unknown, CreateReviewPayload>({
    mutationFn: async (payload) => {
      const response = await postAxios<SingleReviewResponse<TReview>, CreateReviewPayload>(`${REVIEW_ENDPOINT}/create-review`, payload);
      return formatResponse(response);
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to submit review');
        return;
      }

      toast.success(data.message || 'Review submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error: unknown) => {
      const msg = extractErrorMsg(error);
      toast.error(msg);
      return Promise.reject(error);
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation<SingleReviewResponse<TReview>, unknown, { id: string; payload: UpdateReviewPayload }>({
    mutationFn: async ({ id, payload }) => {
      const response = await patchAxios<SingleReviewResponse<TReview>, UpdateReviewPayload>(`${REVIEW_ENDPOINT}/update-review/${id}`, payload);
      return formatResponse(response);
    },
    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to update review');
        return;
      }

      toast.success(data.message || 'Review updated successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      if (variables?.id) queryClient.invalidateQueries({ queryKey: ['review', variables.id] });
    },
    onError: (error: unknown) => {
      const msg = extractErrorMsg(error);
      if ((error as any)?.response?.status === 401) {
        logoutFunc(msg);
      }
      toast.error(msg);
      return Promise.reject(error);
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<SingleReviewResponse<TReview>, unknown, string>({
    mutationFn: async (reviewId) => {
      const response = await deleteAxios<SingleReviewResponse<TReview>>(`${REVIEW_ENDPOINT}/delete-review/${reviewId}`);
      return formatResponse(response);
    },
    onSuccess: (data, reviewId) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to delete review');
        return;
      }

      toast.success(data.message || 'Review deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      if (reviewId) queryClient.invalidateQueries({ queryKey: ['review', reviewId] });
    },
    onError: (error: unknown) => {
      const msg = extractErrorMsg(error);
      if ((error as any)?.response?.status === 401) {
        logoutFunc(msg);
      }
      toast.error(msg);
      return Promise.reject(error);
    },
  });
}
