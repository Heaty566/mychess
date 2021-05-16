import Link from 'next/link';
import * as React from 'react';

export interface PaginationProps {
    amount: number;
    currentPage: string | undefined;
    total: number;
    pageSize: number;
}

const Pagination: React.FunctionComponent<PaginationProps> = ({ amount = 5, currentPage, total, pageSize }) => {
    const generateLink = (number: number) => {
        var queryParams = new URL(window.location.href);
        queryParams.searchParams.set('currentPage', String(number));

        return queryParams.pathname + queryParams.search;
    };
    const maxPage = Math.floor(total / pageSize);
    const range = (center: number) => {
        const half = Math.floor(amount / 2);

        const start = center < half ? 0 : center - half;

        const end = start + amount;

        let arr = [];
        for (let index = start; index < end; index++) {
            if (index < maxPage) arr.push(index);
        }
        return arr;
    };

    const formatCurrentPage = currentPage ? Number(currentPage) : 0;
    if (maxPage <= 1) return null;
    return (
        <div className="flex items-center justify-center space-x-4">
            <Link href={`${generateLink(0)}`}>
                <a href={`${generateLink(0)}`} className="block p-1 px-2.5 font-semibold bg-white rounded-sm">
                    First
                </a>
            </Link>
            {range(formatCurrentPage).map((item) => {
                return (
                    <Link href={`${generateLink(item)}`} key={item}>
                        <a href={`${generateLink(item)}`} className="block p-1 px-2.5 font-semibold bg-white rounded-sm">
                            {item + 1}
                        </a>
                    </Link>
                );
            })}
            <Link href={`${generateLink(maxPage)}`}>
                <a href={`${generateLink(maxPage)}`} className="block p-1 px-2.5 font-semibold bg-white rounded-sm">
                    Last
                </a>
            </Link>
        </div>
    );
};

export default Pagination;
