import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JoiError } from "./dto";

export interface ApiState {
        isLoading: boolean;
        errorDetails: JoiError;
        isError: boolean;
        message: string;
}
const initialState: ApiState = {
        isLoading: false,
        errorDetails: {},
        isError: false,
        message: "",
};

const reducer = createSlice({
        name: "api",
        initialState,
        reducers: {
                initReq: (state) => {
                        state.isLoading = true;
                },
                resetState: (state) => {
                        const newState = { ...state };
                        newState.isLoading = false;
                        newState.errorDetails = initialState.errorDetails;
                        newState.isError = initialState.isError;
                        newState.message = "";
                        return newState;
                },
                updateErrorDetails: (state, { payload }: PayloadAction<JoiError>) => {
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
