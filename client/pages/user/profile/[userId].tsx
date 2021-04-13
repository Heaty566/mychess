import * as React from 'react';
import EditIcons from '../../../public/asset/icons/edit.svg';
import { userAPI } from '../../../api/user';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { IAuthState, IUser } from '../../../store/auth/interface';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import routers from '../../../common/constants/router';
import SeoHead from '../../../components/common/seoHead';
import Link from 'next/link';

export interface ProfileProps {
    user: IUser | null;
}

const Profile: React.FunctionComponent<ProfileProps> = ({ user }) => {
    const router = useRouter();
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);

    React.useEffect(() => {
        if (!user) router.push('/404');
    }, [user]);

    if (!user) return null;
    else
        return (
            <>
                <SeoHead title={user.name} isFollowPage canonical={`${routers.userProfile.link}/${user.id}`} imageUrl={user.avatarUrl} />

                <div className="relative flex-1">
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
                    <div className="relative w-full px-4 py-6 m-auto md:w-5/6 xl:w-4/6 background-profile">
                        <div className="flex space-x-4">
                            <div className="h-40">
                                <img className="object-cover w-40 h-40" src={user.avatarUrl} alt={user.name} />
                            </div>
                            <div>
                                <div className="flex items-center space-x-1">
                                    <h1 className="text-4xl text-white capitalize">{user.name}</h1>
                                    {authState.id === user.id && (
                                        <Link href={routers.userEdit.link}>
                                            <a href={routers.userEdit.link}>
                                                <EditIcons />
                                            </a>
                                        </Link>
                                    )}
                                </div>
                                <h3 className="text-lg capitalize text-cloud-700">{user.username}</h3>
                                <h3 className="mt-2 text-lg text-cloud">ELO: {user.elo}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
};

export async function getServerSideProps(context: GetServerSidePropsContext<{ userId: string }>): Promise<GetServerSidePropsResult<ProfileProps>> {
    const userId = context.params?.userId;
    if (!userId) return { props: { user: null } };
    else {
        try {
            const user = await userAPI.getUserById(userId).then((res) => res.data.data);
            return { props: { user: JSON.parse(JSON.stringify(user)) } };
        } catch (err) {
            return { props: { user: null } };
        }
    }
}

export default Profile;
