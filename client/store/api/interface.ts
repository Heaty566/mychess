export interface JoiError {
    [key: string]: string;
}
export interface ServerResponse<T> {
    data: T;
    message: string;
    details: JoiError;
}
export interface ApiState {
    isLoading: boolean;
    errorDetails: JoiError;
    isError: boolean;
    message: string;
}
