import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { apiReducer, ApiState } from './api';
import { authReducer, AuthState } from './auth';

export interface RootState {
        api: ApiState;
        auth: AuthState;
}

const reducers = combineReducers<RootState>({
        api: apiReducer,
        auth: authReducer,
});

export const store = configureStore({
        reducer: reducers,
        devTools: process.env.NODE_ENV === 'production' ? false : true,
});
