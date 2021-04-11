import { useEffect, useRef } from "react";

export function usePrev<T>(val: T) {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = val
    })
    return ref.current;
}