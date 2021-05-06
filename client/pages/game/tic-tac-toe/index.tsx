import * as React from 'react';
import { useSelector } from 'react-redux';

import XPlayerIcon from '../../../public/asset/icons/x-player';
import OPlayerIcon from '../../../public/asset/icons/o-player';
import { TTTAction, TicTacToeStatus, TicTacToeBoard, TicTacToePlayer } from '../../../components/game/tttBoard/config';
import { RoomIdDto } from '../../../common/interface/dto/roomIdDto';
import { useSocketIo } from '../../../common/hooks/useSocketIo';
import { AuthState, User } from '../../../store/auth/interface';
import { ServerResponse } from '../../../store/api/interface';
import routers from '../../../common/constants/router';
import { RootState } from '../../../store';

import TTTBoard from '../../../components/game/tttBoard';
import RouteProtectedWrapper from '../../../common/HOC/routeProtectedWrapper';
import PlayerInfo from '../../../components/game/playerInfo';
import GameTurn from '../../../components/game/gameTurn';
import GamePanel from '../../../components/game/panel';
import WaveLoading from '../../../components/loading/waveLoading';
import PanelRestart from '../../../components/game/panel/panelRestart';
import PanelStart from '../../../components/game/panel/panelStart';
import CheckIcon from '../../../public/asset/icons/check';
import SeoHead from '../../../components/common/seoHead';
import PanelReady from '../../../components/game/panel/panelReady';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import BtnLink from '../../../components/link/btnLink';
import { ticTacToeApi } from '../../../api/ticTacToe';
import TextField from '../../../components/form/textField';
import { useForm } from 'react-hook-form';
import useFormError from '../../../common/hooks/useFormError';
import BtnForm from '../../../components/btn/btnForm';

export interface TicTacToeForm {
    roomId: string;
}

const TicTacToe: React.FunctionComponent = () => {
    const { register, handleSubmit } = useForm<TicTacToeForm>({ defaultValues: { roomId: '' } });
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
                            <BtnForm label="Join Room" />
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
