import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

//* Import
import { RootState } from '../../store';
import { IAuthState } from '../../store/auth/interface';
export interface UserRouterProps {
    Component: Function;
    props: any;
    isNeedLogin?: boolean;
}

export const RouteGuard: React.FunctionComponent<UserRouterProps> = ({ Component, props, isNeedLogin = false }) => {
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!authState.isLogin && isNeedLogin) {
            router.push('/auth/login');
        } else if (!isNeedLogin && authState.isLogin) {
            router.push('/');
        }
    }, [authState.isLogin]);

    return <Component {...props} />;
};
