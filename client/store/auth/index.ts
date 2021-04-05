import { createSlice } from '@reduxjs/toolkit';
import { IAuthState } from './interface';
import { authApi } from '../../api/auth';
import { userApi } from '../../api/user';
import Cookies from 'universal-cookie';

const initialState: IAuthState = {
    email: '',
    username: '',
    name: '',
    elo: 0,
    id: '',
    phoneNumber: '',
    avatarUrl: '',
    isLogin: false,
};

const reducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuth: () => ({ ...initialState }),
        updateLogin: (state) => ({ ...state, isLogin: true }),
    },
    extraReducers: (builder) => {
        builder.addCase(userApi.getLoginUser.fulfilled, (state, { payload }) => {
            const newState = { ...state };
            newState.name = payload.name;
            newState.username = payload.username;
            newState.phoneNumber = payload.phoneNumber;
            newState.email = payload.email;
            newState.elo = payload.elo;
            newState.id = payload.id;
            newState.avatarUrl = payload.avatarUrl;

            return newState;
        });
        builder.addCase(authApi.loginUser.fulfilled, (state) => ({ ...state, isLogin: true }));
        builder.addCase(authApi.registerUser.fulfilled, (state) => ({ ...state, isLogin: true }));
        builder.addCase(userApi.getLoginUser.rejected, (state) => {
            const cookies = new Cookies();
            cookies.remove('re-token');
            cookies.remove('auth-token');

            return {
                ...state,
                isLogin: false,
            };
        });
    },
});
export const authActions = {
    ...reducer.actions,
};
export const authReducer = reducer.reducer;
