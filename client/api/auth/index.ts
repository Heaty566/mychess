import http from '../axios.helper';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserLoginDto, UserRegisterDto, ForgotPasswordEmailDto, ForgotPasswordPhoneDto } from './dto';
import { IApiResponse } from '../../store/api/interface';

export const authApi = {
    loginUser: createAsyncThunk<null, UserLoginDto>('UserLoginDto', async (input) => {
        await http.post<IApiResponse<null>>('/auth/login', input);
        return null;
    }),

    registerUser: createAsyncThunk<null, UserRegisterDto>('UserRegisterDto', async (input) => {
        await http.post<IApiResponse<null>>('/auth/register', input);
        return null;
    }),

    forgotPasswordByEmail: createAsyncThunk<IApiResponse<void>, ForgotPasswordEmailDto>('ForgotPasswordEmailDto', async (input) => {
        const res = await http.post<IApiResponse<void>>('/auth/otp-email', input);
        return res.data;
    }),

    forgotPasswordByPhone: createAsyncThunk<IApiResponse<void>, ForgotPasswordPhoneDto>('ForgotPasswordPhoneDto', async (input) => {
        const res = await http.post<IApiResponse<void>>('/auth/otp-sms', input);
        return res.data;
    }),
};

export default authApi;
