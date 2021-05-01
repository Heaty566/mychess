import http from '../axiosCommon';
import { AxiosInstance } from 'axios';
import { UserLoginDto, UserRegisterDto, ForgotPasswordEmailDto, ForgotPasswordPhoneDto } from './dto';
import { ApiResponse } from '../../store/api/interface';

export class AuthAPI {
    constructor(private readonly apiCall: AxiosInstance, readonly prefix: string) {}

    async loginUser(input: UserLoginDto) {
        const url = `${this.prefix + '/login'}`;
        const res = await this.apiCall.post<ApiResponse<null>>(url, input);
        return res;
    }

    async getSocketToken() {
        const url = `${this.prefix + '/socket-token'}`;
        const res = await this.apiCall.get<ApiResponse<null>>(url);
        return res;
    }

    async logoutUser() {
        const url = `${this.prefix + '/logout'}`;
        const res = await this.apiCall.post<ApiResponse<null>>(url);
        return res;
    }

    async registerUser(input: UserRegisterDto) {
        const url = `${this.prefix + '/register'}`;
        const res = await this.apiCall.post<ApiResponse<null>>(url, input);
        return res;
    }

    async forgotPasswordByEmail(input: ForgotPasswordEmailDto) {
        const url = `${this.prefix + '/otp-email'}`;
        const res = await this.apiCall.post<ApiResponse<void>>(url, input);
        return res;
    }

    async forgotPasswordByPhone(input: ForgotPasswordPhoneDto) {
        const url = `${this.prefix + '/otp-sms'}`;
        const res = await this.apiCall.post<ApiResponse<void>>(url, input);
        return res;
    }
    async checkOTP(input: string) {
        const url = `${this.prefix + '/check-otp?key=' + input}`;
        const res = await this.apiCall.post<ApiResponse<void>>(url);
        return res;
    }
}
export const authApi = new AuthAPI(http, '/auth');
export default authApi;
