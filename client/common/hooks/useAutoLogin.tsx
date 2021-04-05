import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'universal-cookie';
import userApi from '../../api/user';
import { RootState, store } from '../../store';
import { authActions } from '../../store/auth';
import { IAuthState } from '../../store/auth/interface';

export function useAutoLogin() {
    const cookies = new Cookies();
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);

    useEffect(() => {
        const reToken = cookies.get('re-token');
        if (reToken) store.dispatch(authActions.updateLogin());
    }, []);

    useEffect(() => {
        if (authState.isLogin) store.dispatch(userApi.getLoginUser());
    }, [authState.isLogin]);
}

export default useAutoLogin;
