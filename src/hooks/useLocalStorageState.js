import React, {useState} from "react";

const useLocalStorageState = (key, defaultValue) =>{
    let v = localStorage.getItem(key)
    if (v === null){
        v = defaultValue
    }
    else{
        v = JSON.parse(v)
    }
    const [value, setValue] = useState(v)

    const setValueWrapper = (v) =>{
        localStorage.setItem(key, JSON.stringify(v))
        setValue(v)
    }

    return [value, setValueWrapper]
   
}

export default useLocalStorageState