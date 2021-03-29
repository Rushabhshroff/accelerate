import { Exercise } from "..";
import model from "../model";

export interface IWorkout {
    name: string,
    startTimestamp: number,
    endTimestamp?: number,
    note?: string,
}

export class Workout extends model<IWorkout>('workout') {
    exercises() {
        return Exercise.find({
            selector: {
                workoutId: this._id
            }
        }).then((res) => {
            return res.docs.map((r) => new Exercise(r))
        })
    }
}