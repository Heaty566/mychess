import * as React from 'react';

import { RoomIdDto } from '../../../common/interface/dto/ttt.dto';

import routers from '../../../common/constants/router';

import RouteProtectedWrapper from '../../../common/HOC/routeProtectedWrapper';

import SeoHead from '../../../components/common/seoHead';
import { useRouter } from 'next/router';
import { ticTacToeApi } from '../../../api/tttApi';
import TextField from '../../../components/form/filed-textfield';
import { useForm } from 'react-hook-form';
import useFormError from '../../../common/hooks/useFormError';
import BtnForm from '../../../components/btn/btn-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ApiState } from '../../../common/interface/api.interface';
import WaveLoading from '../../../components/loading/wave-loading';

export interface TicTacToeForm {
    roomId: string;
}

const TicTacToe: React.FunctionComponent = () => {
    const { register, handleSubmit } = useForm<TicTacToeForm>({ defaultValues: { roomId: '' } });
    const apiState = useSelector<RootState, ApiState>((state) => state.api);
    const errors = useFormError<TicTacToeForm>({ roomId: '' });
    const router = useRouter();

    const handleOnSubmit = async (data: RoomIdDto) => {
        ticTacToeApi.joinRoom(data).then(() => {
            router.push(`${routers.ticTacToePvP.link}/${data.roomId}`);
        });
    };

    const handleOnCreateNewRoom = async () => {
        await ticTacToeApi.createNewPvPRoom().then((res) => {
            router.push(`${routers.ticTacToePvP.link}/${res.data.data.roomId}`);
        });
    };
    return (
        <>
            <SeoHead {...routers.ticTacToePvP.header} />
            <RouteProtectedWrapper isNeedLogin>
                <div className="grid flex-1 md:p-8 n chess-bg place-items-center grid-rows-max">
                    <div className="w-full max-w-md px-4 py-12 space-y-4 bg-gray-800 rounded-sm shadow-sm fade-iw-full md:px-10 fade-in">
                        <form className="space-y-2" onSubmit={handleSubmit(handleOnSubmit)}>
                            <h1 className="text-4xl text-center text-white mb-7">Tic-Tac-Toe Lobby</h1>
                            <TextField name="roomId" type="text" label="Room ID" error={errors.roomId} register={register} />
                            {apiState.isLoading && <WaveLoading />}
                            {!apiState.isLoading && <BtnForm label="Join Room" />}
                        </form>
                        <p className="my-2 text-center text-mercury">Or Create New Room</p>
                        <BtnForm label="Create New Room" type="button" handleOnClick={() => handleOnCreateNewRoom()} />
                    </div>
                </div>
            </RouteProtectedWrapper>
        </>
    );
};

export default TicTacToe;
