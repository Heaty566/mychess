import http from '../axios.helper';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IApiResponse } from '../../store/api/interface';
import { IUser } from '../../store/auth/interface';

export const userApi = {
    getLoginUser: createAsyncThunk<IUser, void>('getLoginUser', async () => {
        const res = await http.get<IApiResponse<IUser>>('/user');
        return res.data.data;
    }),
};

export default userApi;
