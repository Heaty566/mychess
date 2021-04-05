import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IJoiError, IApiState } from './interface';

import authApi from '../../api/auth';

const initialState: IApiState = {
    isLoading: false,
    errorDetails: {},
    isError: false,
    message: '',
};

const reducer = createSlice({
    name: 'api',
    initialState,
    reducers: {
        initReq: (state) => ({ ...state, isLoading: true, isError: false }),
        resetState: (state) => ({ ...initialState }),
        updateErrorDetails: (state, { payload }: PayloadAction<IJoiError>) => {
            const newState = { ...state };
            newState.errorDetails = payload;
            newState.isError = true;
            return newState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(authApi.forgotPasswordByEmail.fulfilled, (state, { payload }) => {
            const newState = { ...state };
            newState.message = payload.message;

            return newState;
        });
        builder.addCase(authApi.forgotPasswordUpdate.fulfilled, (state, { payload }) => {
            const newState = { ...state };
            newState.message = payload.message;

            return newState;
        });
    },
});

export const apiActions = {
    ...reducer.actions,
};
export const apiReducer = reducer.reducer;
