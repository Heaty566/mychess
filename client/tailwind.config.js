const colors = require('tailwindcss/colors');

module.exports = {
        purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
        darkMode: false, // or 'media' or 'class'
        theme: {
                extend: {},
                colors: {
                        ...colors,
                        woodsmoke: {
                                DEFAULT: '#171A21',
                                50: '#7B87A3',
                                100: '#6C7998',
                                200: '#56617B',
                                300: '#41495D',
                                400: '#2C323F',
                                500: '#171A21',
                                600: '#020203',
                                700: '#000000',
                                800: '#000000',
                                900: '#000000',
                        },
                        cloud: {
                                DEFAULT: '#C5C3C0',
                                50: '#FFFFFF',
                                100: '#FFFFFF',
                                200: '#FFFFFF',
                                300: '#F6F6F5',
                                400: '#DDDCDB',
                                500: '#C5C3C0',
                                600: '#ADAAA5',
                                700: '#94908B',
                                800: '#7B7771',
                                900: '#605D59',
                        },
                },
                boxShadow: {
                        menu: '0 0 12px #000000',
                },
        },
        variants: {
                extend: {},
        },
        plugins: [],
};
