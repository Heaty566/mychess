interface IRouter {
    link: string;
}

type TRouters = 'register' | 'login' | 'home' | 'community' | 'about' | 'support';

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
        link: '/auth/login',
    },
    register: {
        link: '/auth/login',
    },
};

export default config;
