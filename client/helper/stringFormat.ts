export const limitStringLength = (str: string, limit: number) => {
        return str.length > limit ? str.slice(0, limit - 3) + '...' : str;
};
