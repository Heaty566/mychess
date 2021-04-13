import * as React from 'react';

export function useUploadFile(): [File | undefined, (event: React.ChangeEvent<HTMLInputElement>) => void] {
    const [file, setFile] = React.useState<File>();

    const handleOnChange = ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
        if (currentTarget.files) {
            const file = currentTarget.files[0];
            setFile(file);
        }
    };

    return [file, handleOnChange];
}
