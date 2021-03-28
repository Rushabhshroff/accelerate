import { useEffect, useState } from "react";

export function useDimension() {
    const [dimension, SetDimension] = useState({ width: window?.innerWidth || 0, height: window?.innerHeight || 0 })
    useEffect(() => {
        const OnDimensionChange = () => {
            SetDimension({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', OnDimensionChange);
        return () => {
            window.removeEventListener('resize', OnDimensionChange)
        }
    }, [])
    return dimension;
}