import * as React from 'react';

export interface useClickOutSideProps {}

export function useClickOutSide<T extends HTMLElement>(callBack: () => void) {
    const ref = React.useRef<T>(null);

    const handleOnClick = ({ target }: MouseEvent) => {
        if (target instanceof HTMLElement && ref.current && !ref.current.contains(target)) callBack();
    };

    React.useEffect(() => {
        document.addEventListener('click', handleOnClick);

        return () => document.removeEventListener('click', handleOnClick);
    }, []);

    return ref;
}
