import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { ApiState, ServerResponse } from '../../../common/interface/api.interface';
import { AuthState, User } from '../../../common/interface/user.interface';
import { GamePlayerFlag } from '../../../common/interface/game.interface';
import { RootState } from '../../../store';
import { TicTacToeBoard } from '../../../common/interface/tic-tac-toe.interface';
import { capitalize } from '../../../common/helpers/string.helper';
import chessApi from '../../../api/chessApi';
import routers from '../../../common/constants/router';
import ticTacToeApi from '../../../api/tttApi';

import SeoHead from '../../../components/common/seoHead';
import WaveLoading from '../../../components/loading/wave-loading';
import CardGameReport from '../../../components/card/card-game-report';
import EditIcons from '../../../public/asset/icons/edit';

export interface ProfileProps {
    user: User | null;
}

const Profile: React.FunctionComponent<ProfileProps> = ({ user }) => {
    const authState = useSelector<RootState, AuthState>((state) => state.auth);
    const apiState = useSelector<RootState, ApiState>((state) => state.api);
    const [totalWin, setTotalWin] = React.useState<number>(0);
    const [total, setTotal] = React.useState<number>(0);
    const [summaryFlag, setSummaryFlag] = React.useState(false);

    const [boards, setBoards] = React.useState<TicTacToeBoard[]>([]);

    React.useEffect(() => {
        if (user)
            if (summaryFlag) {
                chessApi.getAllGameByUserId(user.id).then((res) => {
                    setBoards(res.data.data.boards);
                    setTotalWin(res.data.data.totalWin);
                    setTotal(res.data.data.count);
                });
            } else
                ticTacToeApi.getAllGameByUserId(user.id).then((res) => {
                    setBoards(res.data.data.boards);
                    setTotalWin(res.data.data.totalWin);
                    setTotal(res.data.data.count);
                });
    }, [user, summaryFlag]);
    if (!user) return null;
    else
        return (
            <>
                <SeoHead title={capitalize(user.name)} isFollowPage canonical={`${routers.userProfile.link}/${user.id}`} imageUrl={user.avatarUrl} />

                <div className="relative flex flex-1">
                    <video
                        playsInline
                        autoPlay
                        muted
                        loop
                        className="absolute top-0 z-0 object-cover w-full h-full"
                        poster="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1263950/d7d28a52bd829aeee6989e58c3214e6c1cdbc5e3.jpg"
                    >
                        <source
                            src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1263950/cba7f6ad5a2a96638ff91e5900e17fa671d0385e.webm?fbclid=IwAR2lnhDiu_UzKVt5H4VjGhULyMB1GPhEBEm0276riR0MeAyKUnWfj2qQtUw"
                            type="video/webm"
                        />
                    </video>
                    <div className="relative flex-1 px-4 py-6 mx-auto space-y-2 md:w-5/6 xl:w-4/6 background-profile fade-in">
                        <div className="flex flex-col space-x-0 space-y-4 md:space-y-0 md:space-x-4 md:flex-row">
                            <div className="w-40 h-40 mx-auto md:mx-0">
                                <img className="object-cover w-40 h-40" src={user.avatarUrl} alt={user.name} />
                            </div>
                            <div>
                                <div className="flex flex-col items-center space-x-1 space-y-2 md:flex-row md:space-y-0">
                                    <h1 className="text-4xl text-white capitalize">{user.name}</h1>
                                    {authState.id === user.id && (
                                        <Link href={routers.userEdit.link}>
                                            <a
                                                href={routers.userEdit.link}
                                                className="flex items-center p-2 space-x-2 duration-300 rounded-sm text-mercury bg-woodsmoke hover:bg-woodsmoke-400"
                                            >
                                                <div>
                                                    <EditIcons />
                                                </div>
                                                <span>Edit Profile</span>
                                            </a>
                                        </Link>
                                    )}
                                </div>
                                <h3 className="text-lg capitalize text-cloud-700">{user.username}</h3>
                                <h3 className="mt-2 text-lg text-cloud">ELO: {user.elo}</h3>
                                <h3 className="mt-2 text-md text-cloud">JOIN: {user.createDate.split('T')[0]}</h3>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl text-mercury">History</h1>
                            <div className="flex flex-col px-4 py-2 space-y-1 text-lg bg-woodsmoke-500 text-mercury">
                                <div className="flex items-stretch space-x-2">
                                    <button
                                        onClick={() => setSummaryFlag(false)}
                                        className={`focus:outline-none  ${summaryFlag ? 'text-mercury-800' : 'text-white'}`}
                                    >
                                        Tic Tac Toe
                                    </button>
                                    <span className="inline-block w-0.5 bg-gray-500"></span>
                                    <button
                                        onClick={() => setSummaryFlag(true)}
                                        className={`focus:outline-none  ${!summaryFlag ? 'text-mercury-800' : 'text-white'}`}
                                    >
                                        Chess
                                    </button>
                                </div>
                                {Boolean(total) && (
                                    <div className="flex items-center justify-between">
                                        <p>Total Game: {total}</p>
                                        <p>Win Rate: {((totalWin / total) * 100).toFixed(2)}%</p>
                                        <p>Win Game: {totalWin}</p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2 ">
                                {apiState.isLoading && <WaveLoading />}
                                {!apiState.isLoading && (
                                    <>
                                        {!Boolean(boards.length) && <p className="text-xl text-mercury">No match is found</p>}
                                        {Boolean(boards.length) &&
                                            boards.map((item) => {
                                                const isWin = item.winner !== GamePlayerFlag.EMPTY && item.users[item.winner]?.id === user?.id;
                                                const currentPlayer = item.users.find((item) => item?.id === user?.id);
                                                const otherPlayer = item.users.find((item) => item?.id !== user?.id);
                                                const mmYY = new Date(item.startDate).toLocaleDateString();
                                                const mmHH = new Date(item.startDate).toLocaleTimeString();

                                                return (
                                                    <CardGameReport
                                                        changeOne={item.changeOne}
                                                        changeTwo={item.changeTwo}
                                                        currentPlayer={currentPlayer}
                                                        otherPlayer={otherPlayer}
                                                        time={{ mmHH, mmYY }}
                                                        isWin={isWin}
                                                        key={item.id}
                                                        winner={item.winner}
                                                    />
                                                );
                                            })}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
};

export async function getServerSideProps(context: GetServerSidePropsContext<{ userId: string }>): Promise<GetServerSidePropsResult<ProfileProps>> {
    const userId = context.params?.userId;
    if (!userId) return { redirect: { destination: '/404', permanent: false } };
    else {
        try {
            const user = await axios.get<ServerResponse<User>>(`${process.env.SERVER_INTER_URL}/api/user/${userId}`).then(({ data }) => data.data);

            return { props: { user } };
        } catch (err) {
            return { redirect: { destination: '/404', permanent: false } };
        }
    }
}

export default Profile;
