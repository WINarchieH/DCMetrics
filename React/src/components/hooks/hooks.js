import { useEffect, useRef, useState } from 'react';

// Hook for storing and changing objects.
export const useInputState = (initial) => {
    const [input, setInput] = useState(initial);

    const handleInputEvent = (e) => {
        setInput({
            ...input,
            [e.currentTarget.name]: e.currentTarget.value
        })
    };

    const setInputName = (name, value) => {
        setInput({
            ...input,
            [name]: value
        })
    };

    return [input, setInput, setInputName, handleInputEvent];
};

// Hook storing previous value.
export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

// Run function once on render 
export const useMountEffect = (fun) => useEffect(fun, [])