module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:react/recommended', 'airbnb'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            tsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'no-use-before-define': 'off',
        'react/prop-types': 'off',
        'react/jsx-indent': 'off',
        'linebreak-style': 'off',
        'react/jsx-indent-props': 'off',
        'object-curly-newline': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-param-reassign': ['warn', { props: false, ignorePropertyModificationsFor: ['bar'] }],
        indent: 'off',
        'no-unused-vars': ['error', { args: 'none' }],
        '@typescript-eslint/no-use-before-define': ['error'],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
    },
};
