import { AxiosInstance } from 'axios';

import http from '../axiosCommon';
import { IApiResponse } from '../../store/api/interface';
import { IUser } from '../../store/auth/interface';

export class UserAPI {
    constructor(private readonly apiCall: AxiosInstance, private readonly prefix: string) {}

    async getCurrentUser() {
        const url = `${this.prefix + '/'}`;
        const res = await this.apiCall.get<IApiResponse<IUser>>(url);
        return res;
    }
    async getUserById(userId: string) {
        const url = `${this.prefix}/${userId}`;
        const res = await this.apiCall.get<IApiResponse<IUser>>(url);
        return res;
    }
}

export const userAPI = new UserAPI(http, '/user');
export default userAPI;
