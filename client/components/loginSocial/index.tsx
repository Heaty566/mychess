import { type } from "os";
import * as React from "react";
import { Component } from "react";

export interface LoginSocialProps {}

const socialIcon = {
        google: (
                <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0)">
                                <path
                                        d="M5.31891 14.5035L4.4835 17.6222L1.43011 17.6868C0.517594 15.9943 0 14.0578 0 12C0 10.0101 0.483938 8.13362 1.34175 6.48132H1.34241L4.06078 6.9797L5.25159 9.68176C5.00236 10.4084 4.86652 11.1884 4.86652 12C4.86661 12.8809 5.02617 13.7249 5.31891 14.5035Z"
                                        fill="#FBBB00"
                                />
                                <path
                                        d="M23.7902 9.75824C23.928 10.4841 23.9999 11.2338 23.9999 12C23.9999 12.8591 23.9095 13.6971 23.7375 14.5055C23.1533 17.2563 21.6269 19.6582 19.5124 21.358L19.5118 21.3574L16.0878 21.1827L15.6032 18.1576C17.0063 17.3347 18.1028 16.047 18.6804 14.5055H12.2637V9.75824H18.774H23.7902Z"
                                        fill="#518EF8"
                                />
                                <path
                                        d="M19.5119 21.3574L19.5126 21.358C17.4561 23.011 14.8438 24 12.0001 24C7.43018 24 3.457 21.4457 1.43018 17.6868L5.31897 14.5035C6.33236 17.2081 8.94138 19.1334 12.0001 19.1334C13.3148 19.1334 14.5465 18.778 15.6033 18.1576L19.5119 21.3574Z"
                                        fill="#28B446"
                                />
                                <path
                                        d="M19.6596 2.76262L15.7721 5.94525C14.6783 5.26153 13.3853 4.86656 12 4.86656C8.87213 4.86656 6.21431 6.88017 5.25169 9.68175L1.34245 6.48131H1.3418C3.33895 2.63077 7.36223 0 12 0C14.9117 0 17.5814 1.03716 19.6596 2.76262Z"
                                        fill="#F14336"
                                />
                        </g>
                        <defs>
                                <clipPath id="clip0">
                                        <rect width="24" height="24" fill="white" />
                                </clipPath>
                        </defs>
                </svg>
        ),
        facebook: (
                <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                                d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                                fill="#3B5998"
                        />
                        <path
                                d="M15.0168 12.4697H12.8755V20.3142H9.63132V12.4697H8.08838V9.71278H9.63132V7.92876C9.63132 6.65299 10.2373 4.65527 12.9044 4.65527L15.3075 4.66533V7.34136H13.5639C13.2779 7.34136 12.8757 7.48425 12.8757 8.09283V9.71535H15.3002L15.0168 12.4697Z"
                                fill="white"
                        />
                </svg>
        ),
        github: (
                <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                                d="M12 0.499756C18.63 0.499756 24 5.77976 24 12.2918C24 17.5028 20.562 21.9218 15.795 23.4798C15.195 23.5908 14.975 23.2258 14.975 22.9128C14.975 22.6328 14.985 21.8908 14.99 20.9078C18.328 21.6188 19.032 19.3258 19.032 19.3258C19.578 17.9648 20.367 17.6008 20.367 17.6008C21.454 16.8698 20.283 16.8848 20.283 16.8848C19.078 16.9668 18.445 18.0998 18.445 18.0998C17.375 19.9028 15.636 19.3818 14.95 19.0808C14.842 18.3178 14.533 17.7988 14.19 17.5038C16.855 17.2088 19.656 16.1948 19.656 11.6768C19.656 10.3898 19.191 9.33776 18.421 8.51276C18.556 8.21476 18.961 7.01576 18.316 5.39176C18.316 5.39176 17.311 5.07576 15.016 6.60076C14.056 6.33876 13.036 6.20876 12.016 6.20276C10.996 6.20876 9.976 6.33876 9.016 6.60076C6.736 5.07576 5.731 5.39176 5.731 5.39176C5.086 7.01576 5.491 8.21476 5.611 8.51276C4.846 9.33776 4.381 10.3898 4.381 11.6768C4.381 16.2068 7.186 17.2038 9.856 17.4938C9.436 17.8478 9.046 18.5708 9.046 19.6758C9.046 21.2538 9.061 22.5218 9.061 22.9048C9.061 23.2138 8.851 23.5828 8.236 23.4648C3.435 21.9168 0 17.4948 0 12.2918C0 5.77976 5.373 0.499756 12 0.499756Z"
                                fill="white"
                        />
                </svg>
        ),
};

type SocialsType = keyof typeof socialIcon;

interface SocialItemProps {
        label: string;
        icon: SocialsType;
        link: string;
}

const socials = [
        { label: "Google", icon: "google", link: "/" },
        { label: "Facebook", icon: "facebook", link: "/" },
        { label: "Github", icon: "github", link: "/" },
];

const LoginSocial: React.FunctionComponent<LoginSocialProps> = () => {
        return (
                <div>
                        {socials.map((item) => (
                                <a key={item.label} href={item.link} className="flex bg-blueGray-800 hover:bg-blueGray-700 py-2 px-4 mb-4">
                                        {socialIcon[item.icon]}
                                        <p className="text-white">{`Continue with ${item.label}`}</p>
                                </a>
                        ))}
                </div>
        );
};

export default LoginSocial;
