import {useState, useEffect} from "react";

const useStateFromProp = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => setValue(initialValue), [initialValue]);

    return [value, setValue];
}

export default useStateFromProp