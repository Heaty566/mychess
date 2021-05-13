export const convertTimeToNumber = (time: number) => {
    const totalRemain = time / 1000;
    const minutes = Math.floor(totalRemain / 60);
    const seconds = Math.floor(totalRemain - minutes * 60);
    if (totalRemain <= 0) return '00:00';
    const formatMinutes = minutes >= 10 ? minutes : `0${minutes}`;
    const formatSeconds = seconds >= 10 ? seconds : `0${seconds}`;
    return `${formatMinutes}:${formatSeconds}`;
};
