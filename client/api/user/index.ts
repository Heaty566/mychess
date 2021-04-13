import { AxiosInstance } from 'axios';

import http from '../axiosCommon';
import { IApiResponse } from '../../store/api/interface';
import { IUser } from '../../store/auth/interface';
import { UpdateUserEmailDto, UpdateUserPhoneDto } from './dto';

export class UserAPI {
    constructor(private readonly apiCall: AxiosInstance, private readonly prefix: string) {}

    async getCurrentUser() {
        const url = `${this.prefix + '/'}`;
        const res = await this.apiCall.get<IApiResponse<IUser>>(url);
        return res;
    }

    async getUserById(userId: string) {
        const url = `${this.prefix}/${userId}`;
        const res = await this.apiCall.get<IApiResponse<IUser>>(url);
        return res;
    }

    async updateUserInfo(input: UpdateUserEmailDto) {
        const url = `${this.prefix}/otp-email`;

        const res = await this.apiCall.post<IApiResponse<void>>(url, input);
        return res;
    }

    async updateUserAvatar(input: UpdateUserEmailDto) {
        const url = `${this.prefix}/otp-email`;

        const res = await this.apiCall.post<IApiResponse<void>>(url, input);
        return res;
    }

    async updateUserEmailCreateOTP(input: UpdateUserEmailDto) {
        const url = `${this.prefix}/otp-email`;

        const res = await this.apiCall.post<IApiResponse<void>>(url, input);
        return res;
    }

    async updateUserPhoneCreateOTP(input: UpdateUserPhoneDto) {
        const url = `${this.prefix}/otp-sms`;

        const res = await this.apiCall.post<IApiResponse<void>>(url, input);
        return res;
    }

    async updateUserPhoneByOtp(input: string) {
        const url = `${this.prefix}/phone/${input}`;
        const res = await this.apiCall.put<IApiResponse<void>>(url);
        return res;
    }

    async updateUserEmailByOtp(input: string) {
        const url = `${this.prefix}/phone/${input}`;
        const res = await this.apiCall.put<IApiResponse<void>>(url);
        return res;
    }
}

export const userAPI = new UserAPI(http, '/user');
export default userAPI;
