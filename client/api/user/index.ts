import { AxiosInstance } from 'axios';

import { IApiResponse } from '../../store/api/interface';
import { IUser } from '../../store/auth/interface';
import http from '../axiosCommon';

export class UserAPI {
    constructor(private readonly apiCall: AxiosInstance, readonly prefix: string) {
        this.apiCall.defaults.baseURL = `${process.env.SERVER_URL + prefix}`;
    }

    async getCurrentUser() {
        const res = await this.apiCall.get<IApiResponse<IUser>>('/');
        return res;
    }
}

export const userAPI = new UserAPI(http(), '/user');
export default userAPI;
