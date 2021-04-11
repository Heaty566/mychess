import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IJoiError, IApiState, IApiResponse } from './interface';
import { authThunk } from '../auth/thunk';

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
        resetState: (_) => ({ ...initialState }),
        updateErrorDetails: (state, { payload }: PayloadAction<IJoiError>) => {
            const newState = { ...state };
            newState.errorDetails = payload;
            newState.isError = true;
            return newState;
        },
        updateSuccessMessage: (state, { payload }: PayloadAction<IApiResponse<any>>) => ({ ...state, message: payload.message || '' }),
    },
    extraReducers: (builder) => {},
});

export const apiActions = {
    ...reducer.actions,
};
export const apiReducer = reducer.reducer;
