import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//* Import
import { registerUser } from "./action";

export interface UserInfo {
        username: string;
        fullName: string;
        email: string;
        avatarUrl: string;
        isPremium: boolean;
        role: string;
}

export interface AuthState extends UserInfo {
        isLogin: boolean;
}

const initialState: AuthState = {
        email: "",
        fullName: "",
        avatarUrl: "",
        isLogin: false,
        isPremium: false,
        role: "USER",
        username: "",
};

const auth = createSlice({
        name: "auth",
        initialState,
        reducers: {
                resetAuth: () => {
                        return initialState;
                },
        },
        extraReducers: (builder) => {
                builder.addCase(registerUser.fulfilled, (state) => {
                        state.isLogin = true;
                        return state;
                });
        },
});

export const authActions = {
        registerUser,
        resetAuth: auth.actions.resetAuth,
};
export const authReducer = auth.reducer;
