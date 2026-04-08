/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAxios, postAxios } from '@/axios/generic-api-calls';
import { toast } from '@/lib/toast';
import { extractErrorMsg, formatResponse, logoutFunc } from '@/utils/commonUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const CMS_ENDPOINT = '/cms';

export type SocialMediaKey = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'whatsapp';

export type TCMSContact = {
	phone: string;
	email: string;
	address: string;
	facebook: string;
	twitter?: string;
	instagram?: string;
	linkedin?: string;
	youtube?: string;
	tiktok?: string;
	whatsapp?: string;
	workingTime?: string;
	[key: string]: string | undefined;
};

export type TAboutCompany = {
	ourVision: string;
	ourMission: string;
	ourValues: string;
};

export type TCompanyGalleryVideo = {
	type: 'embed' | 'link';
	value: string;
};

export type TCompanyGellert = {
	images: string[];
	videos: TCompanyGalleryVideo[];
};

export type TCMS = {
	id: string;
	contact: TCMSContact;
	about_company: TAboutCompany;
	companyGellert: TCompanyGellert;
	privacyPolicy: string;
	termsOfUse: string;
	createdAt?: string;
	updatedAt?: string;
};

export type CreateOrUpdateCMSPayload = Omit<TCMS, 'id' | 'createdAt' | 'updatedAt'>;

export interface CMSResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

/**
 * Fetch CMS data (GET /cms)
 */
export function useFetchCMS(enabled = true) {
	return useQuery<CMSResponse<TCMS>, unknown>({
		queryFn: async ({ signal }) => {
			try {
				const response = await getAxios<CMSResponse<TCMS>>(CMS_ENDPOINT, undefined, signal);
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
		queryKey: ['cms'],
		enabled,
	});
}

/**
 * Create or Update CMS data (POST /cms/create-or-update)
 */
export function useCreateOrUpdateCMS() {
	const queryClient = useQueryClient();

	return useMutation<CMSResponse<TCMS>, unknown, CreateOrUpdateCMSPayload>({
		mutationFn: async (payload) => {
			const response = await postAxios<CMSResponse<TCMS>, CreateOrUpdateCMSPayload>(
				`${CMS_ENDPOINT}/create-or-update`,
				payload,
			);
			return formatResponse(response);
		},
		onSuccess: (data) => {
			if (!data.success) {
				toast.error(data.message || 'Failed to save CMS data');
				return;
			}
			toast.success(data.message || 'CMS data saved successfully');
			queryClient.invalidateQueries({ queryKey: ['cms'] });
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
