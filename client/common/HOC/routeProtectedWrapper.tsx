import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import routers from '../constants/router';
import { AuthState } from '../../store/auth/interface';
import { RootState, store } from '../../store';
import { ApiState } from '../../store/api/interface';
import WaveLoading from '../../components/loading/waveLoading';
import { apiActions } from '../../store/api';

export interface RouteProtectedProps {
    isNeedLogin?: boolean;
}

export const RouteProtectedWrapper: React.FunctionComponent<RouteProtectedProps> = ({ isNeedLogin = false, children }) => {
    const authState = useSelector<RootState, AuthState>((state) => state.auth);
    const apiState = useSelector<RootState, ApiState>((state) => state.api);
    const router = useRouter();
    const [isGetUser, setIsGetUser] = useState(false);

    useEffect(() => {
        store.dispatch(apiActions.setLoading(true));
        setIsGetUser(true);
    }, []);

    useEffect(() => {
        if (!apiState.isLoading && isGetUser) {
            if (!authState.isLogin && isNeedLogin) router.push(routers.login.link);
            else if (!isNeedLogin && authState.isLogin) router.push(routers.home.link);
        }
    }, [authState.isLogin, isGetUser]);

    return (
        <>
            {apiState.isLoading && !isGetUser ? (
                <div className="flex items-center justify-center flex-1 w-full ">
                    <WaveLoading />
                </div>
            ) : (
                children
            )}
        </>
    );
};

export default RouteProtectedWrapper;
