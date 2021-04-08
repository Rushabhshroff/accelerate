import moment from "moment";
import { Workout } from "../database";
import xlsx from 'xlsx'
import { Plugins } from '@capacitor/core';
import { isPlatform } from "@ionic/react";

const { Share } = Plugins;
export interface CSVExportObject {
    title: string,
    start_time: string,
    end_time: string,
    exercise_title: string,
    superset_id: string,
    exercise_notes: string,
    set_index: string,
    set_type: string,
    weight: string,
    reps: string,
    distance: string,
    duration: string,
}
const EmptyCSVObject: CSVExportObject = {
    title: '',
    start_time: '',
    end_time: '',
    exercise_title: '',
    superset_id: '',
    exercise_notes: '',
    set_index: '',
    set_type: '',
    weight: '',
    reps: '',
    distance: '',
    duration: '',
}
export class DataExporter {
    static async ExportCSV() {
        let data: CSVExportObject[] = []
        return Workout.getAll().then(async (res) => {
            for (let d of res.docs) {
                let workout = new Workout(d);
                await workout.exercises().then(async (exs) => {
                    for (let ex of exs) {
                        let index = 0;
                        for (let set of ex.sets) {
                            let ob: CSVExportObject = {
                                title: workout.name,
                                start_time: moment(workout.startTimestamp).format('DD MMM YYYY, hh:mm A'),
                                end_time: workout.endTimestamp ? moment(workout.endTimestamp).format('DD MMM YYYY, hh:mm A') : '',
                                exercise_title: ex.exerciseName,
                                exercise_notes: ex.note || '',
                                superset_id: ex.superset || '',
                                set_index: String(index),
                                set_type: set.setType,
                                weight: set.weight ? `${set.weight} ${ex.units.weight}` : '',
                                reps: set.reps ? `${set.reps}` : '',
                                distance: set.distance ? `${set.distance} ${ex.units.distance}` : '',
                                duration: set.time ? set.time : ''
                            }
                            index++;
                            data.push(ob)
                        }
                    }
                })
            }
        }).then(async () => {
            if (data.length <= 0) {
                data.push(EmptyCSVObject)
            }
            if (isPlatform('capacitor')) {
                let sheet = xlsx.utils.json_to_sheet(data);
                let csv = xlsx.utils.sheet_to_csv(sheet);
                let file = new File([csv], 'WorkoutData.csv', { type: 'text/csv' })
                await Share.share({
                    dialogTitle: "Export Workout CSV",
                    //@ts-ignore
                    files: [file]
                })
            }
        })
    }
}

