import http from '..';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosStatic } from 'axios';
//* Import

import { UserLoginDto, UserRegisterDto, ForgotPasswordEmailDto, ForgotPasswordUpdateDto, ForgotPasswordPhoneDto } from './dto';
import { IApiResponse } from '../../store/api/interface';

class AuthApi {
    constructor(private readonly apiCall: AxiosStatic) {
        apiCall.defaults.baseURL = `${process.env.SERVER_URL}/auth`;
    }

    loginUser = createAsyncThunk<null, UserLoginDto>('UserLoginDto', async (input) => {
        await this.apiCall.post<IApiResponse<null>>('/login', input);
        return null;
    });

    registerUser = createAsyncThunk<null, UserRegisterDto>('UserRegisterDto', async (input) => {
        await this.apiCall.post<IApiResponse<null>>('/register', input);
        return null;
    });

    forgotPasswordByEmail = createAsyncThunk<IApiResponse<void>, ForgotPasswordEmailDto>('ForgotPasswordEmailDto', async (input) => {
        const res = await this.apiCall.post<IApiResponse<void>>('/otp-email', input);
        return res.data;
    });

    forgotPasswordByPhone = createAsyncThunk<IApiResponse<void>, ForgotPasswordPhoneDto>('ForgotPasswordPhoneDto', async (input) => {
        const res = await this.apiCall.post<IApiResponse<void>>('/otp-sms', input);
        return res.data;
    });

    forgotPasswordUpdate = createAsyncThunk<IApiResponse<void>, ForgotPasswordUpdateDto>('ForgotPasswordUpdateDto', async (input) => {
        const res = await this.apiCall.put<IApiResponse<void>>('/reset-password', input);
        return res.data;
    });
}

export default new AuthApi(http);
