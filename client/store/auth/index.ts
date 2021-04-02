import { createSlice } from '@reduxjs/toolkit';
import { IAuthState } from './interface';
import authApi from '../../api/auth';

const initialState: IAuthState = {
        email: '',
        name: '',
        avatarUrl: '',
        isLogin: false,
        isPremium: false,
        role: 'USER',
        username: '',
};

const reducer = createSlice({
        name: 'auth',
        initialState,
        reducers: {
                resetAuth: () => {
                        return { ...initialState };
                },
        },
        extraReducers: (builder) => {
                builder.addCase(authApi.loginUser.fulfilled, (state) => {
                        const newState = { ...state };
                        newState.isLogin = true;
                        return newState;
                });
                builder.addCase(authApi.registerUser.fulfilled, (state) => {
                        const newState = { ...state };
                        newState.isLogin = true;
                        return newState;
                });
        },
});
export const authActions = {
        ...reducer.actions,
};
export const authReducer = reducer.reducer;
