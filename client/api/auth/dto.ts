export interface UserLoginDto {
    username: string;
    password: string;
}

export interface UserRegisterDto {
    username: string;
    password: string;
    name: string;
    confirmPassword: string;
}

export interface ForgotPasswordEmailDto {
    email: string;
}
export interface ForgotPasswordPhoneDto {
    phoneNumber: string;
}
export interface ForgotPasswordUpdateDto {
    newPassword: string;
    resetKey: string;
    confirmPassword: string;
}
