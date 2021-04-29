import * as React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { RootState } from '../store';
import { IAuthState } from '../store/auth/dto';

export interface UserRouterProps {
    Component: React.FunctionComponent;
    props: any;
    isNeedLogin?: boolean;
    role?: 'USER' | 'ADMIN';
}

const UserRouter: React.FunctionComponent<UserRouterProps> = ({ Component, props, isNeedLogin = false, role = 'USER' }) => {
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);

    const RouterHOC = React.useMemo(() => {
        if (!authState.isLogin && isNeedLogin) return <Redirect push to="/login" />;
        else if (isNeedLogin && role === 'ADMIN' && authState.role === 'USER') return <Redirect push to="/" />;
        return null;
    }, [authState.isLogin]);

    return RouterHOC ? RouterHOC : <Component {...props} />;
};

export default UserRouter;
