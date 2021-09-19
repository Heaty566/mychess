import http from './axiosCommon';
import { ServerResponse } from '../common/interface/api.interface';
import { SupportDto } from '../common/interface/dto/common.dto';

export const commonAPI = {
    sendFeedBack: async (input: SupportDto) => {
        const url = `/support`;
        const res = await http.post<ServerResponse<void>>(url, input);
        return res;
    },
};
