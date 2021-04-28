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

export interface IUser {
    username: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: string;
}

export interface IAuthState extends IUser {
    isLogin: boolean;
}
