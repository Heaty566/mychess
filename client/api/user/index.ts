import { AxiosInstance } from 'axios';

import http from '../axiosCommon';
import { ApiResponse } from '../../store/api/interface';
import { User } from '../../store/auth/interface';
import { ResetUserPasswordDto, UpdateUserEmailDto, UpdateUserInfoDto, UpdateUserPhoneDto } from './dto';

export class UserAPI {
    constructor(private readonly apiCall: AxiosInstance, private readonly prefix: string) {}

    async getCurrentUser() {
        const url = `${this.prefix + '/'}`;
        const res = await this.apiCall.get<ApiResponse<User>>(url);
        return res;
    }

    async getUserById(userId: string) {
        const url = `${this.prefix}/${userId}`;
        const res = await this.apiCall.get<ApiResponse<User>>(url);
        return res;
    }

    async updateUserInfo(input: UpdateUserInfoDto) {
        const url = `${this.prefix}`;
        const res = await this.apiCall.put<ApiResponse<void>>(url, input);
        return res;
    }

    async updateUserAvatar(file: File) {
        const url = `${this.prefix}/avatar`;
        const formData = new FormData();
        formData.append('avatar', file);

        const res = await this.apiCall.put<ApiResponse<void>>(url, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            withCredentials: true,
        });
        return res;
    }

    async updateUserEmailCreateOTP(input: UpdateUserEmailDto) {
        const url = `${this.prefix}/otp-email`;

        const res = await this.apiCall.post<ApiResponse<void>>(url, input);
        return res;
    }

    async updateUserPhoneCreateOTP(input: UpdateUserPhoneDto) {
        const url = `${this.prefix}/otp-sms`;

        const res = await this.apiCall.post<ApiResponse<void>>(url, input);
        return res;
    }

    async updateUserPhoneByOtp(input: string) {
        const url = `${this.prefix}/phone?key=${input}`;
        const res = await this.apiCall.put<ApiResponse<void>>(url);
        return res;
    }

    async updateUserEmailByOtp(input: string) {
        const url = `${this.prefix}/email?key=${input}`;
        const res = await this.apiCall.put<ApiResponse<void>>(url);
        return res;
    }

    async resetUserPassword(input: ResetUserPasswordDto, key: string) {
        const url = `${this.prefix}/reset-password?key=${key}`;
        const res = await this.apiCall.put<ApiResponse<void>>(url, input);
        return res;
    }
}

export const userAPI = new UserAPI(http, '/user');
export default userAPI;
