export interface IUser {
        username: string;
        name: string;
        email: string;
        avatarUrl: string;
        isPremium: boolean;
        role: string;
}

export interface IAuthState extends IUser {
        isLogin: boolean;
}
