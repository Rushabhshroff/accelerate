import { Settings } from '../../pages/Settings/hook'
import model from '../Model'


export interface ILog {
    name: string,
    value: number,
    unit: 'imperial' | 'metric',
    timestamp: number
}

export interface ILogTarget {
    _id?: string,
    value: number,
    unit: string
}

export class Log extends model<ILog>('log') {
    static toID(name: string) {
        return name.toLowerCase().replace(/ /g, '-')
    }
    static static(name: string) {
        return class Static {
            static current() {
                return Log.find({
                    selector: {
                        name: name,
                        timestamp: { $gt: null }
                    },
                    sort: [{ timestamp: 'desc' }]
                }).then((res) => {
                    if (res.docs.length > 0) {
                        return new Log(res.docs[0])
                    } else {
                        return undefined;
                    }
                })
            }
            static Log() {
                return AllLogs.find((j) => j.name === name)
            }
            static target() {
                return LogTarget.findById(name.toLowerCase().replace(/ /g, '-')).then((res) => {
                    return new LogTarget(res);
                }).catch((err) => {
                    return undefined;
                })
            }

            static async SetTarget(value: number, unit: string) {
                let target = await Static.target()
                if (!target) {
                    target = new LogTarget();
                    target._id = name.toLowerCase().replace(/ /g, '-')
                }
                Object.assign(target, { value, unit })
                await target.save()
            }
            static async list() {
                return Log.find({
                    selector: {
                        name: name,
                        timestamp: { $exists: true }
                    },
                    sort: [{ timestamp: 'desc' }]
                })
            }
            static async AddLog(value: number, date: Date) {
                let today = await Static.Date(date);
                if (!today) {
                    today = new Log()
                    today.name = name;
                    today.timestamp = new Date(date).getTime()
                }
                today.value = value;
                today.unit = Settings.current.sizeUnit
                await today.save();
                return today;
            }
            static async Date(date: Date) {
                return Log.find({
                    selector: {
                        $and: [
                            {
                                name: name,
                            },
                            {
                                timestamp: { $gte: new Date(date).setHours(0, 0, 0, 0) }
                            },
                            {
                                timestamp: { $lte: new Date(date).setHours(23, 59, 59, 999) }
                            }
                        ]
                    },
                    limit: 1
                }).then((res) => {
                    if (res.docs && res.docs.length > 0) {
                        return new Log(res.docs[0])
                    } else {
                        return undefined;
                    }
                })
            }
        }
    }
}

export class LogTarget extends model<ILogTarget>('log_target') {

}

export const CoreLogs = [
    {
        name: 'weight',
        unit: { metric: 'kg', imperial: 'lbs' },
        icon: 'scale'
    },
    {
        name: 'Caloric Intake',
        unit: { metric: 'kcal', imperial: 'kcal' },
        icon: 'pizza'
    },
    {
        name: 'Water Intake',
        unit: { metric: 'L', imperial: 'L' },
        icon: 'water'
    }
]
export const BodyPartLogs = [
    {
        name: 'Body Fat Percentage',
        unit: { metric: '%', imperial: '%' },
    },
    {
        name: 'Muscle Mass',
        unit: { metric: '%', imperial: '%' },
    },
    {
        name: 'Hip',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Waist',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Right Bicep (Flexed)',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Right Bicep (UnFlexed)',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Left Bicep (Flexed)',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Left Bicep (UnFlexed)',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Left Forearm',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Right Forearm',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Shoulders',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Chest',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Left Thigh',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Right Thigh',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Left Calf',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Right Calf',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Lower Abs',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Upper Abs',
        unit: { metric: 'cm', imperial: 'in' },
    },
    {
        name: 'Neck',
        unit: { metric: 'cm', imperial: 'in' },
    },
]

const AllLogs = BodyPartLogs.concat(CoreLogs)