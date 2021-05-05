import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { JoiError, ApiState, ServerResponse } from './interface';
import { authThunk } from '../auth/thunk';

const initialState: ApiState = {
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
        setLoading: (state, { payload: { isLoading } }) => ({ ...state, isLoading }),
        resetState: (_) => ({ ...initialState }),
        updateErrorDetails: (state, { payload }: PayloadAction<JoiError>) => {
            const newState = { ...state };
            newState.errorDetails = payload;
            newState.isError = true;
            return newState;
        },
        updateSuccessMessage: (state, { payload }: PayloadAction<ServerResponse<any>>) => ({ ...state, message: payload.message || '' }),
    },
    extraReducers: (builder) => {},
});

export const apiActions = {
    ...reducer.actions,
};
export const apiReducer = reducer.reducer;
