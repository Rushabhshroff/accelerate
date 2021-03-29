export function oneRM(weight: number, reps: number) {
    return Math.round(weight * (36 / (37 - reps)))
}