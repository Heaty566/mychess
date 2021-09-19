import * as React from 'react';
import Cookies from 'universal-cookie';

import { usePopUpNewWindow } from '../../common/hooks/usePopUpNewWindow';
import config from './config';

export interface LoginSocialProps {}

export const FormSocialLogin: React.FunctionComponent<LoginSocialProps> = () => {
    const cookies = new Cookies();
    const [openNewWindow, newWindow] = usePopUpNewWindow(() => {
        const reToken = cookies.get('re-token');

        if (reToken && newWindow) {
            newWindow.close();
            window.location.reload();
        }
    });

    return (
        <div className="space-y-4">
            {config.map((item) => (
                <a
                    aria-hidden
                    key={item.label}
                    href={process.env.SERVER_URL + item.url}
                    className="flex px-4 py-2 space-x-4 font-semibold duration-300 bg-gray-700 rounded-sm cursor-pointer text-mercury hover:bg-gray-600"
                >
                    <item.Icon />
                    <span>{item.label}</span>
                </a>
            ))}
        </div>
    );
};
