import * as React from 'react';
import { useSelector } from 'react-redux';
import * as socketIo from 'socket.io-client';

import { RootState, store } from '../../store';
import { AuthState } from '../interface/user.interface';
import authThunk from '../../store/auth/thunk';

interface UseSocketIoProps {
    namespace: string;
}

export const useSocketIo = ({ namespace }: UseSocketIoProps) => {
    const ioClient = React.useMemo(() => {
        return socketIo.connect(`${process.env.SERVER_URL}/${namespace}`);
    }, []);

    const authState = useSelector<RootState, AuthState>((state) => state.auth);

    React.useEffect(() => {
        if (authState.isSocketLogin) {
            ioClient.on('exception', (data: any) => {
                console.log(data);
            });
        } else store.dispatch(authThunk.getSocketToken());
    }, [authState.isSocketLogin]);
    return ioClient;
};

export default useSocketIo;
