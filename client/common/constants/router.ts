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
    | 'support'
    | 'forgotPasswordEmail'
    | 'forgotPasswordPhone'
    | 'userProfile'
    | 'userEdit'
    | 'resetPassword'
    | '404'
    | 'updateWithOTP'
    | 'ticTacToeBot'
    | 'ticTacToePvP'
    | 'chessPvP';

const config: Record<TRouters, IRouter> = {
    home: {
        link: '/',
        header: {
            title: 'Home',
            canonical: '/',
            description: 'My Chess',
            isIndexPage: true,
        },
    },
    community: {
        link: '/community?name=&currentPage=0&pageSize=12',
        header: {
            title: 'Community',
            canonical: '/community?name=&currentPage=0&pageSize=12',
            description: 'My Game',
        },
    },

    support: {
        link: '/support',
        header: {
            title: 'Support Center',
            canonical: '/support',
            description: 'My Game',
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
        },
    },
    forgotPasswordPhone: {
        link: '/auth/reset-phone',
        header: {
            title: 'Reset Password',
            canonical: '/auth/reset-phone',
            description: 'Send an OTP to your phone number',
        },
    },
    userProfile: {
        link: '/user/profile',
        header: {
            title: 'Profile',
            canonical: '/user/profile',
            description: 'Send an OTP to your phone number',
        },
    },
    userEdit: {
        link: '/user/profile/edit',
        header: {
            title: 'Edit Profile',
            canonical: '/user/profile/edit',
            description: 'Send an OTP to your phone number',
        },
    },
    resetPassword: {
        link: '/auth/reset-password',
        header: {
            title: 'Reset Password',
            canonical: '/auth/reset-phone',
            description: 'Send an OTP to your phone number',
        },
    },
    updateWithOTP: {
        link: '/user/update-with-otp',
        header: {
            title: 'Update User',
            canonical: '/user/update-with-otp',
            description: 'Send an OTP to your phone number',
        },
    },
    ticTacToeBot: {
        link: '/game/tic-tac-toe-bot',
        header: {
            title: 'Tic Tac Toe Bot',
            canonical: '/game/tic-tac-toe-bot',
            description: 'Please Tic Tac Toe with bot',
        },
    },
    ticTacToePvP: {
        link: '/game/tic-tac-toe',
        header: {
            title: 'Tic Tac Toe',
            canonical: '/game/tic-tac-toe',
            description: 'play Tic Tac Toe with other player',
        },
    },
    chessPvP: {
        link: '/game/chess',
        header: {
            title: 'Chess',
            canonical: '/game/chess',
            description: 'play Tic Tac Toe with other player',
        },
    },
    '404': {
        link: '/404',
        header: {
            title: 'Not Found',
            canonical: '/404',
            description: 'Send an OTP to your phone number',
        },
    },
};

export default config;
