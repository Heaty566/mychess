export interface JoiError {
    [key: string]: string;
}
export interface ServerResponse<T> {
    data: T;
    details: JoiError;
}
export interface ApiState {
    isLoading: boolean;
    errorDetails: JoiError;
    isError: boolean;
    message: string;
    errorMessage: string;
}
