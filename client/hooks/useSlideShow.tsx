import { RefObject, useCallback, useEffect, useRef, useState, useMemo } from 'react';

export interface SlideItem {
        _id: number;
        [key: string]: any;
}

interface IUseSlideShow<T> {
        data: T[];
        delaySlide?: number;
        transitionTime?: number;
        transitionTimeOnClick?: number;
}

export function useSlideShow<T extends HTMLElement, V extends SlideItem>({
        delaySlide = 5000,
        data,
        transitionTime = 0.4,
        transitionTimeOnClick = 0.2,
}: IUseSlideShow<V>): [V[], RefObject<T>, Function, number] {
        const [current, setCurrent] = useState(0);
        const slideRef = useRef<T>(null);
        const newData = useMemo(() => {
                return [...data, { ...data[0], _id: data.length + 1 }];
        }, [data]);

        const handleOnSetCurrent = (index: number) => {
                if (slideRef.current) {
                        slideRef.current.style.transition = `${transitionTimeOnClick}s`;
                        slideRef.current.style.transform = `translateX(${-100 * index}%)`;
                }
                setCurrent(index);
        };

        const circle = useCallback(
                (value: number) => {
                        if (value < 0) return 0;
                        if (value >= newData.length) return newData.length - 1;
                        return value;
                },
                [newData],
        );

        const handleOnSlide = useCallback(() => {
                if (slideRef.current && current >= newData.length - 1) {
                        slideRef.current.style.transition = `0s`;
                        slideRef.current.style.transform = `translateX(0)`;
                        setCurrent(0);
                }
        }, [current]);

        useEffect(() => {
                if (slideRef.current) {
                        slideRef.current.addEventListener('transitionend', handleOnSlide, false);
                }
                return () => {
                        if (slideRef.current) {
                                slideRef.current.removeEventListener('transitionend', handleOnSlide, false);
                        }
                };
        }, [current, handleOnSlide]);

        useEffect(() => {
                const intervalId = setInterval(() => {
                        if (slideRef.current) {
                                slideRef.current.style.transform = `translateX(${-100 * (current + 1)}%)`;
                                slideRef.current.style.transition = `${transitionTime}s`;
                                setCurrent(current + 1);
                        }
                }, delaySlide);

                return () => {
                        clearInterval(intervalId);
                };
        }, [current]);

        return [newData, slideRef, handleOnSetCurrent, circle(current)];
}
