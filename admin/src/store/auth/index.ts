import { createSlice } from '@reduxjs/toolkit';
import { IAuthState } from './dto';
import { loginUser, getUserInfo } from './action';

const initialState: IAuthState = {
    email: '',
    name: '',
    avatarUrl: '',
    isLogin: false,
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
        builder.addCase(loginUser.fulfilled, (state) => {
            const newState = { ...state };
            newState.isLogin = true;
            return newState;
        });
        builder.addCase(getUserInfo.fulfilled, (state, { payload }) => {
            const { avatarUrl, email, name, role, username } = payload;
            const newState = { ...state, avatarUrl, email, name, role, username };
            newState.isLogin = true;
            console.log(newState);

            return newState;
        });
    },
});
export const authActions = {
    ...reducer.actions,
};
export const authReducer = reducer.reducer;
