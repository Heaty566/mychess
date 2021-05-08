import * as React from 'react';

export function usePopUpNewWindow(handleOnClose: () => void): [(url: string) => void, Window | undefined] {
    const [isListen, setIsListen] = React.useState<boolean>(false);
    const [newWindow, setWindow] = React.useState<Window>();

    React.useEffect(() => {
        let intervalId: any;
        if (isListen) intervalId = setInterval(handleOnClose, 200);

        return () => clearInterval(intervalId);
    }, [isListen]);

    const openInNewTab = (url: string) => {
        const currentWindow = window.open(url, '_blank');
        if (currentWindow) {
            setIsListen(true);
            setWindow(currentWindow);
        }
    };

    return [openInNewTab, newWindow];
}

export default usePopUpNewWindow;
