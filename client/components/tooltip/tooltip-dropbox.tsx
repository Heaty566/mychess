import * as React from 'react';

export interface TooltipProps {
    content: string;
    position: 'top-full' | 'left-full' | 'right-full' | 'bottom-full';
    maxLength: number;
}

const Tooltip: React.FunctionComponent<TooltipProps> = ({ content, position, children, maxLength }) => {
    return (
        <div className="relative tooltip">
            {children}
            {content.length > maxLength && (
                <div
                    className={`absolute z-10 p-2 text-white duration-300 transform translate-y-4 opacity-0 invisible ${position} bg-woodsmoke content`}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
