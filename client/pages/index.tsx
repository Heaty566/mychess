import * as React from 'react';
import TicTacToeIcon from '../public/asset/icons/tictactoe.svg';
import RobotIcon from '../public/asset/icons/robot.svg';
import PlayerBlueIcon from '../public/asset/icons/player-blue.svg';
import PlayerIcon from '../public/asset/icons/player.svg';
import Link from 'next/link';

export interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = () => (
    <div className="flex-1 chess-bg">
        <div className="max-w-4xl mx-auto my-16">
            <div>Find Match</div>
            <div className="grid grid-cols-2 grid-rows-2 gap-10 ">
                <Link href="/">
                    <a
                        href="/"
                        className="p-4 space-y-4 duration-100 transform rounded-md shadow-xl bg-woodsmoke-500 hover:scale-105 hover:bg-gray-900"
                    >
                        <div className="text-center ">
                            <h1 className="text-3xl font-bold text-mercury">Tic Tac Toe</h1>
                            <h2 className="font-medium text-mercury-600">Player VS BOT</h2>
                            <div className="w-1/2 h-1 mx-auto bg-gray-600"></div>
                        </div>
                        <div className="flex items-center justify-around">
                            <div>
                                <PlayerIcon />
                            </div>
                            <div>
                                <TicTacToeIcon />
                            </div>
                            <div>
                                <RobotIcon />
                            </div>
                        </div>
                    </a>
                </Link>
                <Link href="/">
                    <a
                        href="/"
                        className="p-4 space-y-4 duration-100 transform rounded-md shadow-xl bg-woodsmoke-500 hover:scale-105 hover:bg-gray-900"
                    >
                        <div className="text-center ">
                            <h1 className="text-3xl font-bold text-mercury">Chess</h1>
                            <h2 className="font-medium text-mercury-600">Player VS BOT</h2>
                            <div className="w-1/2 h-1 mx-auto bg-gray-600"></div>
                        </div>
                        <div className="flex items-center justify-around">
                            <div>
                                <PlayerIcon />
                            </div>
                            <div>
                                <TicTacToeIcon />
                            </div>
                            <div>
                                <RobotIcon />
                            </div>
                        </div>
                    </a>
                </Link>
                <Link href="/">
                    <a
                        href="/"
                        className="p-4 space-y-4 duration-100 transform rounded-md shadow-xl bg-woodsmoke-500 hover:scale-105 hover:bg-gray-900"
                    >
                        <div className="text-center ">
                            <h1 className="text-3xl font-bold text-mercury">Tic Tac Toe</h1>
                            <h2 className="font-medium text-mercury-600">Player VS Player</h2>
                            <div className="w-1/2 h-1 mx-auto bg-gray-600"></div>
                        </div>
                        <div className="flex items-center justify-around">
                            <div>
                                <PlayerIcon />
                            </div>
                            <div>
                                <TicTacToeIcon />
                            </div>
                            <div>
                                <PlayerBlueIcon />
                            </div>
                        </div>
                    </a>
                </Link>
                <Link href="/">
                    <a
                        href="/"
                        className="p-4 space-y-4 duration-100 transform rounded-md shadow-xl bg-woodsmoke-500 hover:scale-105 hover:bg-gray-900"
                    >
                        <div className="text-center ">
                            <h1 className="text-3xl font-bold text-mercury">Tic Tac Toe</h1>
                            <h2 className="font-medium text-mercury-600">Player VS Player</h2>
                            <div className="w-1/2 h-1 mx-auto bg-gray-600"></div>
                        </div>
                        <div className="flex items-center justify-around">
                            <div>
                                <PlayerIcon />
                            </div>
                            <div>
                                <TicTacToeIcon />
                            </div>
                            <div>
                                <PlayerBlueIcon />
                            </div>
                        </div>
                    </a>
                </Link>
            </div>
        </div>
    </div>
);

export default Home;
