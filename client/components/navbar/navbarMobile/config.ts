import menuConfig, { INavbarItem } from '../navbarMenu/config';
import router from '../../../common/constants/router';

const config: Array<INavbarItem> = [...menuConfig, { label: 'LOGIN', link: router.login.link }];

export default config;
