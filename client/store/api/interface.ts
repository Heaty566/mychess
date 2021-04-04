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
