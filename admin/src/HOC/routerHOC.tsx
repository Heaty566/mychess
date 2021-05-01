import * as React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import { RootState, store } from '../store';
import { IAuthState } from '../store/auth/dto';
import { IApiState } from '../store/api/interface';
import { apiActions } from '../store/api';
import Loading from '../components/loading';

export interface UserRouterProps {
    Component: React.FunctionComponent;
    path: string;
    redirectTo: string;
}

const UserRouter: React.FunctionComponent<UserRouterProps> = ({ Component, path, redirectTo }) => {
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);
    const apiState = useSelector<RootState, IApiState>((state) => state.api);
    const [isGetUser, setIsGetUser] = React.useState(false);

    React.useEffect(() => {
        store.dispatch(apiActions.setLoading(true));
        if (authState.isLogin) setIsGetUser(true);
    }, [authState.isLogin, isGetUser]);

    const test = React.useMemo(() => {
        if (!isGetUser) {
            console.log('1');
            return <Redirect push to={redirectTo} />;
        }
        console.log('2');
        return <Component />;
    }, [isGetUser]);

    React.useEffect(() => {
        console.log(`api:${apiState.isLoading}`);
        console.log(`isGetUser:${isGetUser}`);
    }, [apiState.isLoading, isGetUser]);

    return <Route path={path}>{isGetUser ? test : <Loading />}</Route>;
};

export default UserRouter;
