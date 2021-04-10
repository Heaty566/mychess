export interface IUser {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    elo: number;
    email: string;
    phoneNumber: string;
}

export interface IAuthState extends IUser {
    isLogin: boolean;
}
