import http from '..';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosStatic } from 'axios';
//* Import

import { UserLoginDto, UserRegisterDto } from './dto';
import { IApiResponse } from '../../store/api/interface';

class AuthApi {
    constructor(private readonly apiCall: AxiosStatic) {
        apiCall.defaults.baseURL = `${process.env.REACT_APP_SERVER_URL}/auth`;
    }

    loginUser = createAsyncThunk<null, UserLoginDto>('loginUser', async (input) => {
        await this.apiCall.post<IApiResponse<null>>('/login', input);
        return null;
    });
    registerUser = createAsyncThunk<null, UserRegisterDto>('registerUser', async (input) => {
        const result = await this.apiCall.post<IApiResponse<null>>('/register', input);
        console.log(result);
        return null;
    });
}

export default new AuthApi(http);
