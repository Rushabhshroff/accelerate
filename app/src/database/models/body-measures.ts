import { AppSettings, Unit } from "../../utils";
import { Document } from "../document";
import model from "../model";

export const BodyMeasures: { [key: string]: string } = {
    "weight": "Weight",
    'body-fat-percentage': 'Body Fat Percentage',
    'muscle-mass': 'Muscle Mass',
    'hip': 'Hip',
    'waist': 'Waist',
    "right-bicep-flexed": 'Right Bicep (Flexed)',
    "right-bicep-unflexed": 'Right Bicep (UnFlexed)',
    "left-bicep-flexed": 'Left Bicep (Flexed)',
    "left-bicep-unflexed": 'Left Bicep (UnFlexed)',
    "left-forearm": 'Left Forearm',
    "right forearm": 'Right Forearm',
    "shoulders": 'Shoulders',
    "chest": 'Chest',
    "left-thigh": 'Left Thigh',
    "right-thigh": 'Right Thigh',
    "left-calf": 'Left Calf',
    "right-calf": 'Right Calf',
    "lower-abs": 'Lower Abs',
    "upper-abs": 'Upper Abs',
    "neck": 'Neck',
}
export const BodyMeasureUnits: () => { [key: string]: string } = () => {
    return {
        "weight": AppSettings.current.units.weight,
        'body-fat-percentage': '%',
        'muscle-mass': '%',
        'hip': AppSettings.current.units.size,
        'waist': AppSettings.current.units.size,
        "right-bicep-flexed": AppSettings.current.units.size,
        "right-bicep-unflexed": AppSettings.current.units.size,
        "left-bicep-flexed": AppSettings.current.units.size,
        "left-bicep-unflexed": AppSettings.current.units.size,
        "left-forearm": AppSettings.current.units.size,
        "right forearm": AppSettings.current.units.size,
        "shoulders": AppSettings.current.units.size,
        "chest": AppSettings.current.units.size,
        "left-thigh": AppSettings.current.units.size,
        "right-thigh": AppSettings.current.units.size,
        "left-calf": AppSettings.current.units.size,
        "right-calf": AppSettings.current.units.size,
        "lower-abs": AppSettings.current.units.size,
        "upper-abs": AppSettings.current.units.size,
        "neck": AppSettings.current.units.size,
    }
}
export interface IBodyMeasure extends Document {
    date: string,
    data: { [key: string]: Unit | undefined },
    timestamp: number
}

export class BodyMeasure extends model<IBodyMeasure>('body_measure') {
    constructor(ob?: IBodyMeasure) {
        super(ob);
        for (let key of Object.keys(this.data)) {
            let val = this.data[key];
            if (val) {
                this.data[key] = new Unit(val)
            }
        }
    }
    static date(date: string) {
        return BodyMeasure.find({
            selector: {
                date: date
            }
        }).then((res) => {
            if (res.docs && res.docs.length > 0) {
                return new BodyMeasure(res.docs[0])
            } else {
                return undefined
            }
        })
    }
}