import axios, { AxiosError } from 'axios';
import Cookies from 'universal-cookie';

import { IApiResponse } from '../store/api/interface';
import { apiActions } from '../store/api';
import { store } from '../store';

const axiosClient = axios.create({
    baseURL: process.env.SERVER_URL,
    withCredentials: true,
});

axiosClient.interceptors.request.use(function (req) {
    store.dispatch(apiActions.initReq());

    return req;
});
axiosClient.interceptors.response.use(
    function (response) {
        store.dispatch(apiActions.resetState());
        return response;
    },
    function (error: AxiosError<IApiResponse<null>>) {
        store.dispatch(apiActions.resetState());
        if (error.response?.status === 400) {
            store.dispatch(apiActions.updateErrorDetails(error.response.data.details));
        }
        if (error.response?.status === 401) {
            const cookies = new Cookies();
            cookies.set('re-token', '', { maxAge: -999 });
            cookies.set('auth-token', '', { maxAge: -999 });
            store.dispatch(apiActions.updateErrorDetails(error.response.data.details));
        }

        return Promise.reject(error.response);
    },
);

export default axiosClient;