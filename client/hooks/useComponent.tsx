import { useState, useEffect, useRef, useCallback } from 'react';

import * as React from 'react';

interface useComponentProps<T> {
        Loading?: React.FunctionComponent;
        RefComponent: React.ComponentType<T>;
        offset: number;
        isRender?: boolean;
        delay?: number;
}

export function useComponent<T>({
        RefComponent,
        offset = 200,
        Loading = () => <h1>Loading...</h1>,
        isRender = true,
        delay = 1000,
}: useComponentProps<T>): [Function, boolean] {
        const wrapperRef = useRef<HTMLDivElement>(null);
        const [isIntersect, setIntersect] = useState(false);

        const handleOnIntersection = useCallback(() => {
                if (wrapperRef.current) {
                        const hT = wrapperRef.current.offsetTop;
                        const hH = wrapperRef.current.offsetHeight;
                        const wH = window.innerHeight;
                        const wS = window.pageYOffset;
                        if (wS + offset > hT + hH - wH) {
                                setIntersect(true);
                        }
                }
        }, [offset, wrapperRef.current]);

        useEffect(() => {
                const intervalId = setInterval(() => {
                        if (isRender) setIntersect(true);
                }, delay);

                return () => {
                        clearInterval(intervalId);
                };
        }, []);

        useEffect(() => {
                if (delay < 500) console.error('Delay is too small');
                handleOnIntersection();
                window.addEventListener('scroll', handleOnIntersection);

                return () => {
                        window.removeEventListener('scroll', handleOnIntersection);
                };
        }, [handleOnIntersection]);

        useEffect(() => {
                if (isIntersect && isRender) {
                        {
                                window.removeEventListener('scroll', handleOnIntersection);
                                setComponent(() => RefComponent);
                        }
                }
        }, [isIntersect, handleOnIntersection]);

        const [Component, setComponent] = useState<React.ComponentType<T>>();

        return [
                Component
                        ? (props: T) => <Component {...props} />
                        : () => (
                                  <div ref={wrapperRef}>
                                          <Loading />
                                  </div>
                          ),
                isIntersect,
        ];
}
