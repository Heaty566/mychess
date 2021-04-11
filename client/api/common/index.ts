import { AxiosInstance } from 'axios';

import http from '../axiosCommon';
import { IApiResponse } from '../../store/api/interface';
import { IUser } from '../../store/auth/interface';
import { SupportDto } from './dto';

export class CommonAPI {
    constructor(private readonly apiCall: AxiosInstance, private readonly prefix: string) {}

    async sendFeedBack(input: SupportDto) {
        const url = `${this.prefix + '/support'}`;
        const res = await this.apiCall.post<IApiResponse<void>>(url, input);
        return res;
    }
}

export const commonAPI = new CommonAPI(http, '');
export default commonAPI;
