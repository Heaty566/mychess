import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ApiState } from '../store/api';

export function useLoading(): boolean {
        const [isLoading, setLoading] = React.useState(false);
        const apiState = useSelector<RootState, ApiState>((state) => state.api);

        React.useEffect(() => {
                setLoading(apiState.isLoading);
        }, [apiState.isLoading]);

        return isLoading;
}
