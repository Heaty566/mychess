import { createAsyncThunk } from '@reduxjs/toolkit';

import { SupportDto } from '../../api/common/dto';
import { CommonAPI, commonAPI } from '../../api/common';

class CommonThunk {
    constructor(private readonly apiCall: CommonAPI) {}

    sendSupport = createAsyncThunk<null, SupportDto>('sendSupport', async (input) => {
        await this.apiCall.sendFeedBack(input);
        return null;
    });
}
export const commonThunk = new CommonThunk(commonAPI);
export default commonThunk;
