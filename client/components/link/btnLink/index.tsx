import Link from 'next/link';
import * as React from 'react';
import { useTestId } from '../../../test/helper/data-testId';

export interface BtnLinkProps {
    label: string;
    href: string;
}

const BtnLink: React.FunctionComponent<BtnLinkProps> = ({ label, href }) => (
    <Link href={href}>
        <a
            href={href}
            className="inline-block bg-gray-800 px-8 py-2 text-white rounded-sm  duration-300 hover:bg-gray-900 outline-none"
            {...useTestId(`btnLink-${label}`)}
        >
            {label}
        </a>
    </Link>
);

export default BtnLink;
