import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { apiReducer } from './api';
import { ApiState } from './api/interface';
import { authReducer } from './auth';
import { AuthState } from './auth/interface';

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
    devTools: process.env.NODE_ENV !== 'production',
});
