import router from '../../../common/constants/router';

interface NavbarSideItem {
    label: string;
    link: string;
    isAppearOnLogin: boolean;
}

const config: Array<NavbarSideItem> = [{ label: 'LOGIN', link: router.login.link, isAppearOnLogin: false }];

export default config;
