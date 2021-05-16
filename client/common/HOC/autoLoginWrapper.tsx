import * as React from 'react';
import { useSelector } from 'react-redux';

import userThunk from '../../store/auth/userThunk';
import { RootState, store } from '../../store';
import { AuthState } from '../../common/interface/user.interface';

const AutoLoginWrapper: React.FunctionComponent = ({ children }) => {
    const authState = useSelector<RootState, AuthState>((state) => state.auth);

    React.useEffect(() => {
        if (authState.isLogin) store.dispatch(userThunk.getCurrentUser());
    }, [authState.isLogin]);
    return <>{children}</>;
};

export default AutoLoginWrapper;
