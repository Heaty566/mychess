import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

//* Import
import { RootState } from '../store';
import { AuthState } from '../store/auth';
export interface UserRouterProps {
        Component: Function;
        props: any;
        isNeedLogin?: boolean;
        role?: 'USER' | 'ADMIN';
}

export const RouterHOC: React.FunctionComponent<UserRouterProps> = ({ Component, props, isNeedLogin = false, role = 'USER' }) => {
        const authState = useSelector<RootState, AuthState>((state) => state.auth);
        const router = useRouter();

        useEffect(() => {
                if (!authState.isLogin && isNeedLogin) {
                        router.push('/user/login');
                } else if (isNeedLogin && role === 'ADMIN' && authState.role === 'USER') {
                        router.push('/');
                } else if (!isNeedLogin && authState.isLogin) {
                        router.push('/');
                }
        }, [authState.isLogin]);

        return <Component {...props} />;
};
