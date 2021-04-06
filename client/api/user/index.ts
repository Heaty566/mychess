import http from '../axios.helper';

import { IApiResponse } from '../../store/api/interface';
import { IUser } from '../../store/auth/interface';
import { AxiosInstance } from 'axios';

export class UserAPI {
    constructor(private readonly apiCall: AxiosInstance, readonly prefix: string) {
        apiCall.defaults.baseURL = `${process.env.SERVER_URL + prefix}`;
    }

    async getCurrentUser() {
        const res = await this.apiCall.get<IApiResponse<IUser>>('/');
        return res;
    }
}

export const userAPI = new UserAPI(http, '/user');
export default userAPI;
