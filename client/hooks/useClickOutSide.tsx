import { useEffect, useRef } from 'react';

interface IUseClickOutSide {
        callBackOutside: Function;
        callbackInside?: Function;
        exceptElement?: string[];
}

export function useClickOutSide<T extends HTMLElement>({ callBackOutside, callbackInside, exceptElement = [] }: IUseClickOutSide) {
        const eleRef = useRef<T>(null);

        useEffect(() => {
                document.addEventListener('mousedown', handleOnClick, false);

                return () => {
                        document.removeEventListener('mousedown', handleOnClick, false);
                };
        }, []);

        const handleOnClick = (e: any) => {
                const isTriggerException = exceptElement.some((item) => e.target.classList.contains(item));
                if (isTriggerException) return;

                if (eleRef.current?.contains(e.target)) {
                        if (callbackInside) callbackInside();

                        return;
                }
                callBackOutside();
        };

        return eleRef;
}
