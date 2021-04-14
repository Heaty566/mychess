export interface UpdateUserEmailDto {
    email: string;
}

export interface UpdateUserPhoneDto {
    phoneNumber: string;
}

export interface UpdateUserInfoDto {
    name: string;
}

export interface UpdateUserAvatarDto {
    avatar: File | null;
}

export interface ResetUserPasswordDto {
    newPassword: string;
    confirmNewPassword: string;
}
export interface CommonUser {
    avatarUrl: string;
    createDate: string;
    elo: 0;
    id: string;
    name: string;
    username: string;
}
