import { useReducer } from "react";
import Database from "../../Database";
import RestTimer from "../../utils/RestTimer";
import { Sounds } from "../../utils/Sound";

const DefaultSettings: Settings = {
    _id: 'settings',
    weightUnit: 'metric',
    distanceUnit: 'metric',
    sizeUnit: 'metric',
    soundEffects: true,
    screenAwake: true,
    theme: {
        mode: 'light',
        primaryColor: '#FC5350'
    },
    vibrateOnRestFinish: true,
    restFinishSound: "delightful"
}
export interface Settings {
    _id: 'settings',
    _rev?: string,
    weightUnit: 'metric' | 'imperial',
    distanceUnit: 'metric' | 'imperial',
    sizeUnit: 'metric' | 'imperial',
    soundEffects: boolean,
    screenAwake: boolean,
    theme: {
        mode: 'light' | 'dark',
        primaryColor: string
    },
    vibrateOnRestFinish: boolean,
    restFinishSound: Sounds
}
const Reducer = (state: Settings, action: Partial<Settings>) => {
    let x = Object.create(state);
    Object.assign(Settings.current, action) as Settings;
    Settings.save();
    return Object.assign(x, action) as Settings;
}
export class Settings {
    static current: Settings = DefaultSettings
    static init() {
        Database<Settings>().get('settings').then((doc) => {
            console.log(doc)
            Settings.current = doc || DefaultSettings;
        }).catch((err) => {
            console.log(err)
        })
    }
    static save() {
        console.log(Settings.current)
        return Database<Settings>().put(Settings.current).then(r => {
            console.log(r)
            Settings.current._rev = r.rev
            return r.ok
        }).catch((err)=>{
            return false
        });
    }
    static unit = {
        weight: {
            metric: 'kg',
            imperial: 'lbs'
        },
        distance: {
            metric: 'm',
            imperial: 'ft'
        },
        size: {
            metric: 'cm',
            imperial: 'in'
        }
    }
}
export default function useSettings() {
    return useReducer(Reducer, Settings.current);
}
export function InitSettings() {
    Settings.init()
    RestTimer.Load();
}