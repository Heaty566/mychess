import { AxiosInstance } from 'axios';

import http from './axiosCommon';
import { ServerResponse } from '../common/interface/api.interface';
import { SupportDto } from '../common/interface/dto/common.dto';

export class CommonAPI {
    constructor(private readonly apiCall: AxiosInstance, private readonly prefix: string) {}

    async sendFeedBack(input: SupportDto) {
        const url = `${this.prefix + '/support'}`;
        const res = await this.apiCall.post<ServerResponse<void>>(url, input);
        return res;
    }
}

export const commonAPI = new CommonAPI(http, '');
export default commonAPI;
