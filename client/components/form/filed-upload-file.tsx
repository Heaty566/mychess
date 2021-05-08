import * as React from 'react';

import ImageIcon from '../../public/asset/icons/image';
import LabelMessage from './label-message';

export interface FileUploadProps {
    name: string;
    handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    error: string;
}

const FileUpload: React.FunctionComponent<FileUploadProps> = ({ handleOnChange, name, error, label }) => {
    const [nameFile, setFileName] = React.useState('Chose File');

    const handleChangFileName = ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
        const str = currentTarget.value.split('\\');
        if (str[str.length - 1]) setFileName(str[str.length - 1]);
    };

    return (
        <div>
            <label htmlFor={name} className="flex px-2 py-1.5 bg-tuna text-mercury space-x-1  cursor-pointer w-full">
                <div className="">
                    <ImageIcon />
                </div>
                <p className="overflow-hidden overflow-ellipsis">{nameFile}</p>
                <input
                    className="hidden"
                    name={name}
                    id={name}
                    accept="image/*"
                    type="file"
                    onChange={(event) => {
                        handleChangFileName(event);
                        handleOnChange(event);
                    }}
                />
            </label>
            <LabelMessage label={label} errorMessage={error} successMessage="" />
        </div>
    );
};

export default FileUpload;
