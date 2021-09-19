import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserLoginDto, UserRegisterDto, ForgotPasswordEmailDto, ForgotPasswordPhoneDto } from '../../common/interface/dto/auth.dto';
import { authApi } from '../../api/authApi';
import { ServerResponse } from '../../common/interface/api.interface';

export const authThunk = {
    loginUser: createAsyncThunk<null, UserLoginDto>('UserLoginDto', async (input) => {
        await authApi.loginUser(input);
        return null;
    }),

    logoutUser: createAsyncThunk<null, void>('LogoutUser', async () => {
        await authApi.logoutUser();
        return null;
    }),

    getSocketToken: createAsyncThunk<null, void>('getSocketToken', async () => {
        await authApi.getSocketToken();
        return null;
    }),

    registerUser: createAsyncThunk<null, UserRegisterDto>('UserRegisterDto', async (input) => {
        await authApi.registerUser(input);
        return null;
    }),

    forgotPasswordByEmail: createAsyncThunk<ServerResponse<void>, ForgotPasswordEmailDto>('ForgotPasswordEmailDto', async (input) => {
        const res = await authApi.forgotPasswordByEmail(input);
        return res.data;
    }),

    forgotPasswordByPhone: createAsyncThunk<ServerResponse<void>, ForgotPasswordPhoneDto>('ForgotPasswordPhoneDto', async (input) => {
        const res = await authApi.forgotPasswordByPhone(input);
        return res.data;
    }),
};
