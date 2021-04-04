interface IRouter {
    link: string;
}

type TRouters =
    | 'register'
    | 'login'
    | 'home'
    | 'community'
    | 'about'
    | 'support'
    | 'forgotPassword';

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
        link: '/auth/register',
    },
    forgotPassword: {
        link: '/auth/register',
    },
};

export default config;
