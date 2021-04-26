export interface UserLoginDto {
    username: string;
    password: string;
}

export interface UserRegisterDto {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
}
