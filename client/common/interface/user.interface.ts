export interface User {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    elo: number;
    email: string;
    phoneNumber: string;
    createDate: string;
}

export interface PublicUser {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    elo: number;
    createDate: string;
}

export interface AuthState extends User {
    isLogin: boolean;
    isSocketLogin: boolean;
}
