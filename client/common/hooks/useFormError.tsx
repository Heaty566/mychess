import * as React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';
import { ApiState } from '../interface/api.interface';

export function useFormError<T>(defaultValues: T) {
    const [errors, setErrors] = React.useState<T>(defaultValues);
    const apiState = useSelector<RootState, ApiState>((state) => state.api);

    React.useEffect(() => {
        const { isError, errorDetails } = apiState;

        if (isError) setErrors({ ...defaultValues, ...errorDetails });
        else setErrors(defaultValues);
    }, [apiState.isError]);

    return errors;
}

export default useFormError;
