import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { JoiError, ApiState, ServerResponse } from '../../common/interface/api.interface';

const initialState: ApiState = {
    isLoading: false,
    errorDetails: {},
    isError: false,
    message: '',
    errorMessage: '',
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
            if (payload?.errorMessage) newState.errorMessage = payload.errorMessage;

            newState.errorDetails = payload;
            newState.isError = true;
            return newState;
        },
        updateSuccessMessage: (state, { payload }: PayloadAction<ServerResponse<any>>) => ({ ...state, message: payload.details.message || '' }),
    },
    extraReducers: (builder) => {},
});

export const apiActions = {
    ...reducer.actions,
};
export const apiReducer = reducer.reducer;
