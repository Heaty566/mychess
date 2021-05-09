import router from '../../common/constants/router';

interface UserDropDownItem {
    label: string;
    link: (id: string) => string;
}

interface NavbarSideItem {
    label: string;
    link: string;
    isAppearOnLogin: boolean;
}

export interface NavbarItem {
    label: string;
    link: string;
}
interface LanguageItem {
    label: string;
    key: string;
}

export const userDropDownConfig: Array<UserDropDownItem> = [
    {
        label: 'Profile',
        link: (id: string) => `${router.userProfile.link}/${id}`,
    },
    {
        label: 'Edit Profile',
        link: () => `${router.userEdit.link}`,
    },
];

export const navbarMobileConfig: Array<NavbarSideItem> = [{ label: 'LOGIN', link: router.login.link, isAppearOnLogin: false }];

export const navbarMenuConfig: Array<NavbarItem> = [
    {
        label: 'GAMES',
        link: router.home.link,
    },
    {
        label: 'COMMUNITY',
        link: router.community.link,
    },
    {
        label: 'ABOUT',
        link: router.about.link,
    },
    {
        label: 'SUPPORT',
        link: router.support.link,
    },
];

export const languageData: Array<LanguageItem> = [{ label: 'English', key: 'en' }];
