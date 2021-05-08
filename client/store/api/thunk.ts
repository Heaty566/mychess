import { createAsyncThunk } from '@reduxjs/toolkit';

import { SupportDto } from '../../common/interface/dto/common.dto';
import { CommonAPI, commonAPI } from '../../api/commonApi';

class CommonThunk {
    constructor(private readonly apiCall: CommonAPI) {}

    sendSupport = createAsyncThunk<null, SupportDto>('sendSupport', async (input) => {
        await this.apiCall.sendFeedBack(input);
        return null;
    });
}
export const commonThunk = new CommonThunk(commonAPI);
export default commonThunk;
