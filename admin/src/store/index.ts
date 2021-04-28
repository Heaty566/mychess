import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { apiReducer } from './api';
import { authReducer } from './auth';

import { IApiState } from './api/interface';
import { IAuthState } from './auth/dto';

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
    devTools: process.env.NODE_ENV !== 'production',
});
