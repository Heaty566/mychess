import { AxiosInstance } from 'axios';

import http from '../axiosCommon';
import { IApiResponse } from '../../store/api/interface';
import { IUser } from '../../store/auth/interface';
import { SupportDto } from './dto';

export class CommonAPI {
    constructor(private readonly apiCall: AxiosInstance, private readonly prefix: string) {}

    async sendFeedBack() {
        const url = `${this.prefix + '/about-us'}`;
        const res = await this.apiCall.get<IApiResponse<IUser>>(url);
        return res;
    }
}

export const userAPI = new CommonAPI(http, '');
export default userAPI;
