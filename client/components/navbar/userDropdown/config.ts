import router from '../../../common/constants/router';

interface UserDropDownItem {
    label: string;
    link: (id: string) => string;
}

export const config: Array<UserDropDownItem> = [
    {
        label: 'Profile',
        link: (id: string) => `${router.userProfile.link}/${id}`,
    },
    {
        label: 'Edit Profile',
        link: () => `${router.userEdit.link}`,
    },
];
