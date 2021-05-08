import * as React from 'react';

export function useDebounce(value: any = '', delay: number = 1000) {
    const [currentValue, setCurrentValue] = React.useState(value);
    React.useEffect(() => {
        const timeOutId = setTimeout(() => {
            setCurrentValue(value);
        }, delay);

        return () => clearTimeout(timeOutId);
    }, [value, delay]);

    return currentValue;
}
