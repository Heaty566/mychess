import { SeoHeadProps } from '../../components/common/seoHead';
interface IRouter {
    link: string;
    header: SeoHeadProps;
}

type TRouters =
    | 'register'
    | 'login'
    | 'home'
    | 'community'
    | 'about'
    | 'support'
    | 'forgotPasswordEmail'
    | 'forgotPasswordPhone'
    | 'userProfile'
    | 'userEdit'
    | 'resetPassword'
    | 'updateWithOTP';

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
        link: '/community?name=&currentPage=0&pageSize=12',
        header: {
            title: 'Home',
            canonical: '/',
            description: 'My Game',
            isIndexPage: true,
        },
    },
    about: {
        link: '/about',
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
    userProfile: {
        link: '/user/profile',
        header: {
            title: 'Reset Password',
            canonical: '/auth/reset-phone',
            description: 'Send an OTP to your phone number',
            isFollowPage: true,
        },
    },
    userEdit: {
        link: '/user/profile/edit',
        header: {
            title: 'Reset Password',
            canonical: '/auth/reset-phone',
            description: 'Send an OTP to your phone number',
            isFollowPage: true,
        },
    },
    resetPassword: {
        link: '/auth/reset-password',
        header: {
            title: 'Reset Password',
            canonical: '/auth/reset-phone',
            description: 'Send an OTP to your phone number',
            isFollowPage: true,
        },
    },
    updateWithOTP: {
        link: '/user/update-with-otp',
        header: {
            title: 'Reset Password',
            canonical: '/auth/reset-phone',
            description: 'Send an OTP to your phone number',
            isFollowPage: true,
        },
    },
};

export default config;
