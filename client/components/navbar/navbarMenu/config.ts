import router from '../../../common/constants/router';

export interface INavbarItem {
    label: string;
    link: string;
}

const config: Array<INavbarItem> = [
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

export default config;
