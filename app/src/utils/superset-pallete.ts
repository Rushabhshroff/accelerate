import { WorkoutController } from "./workout-contoller"

export class SupersetPallete {
    static colors = [
        "#a55eea",
        "#4b7bec",
        "#20bf6b",
        "#f7b731",
        "#fa8231",
        "#fc5c65",
        "#0fb9b1",
        "#747d8c"
    ]
    static next(index: number) {
        let l = SupersetPallete.colors.length;
        let i = index % l;
        return SupersetPallete.colors[i]
    }
}