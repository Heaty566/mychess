import * as React from 'react';
import { useSelector } from 'react-redux';

import userThunk from '../../store/auth/userThunk';
import { RootState, store } from '../../store';
import { IAuthState } from '../../store/auth/interface';

const AutoLoginWrapper: React.FunctionComponent = ({ children }) => {
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);

    React.useEffect(() => {
        if (authState.isLogin) store.dispatch(userThunk.getCurrentUser());
    }, [authState.isLogin]);
    return <>{children}</>;
};

export default AutoLoginWrapper;
