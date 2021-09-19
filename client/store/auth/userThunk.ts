import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../common/interface/user.interface';
import { userAPI } from '../../api/userApi';
import { authThunk } from './thunk';

export const userThunk = {
    getCurrentUser: createAsyncThunk<User, void>('getCurrentUser', async (_, { dispatch }) => {
        const res = await userAPI.getCurrentUser();
        await dispatch(authThunk.getSocketToken());
        return res.data.data;
    }),
    updateUserAvatar: createAsyncThunk<void, File>('updateUserAvatar', async (file) => {
        await userAPI.updateUserAvatar(file);
        return;
    }),
};
