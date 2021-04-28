import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

export const http = {
    get: axios.get,
    post: axios.post,
    delete: axios.delete,
    put: axios.put,
};

export interface IJoiError {
    [key: string]: string;
}

export interface IApiResponse<T> {
    data: T;
    message: string;
    details: IJoiError;
}

export interface IApiState {
    isLoading: boolean;
    errorDetails: IJoiError;
    isError: boolean;
    message: string;
}
