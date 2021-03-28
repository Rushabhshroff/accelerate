import model from "../model";

export interface IWorkout {
    name: string,
    startTimestamp: number,
    endTimestamp?: number,
    note?: string,
}

export class Workout extends model<IWorkout>('workout') {
    
}