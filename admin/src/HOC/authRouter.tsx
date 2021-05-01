import * as React from 'react';

import { RootState } from '../store';
import { IAuthState } from '../store/auth/dto';
import { useSelector } from 'react-redux';

import { Redirect, Route } from 'react-router-dom';

export interface AuthRouterProps {
    Component: React.FunctionComponent;
    path: string;
}

const AuthRouter: React.FunctionComponent<AuthRouterProps> = ({ Component, path }) => {
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);
    return <Route path={path}>{authState.isLogin ? <Redirect push to="./" /> : <Component />};</Route>;
};

export default AuthRouter;
