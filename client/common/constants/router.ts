interface IRouter {
    link: string;
}

type TRouters = 'register' | 'login' | 'home' | 'community' | 'about' | 'support' | 'forgotPasswordEmail' | 'forgotPasswordPhone';

const config: Record<TRouters, IRouter> = {
    home: {
        link: '/',
    },
    community: {
        link: '/',
    },
    about: {
        link: '/',
    },
    support: {
        link: '/',
    },
    login: {
        link: '/auth/login',
    },
    register: {
        link: '/auth/register',
    },
    forgotPasswordEmail: {
        link: '/auth/reset-mail',
    },
    forgotPasswordPhone: {
        link: '/auth/reset-phone',
    },
};

export default config;
