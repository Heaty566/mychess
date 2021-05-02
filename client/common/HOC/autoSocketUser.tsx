import * as React from 'react';
import { useSelector } from 'react-redux';

import * as io from 'socket.io-client';
import { RootState, store } from '../../store';
import { AuthState } from '../../store/auth/interface';
import authThunk from '../../store/auth/thunk';

export interface AutoSocketUserProps {
    ioConnect: SocketIOClient.Socket;
}

const AutoSocketUser: React.FunctionComponent<AutoSocketUserProps> = ({ children, ioConnect }) => {
    const authState = useSelector<RootState, AuthState>((state) => state.auth);

    React.useEffect(() => {
        if (authState.isSocketLogin) {
            ioConnect.on('exception', (data: any) => {
                console.log('hello');
                console.log(data);
            });

            ioConnect.on('connect-user', (data: any) => {
                console.log('hello');
                console.log(data);
            });

            // ioConnect.emit('connect-user', {});
        } else {
            store.dispatch(authThunk.getSocketToken());
        }
    }, [authState.isSocketLogin]);
    return <>{children}</>;
};

export default AutoSocketUser;
