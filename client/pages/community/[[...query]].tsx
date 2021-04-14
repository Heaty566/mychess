import { useRouter } from 'next/router';
import * as React from 'react';
import routers from '../../common/constants/router';
import { userAPI } from '../../api/user';
import { CommonUser } from '../../api/user/dto';
import Link from 'next/link';
import WaveLoading from '../../components/loading/waveLoading';
import Pagination from '../../components/pagination';
import { GetServerSidePropsContext } from 'next';
import FindIcon from '../../public/asset/icons/find.svg';
import TextField from '../../components/form/textField';
import { useDebounce } from '../../common/hooks/useDebounce';
import { useForm } from 'react-hook-form';

export interface CommunityQuery {
    currentPage: string;
    pageSize: string;
    name: string;
}

export interface CommunityProps {
    query: CommunityQuery;
}

const Community: React.FunctionComponent<CommunityProps> = ({ query }) => {
    const [users, setUsers] = React.useState<Array<CommonUser>>([]);
    const [name, setName] = React.useState('');

    const debounceValue = useDebounce(name, 700);
    const router = useRouter();
    const [isLoadUsers, setLoadUsers] = React.useState(false);

    React.useEffect(() => {
        if ((query.name || query.name === '') && query.currentPage && query.pageSize) {
            const { currentPage, name, pageSize } = query;
            userAPI.searchUsers(name, currentPage, pageSize).then(({ data }) => {
                setUsers(data.data);
                setLoadUsers(true);
            });
        } else router.push(routers.community.link);
    }, [query]);

    React.useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('name', name);
        url.searchParams.set('currentPage', '0');
        url.searchParams.set('pageSize', '12');
        router.push(url.pathname + url.search);
    }, [debounceValue]);

    const handleOnChange = ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
        setName(currentTarget.value);
    };

    if (!isLoadUsers) return <WaveLoading />;

    return (
        <div className="flex-1 p-4 space-y-4 chess-bg">
            <div className="max-w-4xl mx-auto space-y-2 fade-in">
                <div className="flex rounded-sm bg-tuna py-2 px-1.5 space-x-2">
                    <div className="grid place-items-center">
                        <FindIcon />
                    </div>
                    <input
                        name="name"
                        className="block w-full bg-transparent focus:outline-none text-mercury"
                        placeholder="Name..."
                        onChange={handleOnChange}
                    />
                </div>
                {Boolean(users.length) ? (
                    users.map((item) => {
                        return (
                            <Link href={routers.userProfile.link + '/' + item.id} key={item.id}>
                                <a
                                    href={routers.userProfile.link + '/' + item.id}
                                    className="flex justify-between px-4 py-2 duration-300 transform shadow-md cursor-pointer background-profile hover:scale-105"
                                >
                                    <div className="flex space-x-4 ">
                                        <img src={item.avatarUrl} alt={item.name} className="object-cover w-12 h-12" />

                                        <div>
                                            <h1 className="text-base text-white capitalize md:text-4xl">{item.name}</h1>
                                            <h3 className="text-sm capitalize md:text-lg text-cloud-700">{item.username}</h3>
                                        </div>
                                    </div>
                                    <h3 className="text-lg text-cloud">ELO: {item.elo}</h3>
                                </a>
                            </Link>
                        );
                    })
                ) : (
                    <div>
                        <div className="my-20 text-4xl text-center text-mercury">User Was Not Found</div>
                    </div>
                )}
                <Pagination amount={5} currentPage={query.currentPage} />
            </div>
        </div>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext<{ currentPage: string; pageSize: string; name: string }>) {
    const { query } = context;

    return { props: { query } };
}

export default Community;