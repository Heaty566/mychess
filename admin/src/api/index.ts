import axios, { AxiosError } from 'axios';
import Cookies from 'universal-cookie';

//* Import
import { IApiResponse } from '../store/api/interface';
import { apiActions } from '../store/api';
import { store } from '../store';

axios.defaults.baseURL = process.env.SERVER_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((req) => {
    store.dispatch(apiActions.initReq());
    return req;
});

axios.interceptors.response.use(
    (response) => {
        store.dispatch(apiActions.resetState());
        return response;
    },
    (error: AxiosError<IApiResponse<null>>) => {
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

export default axios;
