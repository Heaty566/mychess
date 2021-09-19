import http from './axiosCommon';
import { UserLoginDto, UserRegisterDto, ForgotPasswordEmailDto, ForgotPasswordPhoneDto } from '../common/interface/dto/auth.dto';
import { ServerResponse } from '../common/interface/api.interface';

export const authApi = {
    loginUser: async (input: UserLoginDto) => {
        const url = `/auth/login`;
        const res = await http.post<ServerResponse<null>>(url, input);
        return res;
    },

    getSocketToken: async () => {
        const url = `/auth/socket-token`;
        const res = await http.get<ServerResponse<null>>(url);
        return res;
    },

    logoutUser: async () => {
        const url = `/auth/logout`;
        const res = await http.post<ServerResponse<null>>(url);
        return res;
    },
    registerUser: async (input: UserRegisterDto) => {
        const url = `/auth/register`;
        const res = await http.post<ServerResponse<null>>(url, input);
        return res;
    },

    forgotPasswordByEmail: async (input: ForgotPasswordEmailDto) => {
        const url = `/auth/otp-email`;
        const res = await http.post<ServerResponse<void>>(url, input);
        return res;
    },

    forgotPasswordByPhone: async (input: ForgotPasswordPhoneDto) => {
        const url = `/auth/otp-sms`;
        const res = await http.post<ServerResponse<void>>(url, input);
        return res;
    },
    checkOTP: async (input: string) => {
        const url = `/auth/check-otp?key=${input}`;
        const res = await http.post<ServerResponse<void>>(url);
        return res;
    },
};
