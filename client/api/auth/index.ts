import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '..';
//* Import

import { UserLoginDto, UserRegisterDto, ForgotPasswordDto, ForgotPasswordUpdateDto } from './dto';
import { IApiResponse } from '../../store/api/interface';
import { AxiosStatic } from 'axios';

class AuthApi {
    constructor(private readonly apiCall: AxiosStatic) {
        apiCall.defaults.baseURL = process.env.SERVER_URL + '/auth';
    }

    loginUser = createAsyncThunk<null, UserLoginDto>('loginUser', async (input) => {
        await this.apiCall.post<IApiResponse<null>>('/login', input);
        return null;
    });

    registerUser = createAsyncThunk<null, UserRegisterDto>('registerUser', async (input) => {
        await this.apiCall.post<IApiResponse<null>>('/register', input);
        return null;
    });

    forgotPasswordCreate = createAsyncThunk<IApiResponse<void>, ForgotPasswordDto>('forgotPasswordCreate', async (input) => {
        const res = await this.apiCall.post<IApiResponse<void>>('/reset-password', input);
        return res.data;
    });

    forgotPasswordUpdate = createAsyncThunk<IApiResponse<void>, ForgotPasswordUpdateDto>('forgotPasswordUpdate', async (input) => {
        const res = await this.apiCall.put<IApiResponse<void>>('/reset-password', input);
        return res.data;
    });
}

export default new AuthApi(http);
