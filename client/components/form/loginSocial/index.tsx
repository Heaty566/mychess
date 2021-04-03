import * as React from 'react';
import Cookies from 'universal-cookie';
import config from './config';

export interface LoginSocialProps {}

const LoginSocial: React.FunctionComponent<LoginSocialProps> = () => {
        const [isListen, setIsListen] = React.useState<boolean>(false);
        const [newWindow, setWindow] = React.useState<Window>();
        const cookies = new Cookies();

        const handleOnLoginWithSocial = () => {
                const reToken = cookies.get('re-token');
                if (reToken && newWindow) {
                        newWindow.close();
                        window.location.reload();
                }
        };

        React.useEffect(() => {
                let intervalId: any;
                if (isListen) intervalId = setInterval(handleOnLoginWithSocial, 200);

                return () => {
                        clearInterval(intervalId);
                };
        }, [isListen]);

        const openInNewTab = (url: string) => {
                const currentWindow = window.open(process.env.SERVER_URL + url, '_blank');
                if (currentWindow) {
                        setIsListen(true);
                        setWindow(currentWindow);
                }
        };
        return (
                <div className="space-y-4">
                        {config.map((item) => (
                                <div
                                        aria-hidden
                                        key={item.label}
                                        onClick={() => openInNewTab(item.url)}
                                        className="bg-gray-700 py-2 px-4 flex space-x-4 text-mercury font-semibold rounded-sm duration-300 hover:bg-gray-600 cursor-pointer"
                                >
                                        <item.Icon />

                                        <span>{item.label}</span>
                                </div>
                        ))}
                </div>
        );
};

export default LoginSocial;
