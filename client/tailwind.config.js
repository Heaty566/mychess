const colors = require("tailwindcss/colors");

module.exports = {
        purge: [],
        darkMode: false, // or 'media' or 'class'
        theme: {
                extend: {
                        width: {
                                88: "22rem",
                        },
                        fontFamily: {
                                sans: ["SFTEXT", "Helvetica", "Arial", "sans-serif"],
                        },
                        colors: {
                                coolGray: colors.coolGray,
                                blueGray: colors.blueGray,
                                warmGray: colors.warmGray,
                                "torch-red": {
                                        DEFAULT: "#F5222D",
                                        50: "#FFFEFE",
                                        100: "#FEE5E6",
                                        200: "#FCB4B8",
                                        300: "#F9848A",
                                        400: "#F7535B",
                                        500: "#F5222D",
                                        600: "#DA0A15",
                                        700: "#A90810",
                                        800: "#79050B",
                                        900: "#480307",
                                },
                                "scarpa-flow": {
                                        DEFAULT: "#52525B",
                                        50: "#C6C6CC",
                                        100: "#B9B9C0",
                                        200: "#9E9EA8",
                                        300: "#838390",
                                        400: "#6A6A76",
                                        500: "#52525B",
                                        600: "#3A3A40",
                                        700: "#222225",
                                        800: "#09090B",
                                        900: "#000000",
                                },
                        },
                },
        },
        variants: {
                extend: {},
        },
        plugins: [],
};
