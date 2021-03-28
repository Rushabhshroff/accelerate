import { useReducer } from "react"

export function useObjectReducer<T>(original: T) {
    const reducer = (state: T, action: Partial<T>) => {
        Object.assign(original, action);
        return {
            ...state,
            ...action
        } as T
    }
    return useReducer(reducer, original);
}