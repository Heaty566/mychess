import * as React from 'react';

export function useTimer(resetTime: number, initIsRunning: boolean, circle = false): [number, boolean, (value: boolean) => void] {
    const [time, setTime] = React.useState<number>(0);
    const [startTime, setStartTime] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(initIsRunning);

    React.useEffect(() => {
        if (isRunning || circle) setStartTime(Date.now());
    }, [isRunning]);

    React.useEffect(() => {
        let intervalId: any;

        if (isRunning || (circle && isRunning)) {
            intervalId = setInterval(() => {
                if (time + 1 >= resetTime) {
                    setTime(0);
                    if (!circle) setIsRunning(false);
                }

                setTime(((Date.now() - startTime) / 1000) % resetTime);
            }, 500);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [startTime, isRunning, setIsRunning, time]);

    return [
        Math.round(time),
        isRunning,
        (value: boolean) => {
            setIsRunning(value);
            setTime(0);
        },
    ];
}

export default useTimer;
