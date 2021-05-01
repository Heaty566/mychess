import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IJoiError, IApiState } from './interface';

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
        setLoading: (state, { payload: { isLoading } }) => {
            console.log(isLoading);
        },
        resetState: (state) => ({ ...initialState }),
        updateErrorDetails: (state, { payload }: PayloadAction<IJoiError>) => {
            const newState = { ...state };
            newState.errorDetails = payload;
            newState.isError = true;
            return newState;
        },
    },
    extraReducers: (builder) => {},
});

export const apiActions = {
    ...reducer.actions,
};
export const apiReducer = reducer.reducer;
