interface IRouter {
        link: string;
}

type TRouters = 'login' | 'home' | 'community' | 'about' | 'support';

const config: Record<TRouters, IRouter> = {
        home: {
                link: '/home',
        },
        community: {
                link: '/home',
        },
        about: {
                link: '/home',
        },
        support: {
                link: '/home',
        },
        login: {
                link: '/home',
        },
};

export default config;
