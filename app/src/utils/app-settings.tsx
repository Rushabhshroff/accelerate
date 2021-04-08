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
        mode: 'light' | 'dark' | 'auto',
        primaryColor: string
    },
    timerSeconds: number,
    timerRaiseInterval: number,
    vibrateOnRestFinish: boolean,
    restFinishSound: Sounds
}
export class AppSettings {
    static current: AppSettings = DefaultSettings
    static saving: boolean = false;
    static Load() {
        return connection<AppSettings>().get('settings').then((doc) => {
            AppSettings.current = doc || DefaultSettings;
        }).catch((err) => {
            console.log(err)
        })
    }
    static save() {
        if (AppSettings.saving) {
            return;
        }
        AppSettings.saving = true;
        return connection<AppSettings>().put(AppSettings.current).then(r => {
            AppSettings.current._rev = r.rev
            return r.ok
        }).catch((err) => {
            console.log(err)
            return false
        }).finally(() => {
            AppSettings.saving = false;
        });
    }
}