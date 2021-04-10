import * as React from 'react';
import Cookies from 'universal-cookie';

import { usePopUpNewWindow } from '../../../common/hooks/usePopUpNewWindow';
import { useTestId } from '../../../test/helper/data-testId';
import config from './config';

export interface LoginSocialProps {}

const LoginSocial: React.FunctionComponent<LoginSocialProps> = () => {
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
                <div
                    aria-hidden
                    key={item.label}
                    onClick={() => openNewWindow(process.env.SERVER_URL + item.url)}
                    className="bg-gray-700 py-2 px-4 flex space-x-4 text-mercury font-semibold rounded-sm duration-300 hover:bg-gray-600 cursor-pointer"
                    {...useTestId(`loginSocial-${item.label}`)}
                >
                    <item.Icon />

                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default LoginSocial;
