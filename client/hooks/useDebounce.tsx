import * as React from "react";

export function useDebouce(value: any = "", delay: number = 1000) {
  const [currentValue, setCurrentValue] = React.useState(value);
  React.useEffect(() => {
    console.log("here " + "------" + value);
    const timeOutId = setTimeout(() => {
      setCurrentValue(value);
    }, delay);

    return () => {
      console.log("day -----" + value);
      clearTimeout(timeOutId);
    };
  }, [value, delay]);

  return currentValue;
}
