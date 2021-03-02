export const capitalize = (str: string) => {
        const newStr = str

                .split(" ")
                .map((item) => item.charAt(0).toUpperCase() + item.substring(1))
                .join(" ");

        return newStr;
};
export const capitalizeFirst = (str: string) => {
        const newStr = str.charAt(0).toUpperCase() + str.substring(1);

        return newStr;
};
