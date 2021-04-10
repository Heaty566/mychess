import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { IAuthState } from '../../store/auth/interface';
import { RootState } from '../../store';
export interface UserRouterProps<T> {
    Component: Function;
    props: T;
    isNeedLogin?: boolean;
}

export const RouteGuard = <T extends any>({ Component, props, isNeedLogin = false }: UserRouterProps<T>) => {
    const Render: React.FunctionComponent<UserRouterProps<T>> = ({ Component, props, isNeedLogin = false }) => {
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

    return Render({ Component, props, isNeedLogin });
};
