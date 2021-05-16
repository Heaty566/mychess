export const capitalize = (str: string) => {
    return str
        .split(' ')
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(' ');
};

export const truncateContent = (str: string, maxLength: number) => {
    const newStr = str.slice(0, maxLength).trim();

    return str.length <= maxLength ? str : newStr + '...';
};
