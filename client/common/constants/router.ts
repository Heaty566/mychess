import { SeoHeadProps } from '../../components/common/seoHead';
interface IRouter {
    link: string;
    header: SeoHeadProps;
}

type TRouters = 'register' | 'login' | 'home' | 'community' | 'about' | 'support' | 'forgotPasswordEmail' | 'forgotPasswordPhone';

const config: Record<TRouters, IRouter> = {
    home: {
        link: '/',
        header: {
            title: 'Home',
            canonical: '/',
            description: 'My Game',
            isIndexPage: true,
        },
    },
    community: {
        link: '/',
        header: {
            title: 'Home',
            canonical: '/',
            description: 'My Game',
            isIndexPage: true,
        },
    },
    about: {
        link: '/',
        header: {
            title: 'Home',
            canonical: '/',
            description: 'My Game',
            isIndexPage: true,
        },
    },
    support: {
        link: '/support',
        header: {
            title: 'Home',
            canonical: '/',
            description: 'My Game',
            isIndexPage: true,
        },
    },
    login: {
        link: '/auth/login',
        header: {
            title: 'Login',
            canonical: '/auth/login',
            description: 'Login your account to my game, or connect with other providers',
        },
    },
    register: {
        link: '/auth/register',
        header: {
            title: 'Register',
            canonical: '/auth/register',
            description: 'Register your account to my game, or connect with other providers',
        },
    },
    forgotPasswordEmail: {
        link: '/auth/reset-mail',
        header: {
            title: 'Reset Password',
            canonical: '/auth/reset-mail',
            description: 'Send a reset link to your email',
            isFollowPage: false,
        },
    },
    forgotPasswordPhone: {
        link: '/auth/reset-phone',
        header: {
            title: 'Reset Password',
            canonical: '/auth/reset-phone',
            description: 'Send an OTP to your phone number',
            isFollowPage: false,
        },
    },
};

export default config;
