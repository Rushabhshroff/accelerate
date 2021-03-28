import { useReducer } from "react"

export function useArrayReduer<T>(original: T[]) {
    const reducer = (state: T[], action: T[]) => {
        for (let i = 0; i < action.length; i++) {
            if (original.length <= i) {
                original.push(action[i])
            } else {
                original[i] = action[i]
            }
        }
        if (original.length > action.length) {
            while (original.length !== action.length) {
                original.pop()
            }
        }
        return action
    }
    return useReducer(reducer, original);
}