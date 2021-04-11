import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { IAuthState } from '../../store/auth/interface';
import { RootState } from '../../store';

export interface RouteProtectedProps {
    isNeedLogin?: boolean;
}

export const RouteProtectedWrapper: React.FunctionComponent<RouteProtectedProps> = ({ isNeedLogin = false, children }) => {
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!authState.isLogin && isNeedLogin) {
            router.push('/auth/login');
        } else if (!isNeedLogin && authState.isLogin) {
            router.push('/');
        }
    }, [authState.isLogin]);

    return <>{children}</>;
};

export default RouteProtectedWrapper;
