import { UserLoginDto, UserRegisterDto, ForgotPasswordEmailDto, ForgotPasswordPhoneDto } from './dto';
import { IApiResponse } from '../../store/api/interface';

import { AxiosInstance } from 'axios';
import http from '../axiosCommon';
export class AuthAPI {
    constructor(private readonly apiCall: AxiosInstance, readonly prefix: string) {
        console.log(`${process.env.SERVER_URL + prefix}`);
        this.apiCall.defaults.baseURL = `${process.env.SERVER_URL + prefix}`;
    }

    async loginUser(input: UserLoginDto) {
        console.log(this.apiCall.defaults.baseURL);
        const res = await this.apiCall.post<IApiResponse<null>>('/login', input);
        return res;
    }

    async registerUser(input: UserRegisterDto) {
        const res = await this.apiCall.post<IApiResponse<null>>('/register', input);
        return res;
    }

    async forgotPasswordByEmail(input: ForgotPasswordEmailDto) {
        const res = await this.apiCall.post<IApiResponse<void>>('/otp-email', input);
        return res;
    }

    async forgotPasswordByPhone(input: ForgotPasswordPhoneDto) {
        const res = await this.apiCall.post<IApiResponse<void>>('/otp-sms', input);
        return res;
    }
}
export const authApi = new AuthAPI(http(), '/auth');
export default authApi;
