import { Sounds } from ".";
import { connection } from "../database";
import { Units } from "./units";

const DefaultSettings: AppSettings = {
    _id: 'settings',
    units: {
        weight: 'kg',
        distance: 'km',
        size: 'cm'
    },
    soundEffects: true,
    screenAwake: true,
    theme: {
        mode: 'light',
        primaryColor: '#FC5350'
    },
    timerSeconds: 120,
    timerRaiseInterval: 5,
    vibrateOnRestFinish: true,
    restFinishSound: "delightful"
}
export interface AppSettings {
    _id: 'settings',
    _rev?: string,
    units: Units
    soundEffects: boolean,
    screenAwake: boolean,
    theme: {
        mode: 'light' | 'dark',
        primaryColor: string
    },
    timerSeconds: number,
    timerRaiseInterval: number,
    vibrateOnRestFinish: boolean,
    restFinishSound: Sounds
}
export class AppSettings {
    static current: AppSettings = DefaultSettings
    static Load() {
        connection<AppSettings>().get('settings').then((doc) => {
            AppSettings.current = doc || DefaultSettings;
        }).catch((err) => {
            console.log(err)
        })
    }
    static save() {
        return connection<AppSettings>().put(AppSettings.current).then(r => {
            console.log(r)
            AppSettings.current._rev = r.rev
            return r.ok
        }).catch((err) => {
            return false
        });
    }
}