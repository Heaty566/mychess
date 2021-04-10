import { createAsyncThunk } from '@reduxjs/toolkit';

import { IUser } from '../../store/auth/interface';
import { UserAPI, userAPI } from '../../api/user';

class UserThunk {
    constructor(private readonly apiCall: UserAPI) {}

    getCurrentUser = createAsyncThunk<IUser, void>('getCurrentUser', async () => {
        const res = await this.apiCall.getCurrentUser();
        return res.data.data;
    });
}

export const userThunk = new UserThunk(userAPI);
export default userThunk;
