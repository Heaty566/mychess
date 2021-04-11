import Link from 'next/link';
import * as React from 'react';
import { useTestId } from '../../../test/helper/data-testId';

export interface SideLinkProps {
    label: string;
    href: string;
    position: 'text-center' | 'text-left' | 'text-right';
}

const SideLink: React.FunctionComponent<SideLinkProps> = ({ href, label, position }) => (
    <div className={position} {...useTestId(`sideLink-wrapper-${label}`)}>
        <Link href={href}>
            <a href={href} className="text-sm duration-300 text-mercury hover:text-malibu" {...useTestId(`sideLink-link-${label}`)}>
                {label}
            </a>
        </Link>
    </div>
);

export default SideLink;
