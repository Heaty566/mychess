import http from '../axiosCommon';
import { AxiosInstance } from 'axios';
import { UserLoginDto, UserRegisterDto, ForgotPasswordEmailDto, ForgotPasswordPhoneDto } from './dto';
import { IApiResponse } from '../../store/api/interface';

export class AuthAPI {
    constructor(private readonly apiCall: AxiosInstance, readonly prefix: string) {}

    async loginUser(input: UserLoginDto) {
        console.log('helloo');
        const url = `${this.prefix + '/login'}`;
        const res = await this.apiCall.post<IApiResponse<null>>(url, input);
        return res;
    }

    async registerUser(input: UserRegisterDto) {
        const url = `${this.prefix + '/register'}`;
        const res = await this.apiCall.post<IApiResponse<null>>(url, input);
        return res;
    }

    async forgotPasswordByEmail(input: ForgotPasswordEmailDto) {
        const url = `${this.prefix + '/otp-email'}`;
        const res = await this.apiCall.post<IApiResponse<void>>(url, input);
        return res;
    }

    async forgotPasswordByPhone(input: ForgotPasswordPhoneDto) {
        const url = `${this.prefix + '/otp-sms'}`;
        const res = await this.apiCall.post<IApiResponse<void>>(url, input);
        return res;
    }
}
export const authApi = new AuthAPI(http, '/auth');
export default authApi;
