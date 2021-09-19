import http from './axiosCommon';
import { ServerResponse } from '../common/interface/api.interface';
import { User } from '../common/interface/user.interface';
import { ResetUserPasswordDto, UpdateUserEmailDto, UpdateUserInfoDto, UpdateUserPhoneDto, CommonUser } from '../common/interface/dto/user.dto';

export const userAPI = {
    getCurrentUser: async () => {
        const url = `/user`;
        const res = await http.get<ServerResponse<User>>(url);
        return res;
    },

    getUserById: async (userId: string) => {
        const url = `/user/${userId}`;
        const res = await http.get<ServerResponse<User>>(url);
        return res;
    },
    updateUserInfo: async (input: UpdateUserInfoDto) => {
        const url = `/user`;
        const res = await http.put<ServerResponse<void>>(url, input);
        return res;
    },

    updateUserAvatar: async (file: File) => {
        const url = `/user/avatar`;
        const formData = new FormData();
        formData.append('avatar', file);

        const res = await http.put<ServerResponse<void>>(url, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            withCredentials: true,
        });
        return res;
    },

    updateUserEmailCreateOTP: async (input: UpdateUserEmailDto) => {
        const url = `/user/otp-email`;

        const res = await http.post<ServerResponse<void>>(url, input);
        return res;
    },

    searchUsers: async (name: string, currentPage: string, pageSize: string) => {
        const url = `/user/search?name=${name}&currentPage=${currentPage}&pageSize=${pageSize}`;

        const res = await http.get<ServerResponse<{ users: Array<CommonUser>; count: number }>>(url);
        return res;
    },
    updateUserPhoneCreateOTP: async (input: UpdateUserPhoneDto) => {
        const url = `/user/otp-sms`;

        const res = await http.post<ServerResponse<void>>(url, input);
        return res;
    },

    updateUserByOtp: async (input: string) => {
        const url = `/user/update-with-otp?key=${input}`;
        const res = await http.put<ServerResponse<void>>(url);
        return res;
    },

    resetUserPassword: async (input: ResetUserPasswordDto, key: string) => {
        const url = `/user/reset-password?key=${key}`;
        const res = await http.put<ServerResponse<void>>(url, input);
        return res;
    },
};
