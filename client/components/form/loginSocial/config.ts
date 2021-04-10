import GoogleLoginIcon from '../../../public/asset/icons/google-login.svg';
import FacebookLoginIcon from '../../../public/asset/icons/facebook-login.svg';
import GithubLoginIcon from '../../../public/asset/icons/github-login.svg';

export interface ILoginSocial {
    label: string;
    Icon: string;
    url: string;
}

const config: Array<ILoginSocial> = [
    { Icon: GoogleLoginIcon, label: 'Continue with Google', url: '/auth/google' },
    { Icon: FacebookLoginIcon, label: 'Continue with Facebook', url: '/auth/facebook' },
    { Icon: GithubLoginIcon, label: 'Continue with Github', url: '/auth/github' },
];

export default config;
