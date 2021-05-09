import * as React from 'react';

export function useCountDown(totalTime: number, isStart: boolean, isPause: boolean): [number, boolean] {
    const [time, setTime] = React.useState<number>(totalTime);
    const [startTime] = React.useState(new Date());
    const [isFinish, setIsFinish] = React.useState(false);

    React.useEffect(() => {
        let intervalId: any;

        if (isStart && !isPause)
            intervalId = setInterval(() => {
                const passTime = new Date().getTime() - new Date(startTime).getTime();
                if (totalTime - passTime <= 0) setIsFinish(true);

                setTime(totalTime - passTime);
            }, 500);

        return () => clearInterval(intervalId);
    }, [time, isStart, isPause]);

    return [Math.round(time / 1000), isFinish];
}

export default useCountDown;
