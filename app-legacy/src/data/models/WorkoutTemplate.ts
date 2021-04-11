import model from "../Model";
import { IWorkoutExercise, Workout, WorkoutExercise } from "./Workout";

export type IWorkoutTemplate = {
    name: string,
    note?: string,
    exercises: IWorkoutExercise[]
}

class WorkoutTemplate extends model<IWorkoutTemplate>('workout_template') {
    static async parseWorkout(wrkot: Workout) {
        let exercises = await wrkot.exercises()
        let ex = new WorkoutTemplate({
            name: wrkot.name,
            note: wrkot.note,
            exercises: []
        })
        ex.SetExercises(exercises);
        return ex;
    }
    SetExercises(exercises: IWorkoutExercise[]) {
        this.exercises = exercises.map((e: any) => {
            delete e._id;
            delete e._rev;
            return e as IWorkoutExercise;
        })
    }
    Duplicate(name?: string) {
        let temp = new WorkoutTemplate({ name: name || this.name, note: this.note, exercises: [] });
        temp.SetExercises(this.exercises);
        return temp;
    }
}

export default WorkoutTemplate;