import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState, store } from '../../store';
import { AuthState } from '../../store/auth/interface';
import * as socketIo from 'socket.io-client';
import authThunk from '../../store/auth/thunk';

interface UseSocketIoProps {
    namespace: string;
}

export const useSocketIo = ({ namespace }: UseSocketIoProps) => {
    const authState = useSelector<RootState, AuthState>((state) => state.auth);
    const ioClient = React.useRef<SocketIOClient.Socket>(socketIo.connect(`${process.env.SERVER_URL}/${namespace}`));

    React.useEffect(() => {
        if (authState.isSocketLogin) {
            ioClient.current.on('exception', (data: any) => {
                console.log(data);
            });
        } else store.dispatch(authThunk.getSocketToken());
    }, [authState.isSocketLogin]);
    return ioClient.current;
};

export default useSocketIo;
