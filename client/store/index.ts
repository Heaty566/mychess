import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { apiReducer } from './api';
import { IApiState } from './api/interface';
import { authReducer } from './auth';
import { IAuthState } from './auth/interface';

export interface RootState {
        api: IApiState;
        auth: IAuthState;
}

const reducers = combineReducers<RootState>({
        api: apiReducer,
        auth: authReducer,
});

export const store = configureStore({
        reducer: reducers,
        devTools: process.env.NODE_ENV === 'production',
});
