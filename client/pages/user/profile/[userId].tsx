import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { useSelector } from 'react-redux';
import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';

import { RootState } from '../../../store';
import SeoHead from '../../../components/common/seoHead';
import { capitalize } from '../../../common/helpers/string.helper';
import { ServerResponse } from '../../../store/api/interface';
import { AuthState, User } from '../../../store/auth/interface';

import EditIcons from '../../../public/asset/icons/edit';
import routers from '../../../common/constants/router';

export interface ProfileProps {
    user: User | null;
}

const Profile: React.FunctionComponent<ProfileProps> = ({ user }) => {
    const authState = useSelector<RootState, AuthState>((state) => state.auth);

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
                    <div className="relative flex-1 px-4 py-6 mx-auto md:w-5/6 xl:w-4/6 background-profile fade-in">
                        <div className="flex flex-col h-full space-x-0 space-y-4 md:space-y-0 md:space-x-4 md:flex-row">
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
