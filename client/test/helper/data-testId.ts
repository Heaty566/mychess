export const useTestId = (id: string) => {
    // if (process.env.NODE_ENV === 'production') return {};
    id = id.replace(/\s/g, '-').replace('?', '').toLowerCase();

    return {
        'data-testid': id,
    };
};
