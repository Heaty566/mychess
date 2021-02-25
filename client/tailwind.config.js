const colors = require("tailwindcss/colors");

module.exports = {
        purge: [],
        darkMode: false, // or 'media' or 'class'
        theme: {
                extend: {
                        width: {
                                352: "22rem",
                        },
                        colors: {
                                coolGray: colors.coolGray,
                                blueGray: colors.blueGray,
                                "catskill-white": {
                                        DEFAULT: "#F5F7FA",
                                        50: "#FFFFFF",
                                        100: "#FFFFFF",
                                        200: "#FFFFFF",
                                        300: "#FFFFFF",
                                        400: "#FFFFFF",
                                        500: "#F5F7FA",
                                        600: "#D3DCE9",
                                        700: "#B1C1D8",
                                        800: "#8FA5C7",
                                        900: "#6D8AB6",
                                },
                        },
                },
        },
        variants: {
                extend: {},
        },
        plugins: [],
};
