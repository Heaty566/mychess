import { useEffect, useState } from "react";

export interface UseTimerProps {
        resetTime: number;
        defaultStop?: boolean;
}

const UseTimer = ({ resetTime, defaultStop = false }: UseTimerProps): [number, boolean, () => void] => {
        const [startTime, setStartTime] = useState<number>(new Date().getTime());
        const [endTime, setEndTime] = useState(new Date().getTime());
        const [isFinish, setFinish] = useState(defaultStop);

        useEffect(() => {
                if (!isFinish) {
                        setStartTime(new Date().getTime());
                }
        }, [isFinish]);

        useEffect(() => {
                if (!isFinish) {
                        const countDownEvent = setInterval(() => {
                                if (endTime - startTime > resetTime) {
                                        setFinish(true);
                                } else setEndTime(new Date().getTime());
                        }, 1000);

                        return () => {
                                clearInterval(countDownEvent);
                        };
                }
        }, [startTime, endTime, isFinish]);

        return [endTime - startTime < 0 ? 0 : Math.round((endTime - startTime) / 1000), isFinish, () => setFinish(false)];
};

export default UseTimer;
