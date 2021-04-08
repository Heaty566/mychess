import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IJoiError, IApiState } from './interface';
import { authThunk } from '../auth/thunk';

const initialState: IApiState = {
    isLoading: false,
    errorDetails: {},
    isError: false,
    message: '122222222',
};

const reducer = createSlice({
    name: 'api',
    initialState,
    reducers: {
        initReq: (state) => ({ ...state, isLoading: true, isError: false }),
        resetState: (_) => ({ ...initialState }),
        updateErrorDetails: (state, { payload }: PayloadAction<IJoiError>) => {
            const newState = { ...state };
            newState.errorDetails = payload;
            newState.isError = true;
            return newState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(authThunk.forgotPasswordByEmail.fulfilled, (state, { payload }) => {
            const newState = { ...state };
            newState.message = payload.message;

            return newState;
        });
        builder.addCase(authThunk.forgotPasswordByPhone.fulfilled, (state, { payload }) => {
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
