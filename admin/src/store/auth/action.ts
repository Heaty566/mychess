import { http, IApiResponse } from '../../service/http';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { UserLoginDto, UserRegisterDto, IUser } from './dto';

export const loginUser = createAsyncThunk<null, UserLoginDto>('loginUser', async (input) => {
    await http.post<IApiResponse<null>>('/auth/login', input);
    return null;
});

export const registerUser = createAsyncThunk<null, UserRegisterDto>('registerUser', async (input) => {
    await http.post<IApiResponse<null>>('/auth/register', input);
    return null;
});

export const getUserInfo = createAsyncThunk<IUser, void>('getInfoUser', async () => {
    const result = await http.get<IApiResponse<IUser>>('/user');
    return result.data.data;
});
