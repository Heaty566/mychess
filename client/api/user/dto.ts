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
