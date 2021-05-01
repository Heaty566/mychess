import * as React from 'react';
import { useSelector } from 'react-redux';

import * as io from 'socket.io-client';
import { RootState, store } from '../../store';
import { AuthState } from '../../store/auth/interface';
import authThunk from '../../store/auth/thunk';

export interface AutoSocketUserProps {
    namespace: string;
}

const AutoSocketUser: React.FunctionComponent<AutoSocketUserProps> = ({ children, namespace }) => {
    const authState = useSelector<RootState, AuthState>((state) => state.auth);
    const ioUser = io.connect(`http://localhost:4000/${namespace}`);
    React.useEffect(() => {
        if (authState.isSocketLogin) {
            console.log('call socket');
            ioUser.on('exception', (data: any) => {
                console.log('hello');
                console.log(data);
            });
            ioUser.on('connect-user', (data: any) => {
                console.log('hello');
                console.log(data);
            });

            ioUser.emit('connect-user', {});
        } else {
            store.dispatch(authThunk.getSocketToken());
        }
    }, [authState.isSocketLogin]);
    return <>{children}</>;
};

export default AutoSocketUser;
