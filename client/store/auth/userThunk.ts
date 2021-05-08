import { createAsyncThunk } from '@reduxjs/toolkit';

import { User } from '../../store/auth/interface';
import { UserAPI, userAPI } from '../../api/user';
import authApi from '../../api/auth';

class UserThunk {
    constructor(private readonly apiCall: UserAPI) {}

    getCurrentUser = createAsyncThunk<User, void>('getCurrentUser', async (_, { dispatch }) => {
        const res = await this.apiCall.getCurrentUser();
        await authApi.getSocketToken();
        return res.data.data;
    });
    updateUserAvatar = createAsyncThunk<void, File>('updateUserAvatar', async (file) => {
        await this.apiCall.updateUserAvatar(file);
        return;
    });
}

export const userThunk = new UserThunk(userAPI);
export default userThunk;
