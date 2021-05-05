import GoogleLoginIcon from '../../../public/asset/icons/google-login';
import FacebookLoginIcon from '../../../public/asset/icons/facebook-login';
import GithubLoginIcon from '../../../public/asset/icons/github-login';

export interface ILoginSocial {
    label: string;
    Icon: any;
    url: string;
}

const config: Array<ILoginSocial> = [
    { Icon: GoogleLoginIcon, label: 'Continue with Google', url: '/api/auth/google' },
    { Icon: FacebookLoginIcon, label: 'Continue with Facebook', url: '/api/auth/facebook' },
    { Icon: GithubLoginIcon, label: 'Continue with Github', url: '/api/auth/github' },
];

export default config;
